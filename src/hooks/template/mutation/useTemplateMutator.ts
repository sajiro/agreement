import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { RouteComponent, routeDefinitions } from "router";
import useRouter from "hooks/useRouter";

import { isMutationCompleted } from "helpers/mutation";
import usePanelMessenger from "hooks/usePanelMessenger";
import { IPanelMessage, PanelMessageType } from "models/panelMessage";
import {
  ICreateTemplateRevisionRequest,
  ICreateTemplateRequest,
  ITemplateMutationAction,
  TemplateMutationActionType,
} from "models/templateMutation";
import { IModifiableTemplateRevisionProperties } from "models/templatePanel";
import { ITemplateInfo } from "models/templates";
import {
  invalidateTemplateCache,
  useCreateTemplateMutation,
  useCreateRevisionMutation,
  useCopySlotsMutation,
} from "services/template";
import { templateFormsActions } from "store/templateFormSlice";
import stringsConst from "consts/strings";
import { TemplateEditPanelType } from "store/templateEditPanelManagementSlice";
import { ICopySlotsInfo } from "models/slot";
import useDialog from "hooks/useDialog";
import { ITemplateCloneFailDialog } from "models/dialogs";
import { templateEditActions } from "store/TemplateEditSlice";
import { MessageBarType } from "@fluentui/react";
import useTemplatePanel from "../useTemplatePanel";
import useTemplateEditPanelManager from "../useTemplateEditPanelManager";

const useTemplateMutator = (templateInfo: ITemplateInfo) => {
  const dispatch = useDispatch();
  const { updatePanel, closePanel } = useTemplatePanel();
  const { goToRoute, updateRoute, getRouteInfo } = useRouter();
  const { setTemplatePanelMessage } = usePanelMessenger();
  const { openPanel } = useTemplateEditPanelManager();
  const { openProcessingDialog, openErrorDialog, openCloneFailDialog } =
    useDialog();

  const [createTemplate, createTemplateResult] = useCreateTemplateMutation();
  const [createRevision, createRevisionResult] = useCreateRevisionMutation();
  const [copySlots, copySlotsResult] = useCopySlotsMutation();

  const mutationActionsQueueRef = useRef<ITemplateMutationAction[]>([]);
  const actionMessagesRef = useRef<IPanelMessage[]>([]);
  const processedResultIdsRef = useRef<Set<string>>(new Set<string>());

  const processNextAction = useCallback(() => {
    const action = mutationActionsQueueRef.current.shift()!;

    const actionMappings: { [key in TemplateMutationActionType]: () => void } =
      {
        [TemplateMutationActionType.CreateTemplate]: () => {
          const createTemplateRequest: ICreateTemplateRequest = {
            templateProperties: action.actionArgument.templateProperties,
            revisionProperties: action.actionArgument.revisionProperties,
          };

          createTemplate(createTemplateRequest);
        },
        [TemplateMutationActionType.CreateRevision]: () => {
          const partialRequest = action.actionArgument as {
            templateId: string;
            revisionProperties: IModifiableTemplateRevisionProperties;
          };

          const createRevisionRequest: ICreateTemplateRevisionRequest = {
            ...partialRequest,
          };
          createRevision(createRevisionRequest);
        },
        [TemplateMutationActionType.CopySlots]: () => {
          const copySlotsRequest = action.actionArgument as ICopySlotsInfo;
          copySlotsRequest.targetRevisionId =
            createRevisionResult.data?.id || "";
          copySlots(copySlotsRequest);
        },
      };

    actionMappings[action.actionType]();
  }, [
    mutationActionsQueueRef,
    createRevisionResult,
    createTemplate,
    createRevision,
    copySlots,
  ]);

  const resetResults = useCallback(() => {
    createTemplateResult.reset();
    createRevisionResult.reset();
    copySlotsResult.reset();

    processedResultIdsRef.current.clear();
    actionMessagesRef.current = [];
  }, [createTemplateResult, createRevisionResult]);

  const sendUpdates = useCallback(() => {
    if (createTemplateResult.isSuccess) {
      closePanel();

      // go to the edit template page
      goToRoute(
        routeDefinitions.TemplateEdit.getRouteInfo({
          templateId: createTemplateResult.data.templateId,
        })
      );
      // Need to ensure the Add Clause Panel is opened (only for newly created templates)
      openPanel(TemplateEditPanelType.AddClause);
    } else if (copySlotsResult.isSuccess && createRevisionResult.isSuccess) {
      const routeInfo = getRouteInfo();
      if (routeInfo?.component === RouteComponent.TemplateEdit) {
        updateRoute(
          routeDefinitions.TemplateEdit.getRouteInfo({
            templateId: templateInfo.template!.id,
            revisionId: createRevisionResult.data!.id,
          })
        );
      } else {
        goToRoute(
          routeDefinitions.TemplateEdit.getRouteInfo({
            templateId: templateInfo.template!.id,
            revisionId: createRevisionResult.data!.id,
          })
        );
      }

      dispatch(
        templateEditActions.setMessage({
          message: stringsConst.templateEdit.messages.NewVersionCreatedMessage,
          type: MessageBarType.success,
        })
      );
    }

    // Default to single action messages
    const mainMessage = actionMessagesRef.current[0].message;
    const allActionsSuccessful =
      actionMessagesRef.current.every(
        (m) => m.type === PanelMessageType.Success
      ) && mutationActionsQueueRef.current.length === 0;
    const isPartialSuccess = !!actionMessagesRef.current.find(
      (m) => m.type === PanelMessageType.Success
    );
    const mainMessageInfo = {
      type: allActionsSuccessful
        ? PanelMessageType.Success
        : PanelMessageType.Error,
      message: mainMessage,
    };
    setTemplatePanelMessage(mainMessageInfo);
    if (isPartialSuccess) {
      dispatch(invalidateTemplateCache(templateInfo.template!.id));
    }
    dispatch(templateFormsActions.setSubmissionState(false));
    resetResults();
  }, [
    createTemplateResult,
    createRevisionResult,
    updatePanel,
    closePanel,
    goToRoute,
    templateInfo.template,
    dispatch,
    resetResults,
    updateRoute,
    setTemplatePanelMessage,
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

  const setMutationActions = (actions: ITemplateMutationAction[]) => {
    dispatch(templateFormsActions.setSubmissionState(true));
    mutationActionsQueueRef.current = [];
    mutationActionsQueueRef.current.push(...actions);
    processNextAction();
  };

  useEffect(() => {
    if (isMutationCompleted(createTemplateResult)) {
      processActionResult(
        createTemplateResult,
        stringsConst.common.panelMessages.newTemplate,
        stringsConst.common.panelMessages.failTemplate
      );
    }
  }, [createTemplateResult, processActionResult]);

  useEffect(() => {
    if (createRevisionResult.isLoading) {
      openProcessingDialog(true);
    }
    if (createRevisionResult.isError) {
      openProcessingDialog(false);
      openErrorDialog(stringsConst.dialogs.TemplateCloneFail.error);
    }
    if (isMutationCompleted(createRevisionResult)) {
      processActionResult(
        createRevisionResult,
        stringsConst.common.panelMessages.newRevision,
        stringsConst.common.panelMessages.failRevision
      );
      if (createRevisionResult.isSuccess) {
        openProcessingDialog(false);
      }
    }
  }, [
    createRevisionResult,
    processActionResult,
    openProcessingDialog,
    openErrorDialog,
    resetResults,
  ]);

  useEffect(() => {
    if (copySlotsResult.isLoading) {
      openProcessingDialog(true);
    }
    if (
      copySlotsResult.isError &&
      templateInfo.template &&
      createRevisionResult.data
    ) {
      const cloneFailDailogProps: ITemplateCloneFailDialog = {
        message:
          stringsConst.dialogs.TemplateCloneFail.partialCreationError.message,
        templateEtag: templateInfo.template?.etag,
        title:
          stringsConst.dialogs.TemplateCloneFail.partialCreationError.title,
        templateId: templateInfo.template.id,
        revisionEtag: createRevisionResult.data?.etag,
        revisionId: createRevisionResult.data?.id,
      };
      openProcessingDialog(false);
      openCloneFailDialog(cloneFailDailogProps);
    }
    if (isMutationCompleted(copySlotsResult)) {
      processActionResult(
        copySlotsResult,
        stringsConst.common.panelMessages.newRevision,
        stringsConst.common.panelMessages.failRevision
      );
      if (copySlotsResult.isSuccess) {
        openProcessingDialog(false);
      }
    }
  }, [
    copySlotsResult,
    processActionResult,
    openProcessingDialog,
    openErrorDialog,
    openCloneFailDialog,
  ]);

  return { setMutationActions };
};

export default useTemplateMutator;
