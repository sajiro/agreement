import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";
import { Text } from "@fluentui/react/lib/Text";
import { routeDefinitions } from "router";

import { is404Error, isMutationCompleted } from "helpers/mutation";
import useDialog from "hooks/useDialog";
import usePanel from "hooks/usePanel";
import useRouter from "hooks/useRouter";
import useTemplatePanel from "hooks/template/useTemplatePanel";
import { AgreementObjectType } from "models/agreements";
import { IDeletionContent, IDialogContentComponent } from "models/dialogs";
import { PanelType } from "models/panel";
import {
  invalidateClauseCache,
  useDeleteClauseMutation,
  useDeleteRevisionMutation as useDeleteClauseRevisionMutation,
} from "services/clause";
import {
  invalidateTemplateCache,
  useDeleteTemplateMutation,
  useDeleteRevisionMutation as useDeleteTemplateRevisionMutation,
} from "services/template";
import { panelMessagesActions } from "store/panelMessagesSlice";
import { useTrackingContext } from "components/shared/TrackingContext";
import stringsConst from "consts/strings";

/**
 * Can delete clause and template, not custom clause
 */
const AgreementObjectDeletionDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const dispatch = useDispatch();
    const { trackEvent } = useTrackingContext();
    const { openSuccessDialog, openErrorDialog, setDialogProceeding } =
      useDialog();
    const { goToRoute } = useRouter();

    const { closePanel: closeClausePanel } = usePanel(PanelType.Clause);
    const { closePanel: closeTemplatePanel } = useTemplatePanel();

    const deletionContent = props as IDeletionContent;
    const deletionObjectType = deletionContent.objectType;
    const deletionObjectTypeStr = deletionObjectType.toString().toLowerCase();

    const isDeleteClause = deletionObjectType === AgreementObjectType.clause;
    const isDeleteTemplate =
      deletionObjectType === AgreementObjectType.template;
    const isDeleteRevision: boolean = !!deletionContent.revisionId;

    const [deleteClause, deleteClauseResult] = useDeleteClauseMutation();
    const [deleteClauseRevision, deleteClauseRevisionResult] =
      useDeleteClauseRevisionMutation();
    const [deleteTemplate, deleteTemplateResult] = useDeleteTemplateMutation();
    const [deleteTemplateRevision, deleteTemplateRevisionResult] =
      useDeleteTemplateRevisionMutation();

    const openDialogAndReset = (target: string, result: any) => {
      /* 
        Show success to user if a) the Delete API call was successful, or 
        b) the call returned a 404 error, because another user had already deleted it
      */
      if (result.isSuccess || is404Error(result)) {
        openSuccessDialog(
          stringsConst.dialogs.AgreementObjectDeletionDialog.success({
            target,
          })
        );
      } else {
        openErrorDialog(
          stringsConst.dialogs.AgreementObjectDeletionDialog.error({
            target,
          })
        );
      }

      result.reset();
    };

    // delete the current clause with only one revision
    useEffect(() => {
      if (
        !isDeleteClause ||
        isDeleteRevision ||
        !isMutationCompleted(deleteClauseResult)
      ) {
        return;
      }

      if (deleteClauseResult.isSuccess || is404Error(deleteClauseResult)) {
        trackEvent("delete Clause Dialog");
        dispatch(invalidateClauseCache(""));

        goToRoute(
          routeDefinitions.Clauses.getRouteInfo({
            isNothingSelected: true,
          })
        );
        closeClausePanel();
      }

      openDialogAndReset("clause", deleteClauseResult);
    }, [isDeleteClause, isDeleteRevision, deleteClauseResult]);

    // delete the current clause revision, whose clause has multiple revisions
    useEffect(() => {
      if (
        !isDeleteClause ||
        !isDeleteRevision ||
        !isMutationCompleted(deleteClauseRevisionResult)
      ) {
        return;
      }

      if (
        deleteClauseRevisionResult.isSuccess ||
        is404Error(deleteClauseRevisionResult)
      ) {
        trackEvent("delete Clause Dialog");
        dispatch(invalidateClauseCache(deletionContent.objectId));
        dispatch(panelMessagesActions.clear());
      }

      openDialogAndReset("revision", deleteClauseRevisionResult);
    }, [
      isDeleteClause,
      isDeleteRevision,
      deleteClauseRevisionResult,
      deletionContent.objectId,
    ]);

    // delete the current template with only one revision
    useEffect(() => {
      if (
        !isDeleteTemplate ||
        isDeleteRevision ||
        !isMutationCompleted(deleteTemplateResult)
      ) {
        return;
      }

      if (deleteTemplateResult.isSuccess || is404Error(deleteTemplateResult)) {
        trackEvent("delete template Dialog");
        dispatch(invalidateTemplateCache(""));

        goToRoute(
          routeDefinitions.Templates.getRouteInfo({
            isNothingSelected: true,
          })
        );
        closeTemplatePanel();
      }

      openDialogAndReset("template", deleteTemplateResult);
    }, [isDeleteTemplate, isDeleteRevision, deleteTemplateResult]);

    // delete the current template revision, whose template has multiple revisions
    useEffect(() => {
      if (
        !isDeleteTemplate ||
        !isDeleteRevision ||
        !isMutationCompleted(deleteTemplateRevisionResult)
      ) {
        return;
      }

      if (
        deleteTemplateRevisionResult.isSuccess ||
        is404Error(deleteTemplateRevisionResult)
      ) {
        trackEvent("delete template Dialog");
        dispatch(invalidateTemplateCache(deletionContent.objectId));
      }

      openDialogAndReset("revision", deleteTemplateRevisionResult);
    }, [
      isDeleteTemplate,
      isDeleteRevision,
      deleteTemplateRevisionResult,
      deletionContent.objectId,
    ]);

    useImperativeHandle(ref, () => ({
      onProceed: () => {
        setDialogProceeding(true);

        if (isDeleteClause) {
          if (isDeleteRevision) {
            deleteClauseRevision({
              clauseId: deletionContent.objectId,
              revisionId: deletionContent.revisionId || "",
              revisionEtag: deletionContent.revisionEtag || "",
            });
          } else {
            deleteClause({
              id: deletionContent.objectId,
              etag: deletionContent.objectEtag || "",
            });
          }
        } else if (isDeleteTemplate) {
          if (isDeleteRevision) {
            deleteTemplateRevision({
              templateId: deletionContent.objectId,
              revisionId: deletionContent.revisionId || "",
              revisionEtag: deletionContent.revisionEtag || "",
            });
          } else {
            deleteTemplate({
              id: deletionContent.objectId,
              etag: deletionContent.objectEtag || "",
            });
          }
        }
      },
    }));

    return (
      <Text block>
        {isDeleteRevision
          ? stringsConst.dialogs.AgreementObjectDeletionDialog.proceedRevision({
              deletionObjectTypeStr,
            })
          : stringsConst.dialogs.AgreementObjectDeletionDialog.proceed({
              deletionObjectTypeStr,
            })}
      </Text>
    );
  }
);

export default AgreementObjectDeletionDialog;
