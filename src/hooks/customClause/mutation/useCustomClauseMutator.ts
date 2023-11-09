import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { isMutationCompleted } from "helpers/mutation";
import usePanel from "hooks/usePanel";
import usePanelMessenger from "hooks/usePanelMessenger";
import useRouter from "hooks/useRouter";
import { AgreementObjectEditState } from "models/agreements";
import {
  CustomClauseMutationActionType,
  ICustomClauseMutationAction,
  ICreateCustomClauseRequest,
  ICreateCustomClauseRevisionRequest,
} from "models/customClauseMutation";
import {
  IModifiableCustomClauseProperties,
  IModifiableCustomClauseRevisionProperties,
} from "models/customClausePanel";
import { ICustomClause, ICustomClauseInfo } from "models/customClauses";
import { PanelType } from "models/panel";
import { IPanelMessage, PanelMessageType } from "models/panelMessage";
import {
  ITranslationQueryResult,
  IUpdateTranslationInfo,
} from "models/translations";

import { routeDefinitions } from "router";
import {
  invalidateCustomClauseCache,
  useCreateCustomClauseMutation,
  useCreateRevisionMutation,
  useUpdateCustomClauseMutation,
  useUpdateRevisionMutation,
  useUploadTranslationsMutation,
} from "services/customClause";
import { customClausePanelFormsActions } from "store/customClausePanelFormsSlice";

const useCustomClauseMutator = (clauseInfo: ICustomClauseInfo) => {
  const dispatch = useDispatch();
  const { updatePanel } = usePanel(PanelType.CustomClause);
  const { goToRoute } = useRouter();
  const { setClausePanelMessage } = usePanelMessenger();

  const [createCustomClause, createCustomClauseResult] =
    useCreateCustomClauseMutation();
  const [createRevision, createRevisionResult] = useCreateRevisionMutation();
  const [updateCustomClause, updateCustomClauseResult] =
    useUpdateCustomClauseMutation();
  const [updateRevision, updateRevisionResult] = useUpdateRevisionMutation();
  const [uploadTranslations, uploadTranslationsResult] =
    useUploadTranslationsMutation();

  const mutationActionsQueueRef = useRef<ICustomClauseMutationAction[]>([]);
  const actionMessagesRef = useRef<IPanelMessage[]>([]);
  const processedResultIdsRef = useRef<Set<string>>(new Set<string>());

  const processNextAction = useCallback(() => {
    const action = mutationActionsQueueRef.current.shift()!;

    const actionMappings: {
      [key in CustomClauseMutationActionType]: () => void;
    } = {
      [CustomClauseMutationActionType.CreateClause]: () => {
        const clauseProperties =
          action.actionArgument as IModifiableCustomClauseProperties;

        const createClauseRequest: ICreateCustomClauseRequest = {
          clauseProperties,
        };

        const tmpClauseProperties = {
          ...createClauseRequest.clauseProperties,
          name: createClauseRequest?.clauseProperties.name?.trim(),
          description:
            createClauseRequest?.clauseProperties.description?.trim(),
        };

        createCustomClause({
          ...createClauseRequest,
          clauseProperties: tmpClauseProperties,
        });
      },
      [CustomClauseMutationActionType.CreateRevision]: () => {
        const partialRequest = action.actionArgument as {
          templateId: string;
          clauseId: string;
          revisionProperties: IModifiableCustomClauseRevisionProperties;
        };

        partialRequest.templateId =
          createCustomClauseResult.data?.templateId ||
          partialRequest.templateId;
        partialRequest.clauseId =
          createCustomClauseResult.data?.id || partialRequest.clauseId;

        const createRevisionRequest: ICreateCustomClauseRevisionRequest = {
          ...partialRequest,
        };
        createRevision(createRevisionRequest);
      },
      [CustomClauseMutationActionType.UpdateProperties]: () => {
        const { clauseProperties, revisionProperties } = action.actionArgument;

        const updateClauseRequest = {
          ...clauseProperties,
        } as Partial<ICustomClause>;

        updateCustomClause(updateClauseRequest);

        const updateRevisionRequest = {
          templateId: clauseProperties.templateId,
          clauseId: clauseProperties.id,
          revision: revisionProperties,
        };

        updateRevision(updateRevisionRequest);
      },
      [CustomClauseMutationActionType.UploadTranslations]: () => {
        const uploadTranslationsRequest =
          action.actionArgument as IUpdateTranslationInfo;

        uploadTranslations(uploadTranslationsRequest);
      },
    };

    actionMappings[action.actionType]();
  }, [
    mutationActionsQueueRef,
    createCustomClauseResult,
    createCustomClause,
    createRevision,
    updateCustomClause,
    updateRevision,
    uploadTranslations,
  ]);

  const resetResults = useCallback(() => {
    createCustomClauseResult.reset();
    createRevisionResult.reset();
    updateCustomClauseResult.reset();
    updateRevisionResult.reset();
    uploadTranslationsResult.reset();

    processedResultIdsRef.current.clear();
    actionMessagesRef.current = [];
  }, [
    createCustomClauseResult,
    createRevisionResult,
    updateCustomClauseResult,
    updateRevisionResult,
    uploadTranslationsResult,
  ]);

  const sendUpdates = useCallback(() => {
    if (createCustomClauseResult.isSuccess && createRevisionResult.isSuccess) {
      updatePanel({
        agreementObjectIds: {
          clauseId: createCustomClauseResult.data.id,
          templateId: createCustomClauseResult.data.templateId,
        },
        editState: AgreementObjectEditState.Default,
      });

      goToRoute(
        routeDefinitions.CustomClauses.getRouteInfo({
          clauseId: createCustomClauseResult.data.id,
          templateId: createCustomClauseResult.data.templateId,
        })
      );
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

    const firstActionFailed =
      actionMessagesRef.current[0].type === PanelMessageType.Error;

    const subsequentActionFailed =
      !firstActionFailed &&
      actionMessagesRef.current.find((m) => m.type === PanelMessageType.Error);

    const isPartialSuccess = !!actionMessagesRef.current.find(
      (m) => m.type === PanelMessageType.Success
    );

    // Create Custom Clause sends two API calls: createCustomClause and createRevision,
    // but it's only one action for the user, so only one message is displayed (mainMessage)
    const isCreateClause =
      isMutationCompleted(createCustomClauseResult) ||
      isMutationCompleted(createRevisionResult);

    if (isCreateClause) {
      if (!allActionsSuccessful && subsequentActionFailed) {
        mainMessage = actionMessagesRef.current[1].message;
      }
    }
    // Multiple actions (excluding createCustomClause and createRevision)
    else if (!onlySingleActionTriggered) {
      if (allActionsSuccessful) {
        mainMessage = "Updates successfully saved.";
      } else if (firstActionFailed) {
        mainMessage = "Unable to save, please try again.";
      } else if (subsequentActionFailed) {
        mainMessage = "Unable to complete all operations.";

        // When the second or later action fails, set callout messages
        subMessages = [];
        subMessages.push(...actionMessagesRef.current);

        subMessages.push(
          ...mutationActionsQueueRef.current.map((a) => {
            // Assumes only Update/Delete translations actions can be canceled as if other actions failed, it would short circuit
            const message =
              a.actionType === CustomClauseMutationActionType.UploadTranslations
                ? "Upload document(s) canceled"
                : "Delete translation(s) canceled";
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

    if (isPartialSuccess) {
      dispatch(invalidateCustomClauseCache(clauseInfo.clause!.id));
    }

    dispatch(
      customClausePanelFormsActions.setSubmissionState({
        isSubmitting: false,
        hasSubmitted: isPartialSuccess,
      })
    );

    resetResults();
  }, [
    clauseInfo.clause,
    createCustomClauseResult,
    createRevisionResult,
    updatePanel,
    goToRoute,
    dispatch,
    resetResults,
    setClausePanelMessage,
  ]);

  const processActionResult = useCallback(
    (
      result: { isSuccess: boolean; requestId?: string },
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

  const setMutationActions = (actions: ICustomClauseMutationAction[]) => {
    dispatch(
      customClausePanelFormsActions.setSubmissionState({
        isSubmitting: true,
        hasSubmitted: true,
      })
    );

    mutationActionsQueueRef.current.push(...actions);
    processNextAction();
  };

  /* ************************************************
   * Notes on the next two useEffect's:
   *   Creating a custom clause sends two API calls: createClause and createRevision.
   *
   *   The user cannot create a new revision directly. createRevisionResult can only come
   *   from the createRevision API call when the user creates a custom clause.
   *
   *   We assume if createClause succeeds, createRevision will not fail.
   */

  useEffect(() => {
    if (isMutationCompleted(createCustomClauseResult)) {
      processActionResult(
        createCustomClauseResult,
        "Clause successfully created.",
        "Clause creation failed, please try again."
      );
    }
  }, [createCustomClauseResult, processActionResult]);

  useEffect(() => {
    if (isMutationCompleted(createRevisionResult)) {
      processActionResult(
        createRevisionResult,
        "Clause successfully created.",
        "Clause creation failed, please try again."
      );
    }
  }, [createRevisionResult, processActionResult]);

  /*
   *   See notes for both of the useEffect's above.
   ************************************************ */

  // When updating Custom Clause properties, also need to update Revision to set its modifiedBy and modifiedDate
  // UI treats updating Custom Clause and Revision properties as one operation in terms of errors, etc.
  useEffect(() => {
    if (
      isMutationCompleted(updateCustomClauseResult) &&
      isMutationCompleted(updateRevisionResult)
    ) {
      const requestId = `${updateCustomClauseResult.requestId}_${updateRevisionResult.requestId}`;
      const combinedResult = {
        isSuccess:
          updateCustomClauseResult.isSuccess && updateRevisionResult.isSuccess,
        requestId,
      };
      const errorMessage =
        updateCustomClauseResult.isError && updateRevisionResult.isError
          ? "Could not update properties."
          : "Not all properties could be updated.";

      processActionResult(
        combinedResult,
        "Properties updated successfully.",
        errorMessage
      );
    }
  }, [updateCustomClauseResult, updateRevisionResult, processActionResult]);

  useEffect(() => {
    if (isMutationCompleted(uploadTranslationsResult)) {
      const actionData =
        uploadTranslationsResult.data as ITranslationQueryResult;

      const result = {
        isSuccess: actionData.fail.length === 0,
        requestId: uploadTranslationsResult.requestId,
      };

      const totalDocuments = actionData.success.length + actionData.fail.length;
      const successMessage = `${actionData.success.length} document(s) ${
        actionData.success.length === 1 ? "has" : "have"
      } been uploaded.`;
      const errorMessage = `${actionData.fail.length} of ${totalDocuments} document(s) could not be uploaded.`;

      processActionResult(result, successMessage, errorMessage);
      dispatch(
        customClausePanelFormsActions.updateSuccessfullyUploadedTranslations(
          actionData.success
        )
      );
    }
  }, [uploadTranslationsResult, processActionResult, dispatch]);

  return { setMutationActions };
};

export default useCustomClauseMutator;
