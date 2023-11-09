import {
  ClauseMutationActionType,
  IClauseMutationAction,
  IClausePropertiesUpdateInfo,
  ICreateClauseRequest,
  ICreateClauseRevisionRequest,
} from "models/clauseMutation";
import { IModifiableClauseRevisionProperties } from "models/clausePanel";
import { IClause, IClauseInfo } from "models/clauses";
import {
  ICopyTranslationInfo,
  IDeleteTranslationInfo,
  ITranslationQueryResult,
  IUpdateTranslationInfo,
} from "models/translations";

import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  invalidateClauseCache,
  useCreateClauseMutation,
  useCreateRevisionMutation,
  useUpdateClauseMutation,
  useUpdateRevisionMutation,
  useDeleteTranslationsMutation,
  useCopyTranslationsMutation,
  useUploadTranslationsMutation,
} from "services/clause";
import { 
  invalidateClauseLabelCache,
  useUpdateClauseLabelsMutation, 
} from "services/clauseLabel";
import useRouter from "hooks/useRouter";
import { RouteComponent, routeDefinitions } from "router";
import { IPanelMessage, PanelMessageType } from "models/panelMessage";
import { 
  getFirst404Error, 
  hasAny404Error, 
  is404Error, 
  is404ErrorForClause, 
  is404ErrorForRevision, 
  isMutationCompleted,
  mark404ErrorsAsSuccess,
} from "helpers/mutation";
import useDialog from "hooks/useDialog";
import usePanelMessenger from "hooks/usePanelMessenger";
import { clausePanelFormsActions } from "store/clausePanelFormsSlice";
import { PanelType } from "models/panel";
import usePanel from "hooks/usePanel";
import { AgreementObjectEditState, AgreementObjectType } from "models/agreements";
import { IUpdateClauseLabelsRequest, IUpdateClauseLabelsResult } from "models/clauseLabels";
import { invalidateSlotCacheThunk } from "services/slot";

const useClauseMutator = (clauseInfo: IClauseInfo) => {
  const dispatch = useDispatch();
  const { updatePanel } = usePanel(PanelType.Clause);
  const { goToRoute, getRouteInfo } = useRouter();
  const { setClausePanelMessage } = usePanelMessenger();
  const { openError404Dialog } = useDialog();

  const [createClause, createClauseResult] = useCreateClauseMutation();
  const [createRevision, createRevisionResult] = useCreateRevisionMutation();
  const [updateClause, clauseResult] = useUpdateClauseMutation();
  const [updateRevision, revisionResult] = useUpdateRevisionMutation();
  const [updateClauseLabels, updateClauseLabelsResult] = useUpdateClauseLabelsMutation();

  const [deleteTranslations, deleteTranslationsResult] =
    useDeleteTranslationsMutation();
  const [copyTranslations, copyTranslationsResult] =
    useCopyTranslationsMutation();
  const [uploadTranslations, uploadTranslationsResult] =
    useUploadTranslationsMutation();

  const mutationActionsQueueRef = useRef<IClauseMutationAction[]>([]);
  const actionMessagesRef = useRef<IPanelMessage[]>([]);
  const processedResultIdsRef = useRef<Set<string>>(new Set<string>());

  const processNextAction = useCallback(() => {
    const action = mutationActionsQueueRef.current.shift()!;

    const actionMappings: { [key in ClauseMutationActionType]: () => void } = {
      [ClauseMutationActionType.CreateClause]: () => {
        const createClauseRequest: ICreateClauseRequest = {
          clauseProperties: action.actionArgument.clauseProperties,
          revisionProperties: action.actionArgument.revisionProperties
        };
        createClause(createClauseRequest);
      },
      [ClauseMutationActionType.CreateRevision]: () => {
        const partialRequest = action.actionArgument as {
          clauseId: string;
          revisionProperties: IModifiableClauseRevisionProperties;
        };

        const createRevisionRequest: ICreateClauseRevisionRequest = { ...partialRequest };
        createRevision(createRevisionRequest);
      },
      [ClauseMutationActionType.UpdateProperties]: () => {
        // UI treats update Clause and Revision Properties as one operation in terms of errors, etc.
        const updatePropertiesRequest =
          action.actionArgument as IClausePropertiesUpdateInfo;

        const updateClauseRequest = {
          id: updatePropertiesRequest.clauseId,
          ...updatePropertiesRequest.clauseProperties,
        } as Partial<IClause>;
        updateClause(updateClauseRequest);

        const updateRevisionRequest = {
          clauseId: updatePropertiesRequest.clauseId,
          revision: updatePropertiesRequest.revisionProperties,
        };
        updateRevisionRequest.revision.id =
          createRevisionResult.data?.id || updateRevisionRequest.revision.id;
        updateRevisionRequest.revision.etag =
          createRevisionResult.data?.etag ||
          updateRevisionRequest.revision.etag;

        updateRevision(updateRevisionRequest);
      },
      [ClauseMutationActionType.UpdateLabels]: () => {
        const updateClauseLabelsRequest = {
          ...action.actionArgument,
        } as IUpdateClauseLabelsRequest;

        updateClauseLabelsRequest.clauseId =
          createClauseResult.data?.partId || updateClauseLabelsRequest.clauseId;

        updateClauseLabels(updateClauseLabelsRequest);
      },
      [ClauseMutationActionType.DeleteTranslations]: () => {
        const deleteTranslationsRequest =
          action.actionArgument as IDeleteTranslationInfo;

        deleteTranslations(deleteTranslationsRequest);
      },
      [ClauseMutationActionType.CopyTranslations]: () => {
        const copyTranslationsRequest =
          action.actionArgument as ICopyTranslationInfo;

        copyTranslationsRequest.targetRevisionId =
          createRevisionResult.data?.id || "";

        copyTranslations(copyTranslationsRequest);
      },
      [ClauseMutationActionType.UploadTranslations]: () => {
        const uploadTranslationsRequest =
          action.actionArgument as IUpdateTranslationInfo;
        uploadTranslationsRequest.revisionId =
          createRevisionResult.data?.id || uploadTranslationsRequest.revisionId;

        uploadTranslations(uploadTranslationsRequest);
      },
    };

    actionMappings[action.actionType]();
  }, [
    mutationActionsQueueRef,
    createClauseResult,
    createRevisionResult,
    createClause,
    createRevision,
    updateClause,
    updateRevision,
    deleteTranslations,
    copyTranslations,
    uploadTranslations,
  ]);

  const resetResults = useCallback(() => {
    createClauseResult.reset();
    createRevisionResult.reset();
    clauseResult.reset();
    revisionResult.reset();
    updateClauseLabelsResult.reset();
    deleteTranslationsResult.reset();
    copyTranslationsResult.reset();
    uploadTranslationsResult.reset();

    processedResultIdsRef.current.clear();
    actionMessagesRef.current = [];
  }, [
    createClauseResult,
    createRevisionResult,
    clauseResult,
    revisionResult,
    updateClauseLabelsResult,
    deleteTranslationsResult,
    copyTranslationsResult,
    uploadTranslationsResult,
  ]);

  const sendUpdates = useCallback(() => {
    if (createClauseResult.isSuccess) {
      updatePanel({
        agreementObjectIds: { clauseId: createClauseResult.data.partId },
        editState: AgreementObjectEditState.Default,
      });
      goToRoute(
        routeDefinitions.Clauses.getRouteInfo({
          clauseId: createClauseResult.data.partId,
        })
      );
    } else if (createRevisionResult.isSuccess) {
      updatePanel({
        agreementObjectIds: {
          clauseId: clauseInfo.clause!.id,
          revisionId: createRevisionResult.data!.id,
        },
        editState: AgreementObjectEditState.Default,
      });
    }

    // Default to single action messages
    let subMessages: IPanelMessage[] | undefined;
    let mainMessage = actionMessagesRef.current[0].message;

    const allActionsSuccessful =
      actionMessagesRef.current.every(
        (m) => m.type === PanelMessageType.Success
      ) && mutationActionsQueueRef.current.length === 0;

    const onlySingleActionTriggered =
      actionMessagesRef.current.length === 1 &&
      mutationActionsQueueRef.current.length === 0;

    const hasAnySuccess = !!actionMessagesRef.current.find(
      (m) => m.type === PanelMessageType.Success || m.isPartialSuccess
    );
    // Delete/Update Translations may have partial success (some translations successfully uploaded, but others failed)
    const hasPartialSuccess = !!actionMessagesRef.current.find(
      (m) => m.isPartialSuccess
    );

    if (!onlySingleActionTriggered) {
      const firstActionFailed =
        actionMessagesRef.current[0].type === PanelMessageType.Error;

      const subsequentActionFailed =
        !firstActionFailed &&
        actionMessagesRef.current.find(
          (m) => m.type === PanelMessageType.Error
        );
      const isCreateRevision = isMutationCompleted(createRevisionResult);

      // If a subsequent action fails the main message is the same
      // If Create Revision fails as the first action or is success the Create Revision message will be used
      // Only Non-Create Revision flows produce different messages for success/failing conditions
      mainMessage =
        subsequentActionFailed || hasPartialSuccess
          ? "Unable to complete all operations."
          : mainMessage;
      mainMessage =
        !isCreateRevision && firstActionFailed && !hasPartialSuccess
          ? "Unable to save, please try again."
          : mainMessage;
      mainMessage =
        !isCreateRevision && allActionsSuccessful
          ? "Updates successfully saved."
          : mainMessage;

      if (subsequentActionFailed || hasPartialSuccess) {
        subMessages = [];
        subMessages.push(...actionMessagesRef.current);

        // messages for cancelled actions
        subMessages.push(
          ...mutationActionsQueueRef.current.map((action) => {
            let message = "";

            // Assumes only Update labels and Delete/Copy/Update translations actions can be canceled, 
            // because if other actions failed, it would short circuit
            if (
              action.actionType === ClauseMutationActionType.UpdateLabels
            )
              message = "Update PS Category label(s) canceled";
            else if (
              action.actionType === ClauseMutationActionType.DeleteTranslations
            )
              message = "Delete translation(s) canceled";
            else if (
              action.actionType === ClauseMutationActionType.CopyTranslations
            )
              message = "Copy document(s) canceled";
            else if (
              action.actionType === ClauseMutationActionType.UploadTranslations
            )
              message = "Upload document(s) canceled";

            return { type: PanelMessageType.Canceled, message };
          })
        );
      }
    }

    const mainMessageInfo = {
      type: allActionsSuccessful
        ? PanelMessageType.Success
        : PanelMessageType.Error,
      message: mainMessage,
    };
    setClausePanelMessage(mainMessageInfo, subMessages);

    if (hasAnySuccess) {
      const routeInfo = getRouteInfo();
      if (routeInfo && routeInfo.component === RouteComponent.TemplateEdit) {
        dispatch(invalidateSlotCacheThunk(clauseInfo.clause!.id, routeInfo.objectIdInfo!.templateId!, routeInfo.objectIdInfo!.revisionId!));
      }

      dispatch(invalidateClauseCache(clauseInfo.clause!.id));

      if (isMutationCompleted(updateClauseLabelsResult)) {
        dispatch(invalidateClauseLabelCache("", clauseInfo.clause!.id));
      }
    }

    dispatch(
      clausePanelFormsActions.setSubmissionState({
        isSubmitting: false,
        hasSubmitted: hasAnySuccess,
      })
    );
    resetResults();
  }, [
    createClauseResult,
    createRevisionResult,
    updateClauseLabelsResult,
    updatePanel,
    goToRoute,
    getRouteInfo,
    clauseInfo.clause,
    dispatch,
    resetResults,
    setClausePanelMessage,
  ]);

  const processActionResult = useCallback(
    (
      result: {
        isSuccess: boolean;
        isPartialSuccess?: boolean;
        requestId?: string;
      },
      successMessage: string,
      errorMessage: string
    ) => {
      if (!processedResultIdsRef.current.has(result.requestId!)) {
        processedResultIdsRef.current.add(result.requestId!);

        actionMessagesRef.current.push({
          message: result.isSuccess ? successMessage : errorMessage,
          type: result.isSuccess
            ? PanelMessageType.Success
            : PanelMessageType.Error,
          isPartialSuccess: result.isPartialSuccess,
        });

        if (result.isSuccess && mutationActionsQueueRef.current.length > 0) {
          processNextAction();
          return;
        }

        sendUpdates();
      }
    },
    [processNextAction, sendUpdates]
  );

  const setMutationActions = (actions: IClauseMutationAction[]) => {
    dispatch(
      clausePanelFormsActions.setSubmissionState({
        isSubmitting: true,
        hasSubmitted: true,
      })
    );
    mutationActionsQueueRef.current.push(...actions);
    processNextAction();
  };

  useEffect(() => {
    if (isMutationCompleted(createClauseResult)) {

      // no need to check 404 error for createClause

      processActionResult(
        createClauseResult,
        "Clause successfully created.",
        "Clause creation failed, please try again."
      );
    }
  }, [createClauseResult, processActionResult]);

  useEffect(() => {
    if (isMutationCompleted(createRevisionResult)) {

      if (is404Error(createRevisionResult)) {
        openError404Dialog("clause", AgreementObjectType.clause, false);
      }

      processActionResult(
        createRevisionResult,
        "New version successfully created.",
        "Could not create a new version, please try again."
      );
    }
  }, [createRevisionResult, processActionResult]);

  useEffect(() => {
    if (
      isMutationCompleted(clauseResult) &&
      isMutationCompleted(revisionResult)
    ) {

      if (is404Error(clauseResult)) {
        openError404Dialog("clause", AgreementObjectType.clause, false);
      }
      else if (is404Error(revisionResult)) {
        openError404Dialog("revision", AgreementObjectType.clause, true, clauseInfo.clause!.id);
      }
      
      const requestId = `${clauseResult.requestId}_${revisionResult.requestId}`;
      const combinedResult = {
        isSuccess: clauseResult.isSuccess && revisionResult.isSuccess,
        requestId,
      };
      const errorMessage =
        clauseResult.isError && revisionResult.isError
          ? "Could not update properties."
          : "Not all properties could be updated.";
      processActionResult(
        combinedResult,
        "Properties updated successfully.",
        errorMessage
      );
    }
  }, [clauseResult, revisionResult, processActionResult]);

  /* 
    Update clause labels only for "Professional Services" business unit
    updateClauseLabels can only be triggered after createClause + createRevision, or updateClause + updateRevision 
  */
  useEffect(() => {
    if (isMutationCompleted(updateClauseLabelsResult)) {

      /* 
        no need to check 404 error for updateClauseLabels because it always follows another mutation action:
          createClause, createRevision, updateClause
        if the clause/revision was deleted by another user, the preceding mutation would return an error
      */

      const actionData =
        updateClauseLabelsResult.data as IUpdateClauseLabelsResult;

      const result = {
        isSuccess: actionData.fail === 0,
        isPartialSuccess:
          actionData.success > 0 && actionData.fail > 0,
        requestId: updateClauseLabelsResult.requestId,
      };

      const totalLabels = actionData.success + actionData.fail;
      const successMessage = `${actionData.success} PS Category value(s) ${
        actionData.success === 1 ? "has" : "have"
      } been updated.`;
      const errorMessage = `${actionData.fail} of ${totalLabels} PS Category value(s) could not be updated.`;

      processActionResult(result, successMessage, errorMessage);
    }
  }, [updateClauseLabelsResult, processActionResult, dispatch]);

  useEffect(() => {
    if (isMutationCompleted(deleteTranslationsResult)) {

      let is404ErrorForTranslation = false;

      if (hasAny404Error(deleteTranslationsResult.data)) {
        const first404Error = getFirst404Error(deleteTranslationsResult.data!);

        if (first404Error) {
          if (is404ErrorForRevision(first404Error.data)) {
            openError404Dialog("revision", AgreementObjectType.clause, true, clauseInfo.clause!.id);
          }
          else if (is404ErrorForClause(first404Error.data)) {
            openError404Dialog("clause", AgreementObjectType.clause, false);
          }
          else {
            // if another user deleted translation(s) that the current user tries to delete
            // we show the current user deletion success, even though the API call returns 404 error(s)
            is404ErrorForTranslation = true;
          }
        }
      }

      const actionData = is404ErrorForTranslation ?
        mark404ErrorsAsSuccess(deleteTranslationsResult.data!) :
        deleteTranslationsResult.data as ITranslationQueryResult;

      const result = {
        isSuccess: actionData.fail.length === 0,
        isPartialSuccess:
          actionData.success.length > 0 && actionData.fail.length > 0,
        requestId: deleteTranslationsResult.requestId,
      };

      const totalDocuments = actionData.success.length + actionData.fail.length;
      const successMessage = `${actionData.success.length} document(s) ${
        actionData.success.length === 1 ? "has" : "have"
      } been deleted.`;
      const errorMessage = `${actionData.fail.length} of ${totalDocuments} document(s) could not be deleted.`;

      processActionResult(result, successMessage, errorMessage);
      dispatch(
        clausePanelFormsActions.updateSuccessfullyRemovedTranslations(
          actionData.success
        )
      );
    }
  }, [deleteTranslationsResult, processActionResult, dispatch]);

  /*
    Copy translations from the current revision when creating a new revision.
    Existing translations selected for deletion are not copied - no separate API call to delete translations.
    Send a separate API call to upload new translations.
  */
  useEffect(() => {
    if (isMutationCompleted(copyTranslationsResult)) {

      if (is404Error(copyTranslationsResult)) {
        openError404Dialog("revision", AgreementObjectType.clause, true, clauseInfo.clause!.id);
      }

      const { isSuccess } = copyTranslationsResult;
      /*
        Either all translations are copied successfully, or all failed.
        There is no partial success as for deleting/uploading translations.
      */
      const result = {
        isSuccess,
        requestId: copyTranslationsResult.requestId,
      };

      const totalDocuments = isSuccess
        ? copyTranslationsResult.data.length
        : copyTranslationsResult.originalArgs?.languageLocales.length;

      const successMessage = `${totalDocuments} document(s) ${
        totalDocuments === 1 ? "has" : "have"
      } been copied from the old version.`;
      const errorMessage = `${totalDocuments} document(s) could not be copied from the old version.`;

      processActionResult(result, successMessage, errorMessage);
      dispatch(
        clausePanelFormsActions.updateSuccessfullyUploadedTranslations(
          copyTranslationsResult.data || []
        )
      );
    }
  }, [copyTranslationsResult, processActionResult, dispatch]);

  useEffect(() => {
    if (isMutationCompleted(uploadTranslationsResult)) {

      if (hasAny404Error(uploadTranslationsResult.data)) {
        const first404Error = getFirst404Error(uploadTranslationsResult.data!);

        if (first404Error) {
          if (is404ErrorForRevision(first404Error.data)) {
            openError404Dialog("revision", AgreementObjectType.clause, true, clauseInfo.clause!.id);
          }
          else if (is404ErrorForClause(first404Error.data)) {
            openError404Dialog("clause", AgreementObjectType.clause, false);
          }
          // another user deleting translation(s) will not cause 404 error when this user uploads translation(s)
          // else { }
        }
      }

      const actionData =
        uploadTranslationsResult.data as ITranslationQueryResult;

      const result = {
        isSuccess: actionData.fail.length === 0,
        isPartialSuccess:
          actionData.success.length > 0 && actionData.fail.length > 0,
        requestId: uploadTranslationsResult.requestId,
      };

      const totalDocuments = actionData.success.length + actionData.fail.length;
      const successMessage = `${actionData.success.length} document(s) ${
        actionData.success.length === 1 ? "has" : "have"
      } been uploaded.`;
      const errorMessage = `${actionData.fail.length} of ${totalDocuments} document(s) could not be uploaded.`;

      processActionResult(result, successMessage, errorMessage);
      dispatch(
        clausePanelFormsActions.updateSuccessfullyUploadedTranslations(
          actionData.success
        )
      );
    }
  }, [uploadTranslationsResult, processActionResult, dispatch]);

  return { setMutationActions };
};

export default useClauseMutator;
