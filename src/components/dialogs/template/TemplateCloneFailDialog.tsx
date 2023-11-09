import {
  IDialogContentComponent,
  ITemplateCloneFailDialog,
} from "models/dialogs";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { Text } from "@fluentui/react/lib/Text";
import useDialog from "hooks/useDialog";
import {
  invalidateTemplateCache,
  useDeleteRevisionMutation as useDeleteTemplateRevisionMutation,
} from "services/template";
import { isMutationCompleted } from "helpers/mutation";
import { useDispatch } from "react-redux";
import stringsConst from "consts/strings";

const TemplateCloneFailDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const dispatch = useDispatch();
    const { openSuccessDialog, openErrorDialog, setDialogProceeding } =
      useDialog();
    const [deleteTemplateRevision, deleteTemplateRevisionResult] =
      useDeleteTemplateRevisionMutation();
    const templateInfo = props as ITemplateCloneFailDialog;

    const openDialogAndReset = (target: string, result: any) => {
      if (result.isSuccess) {
        openSuccessDialog(
          stringsConst.dialogs.TemplateCloneFail.draftDelete.success
        );
      } else {
        openErrorDialog(
          stringsConst.dialogs.TemplateCloneFail.draftDelete.error
        );
      }

      result.reset();
    };

    useEffect(() => {
      if (!isMutationCompleted(deleteTemplateRevisionResult)) {
        return;
      }

      if (deleteTemplateRevisionResult.isSuccess) {
        dispatch(invalidateTemplateCache(templateInfo.templateId));
      }

      openDialogAndReset("draft", deleteTemplateRevisionResult);
    }, [deleteTemplateRevisionResult, templateInfo.templateId]);

    useImperativeHandle(ref, () => ({
      onProceed: () => {
        setDialogProceeding(true);
        deleteTemplateRevision({
          templateId: templateInfo.templateId,
          revisionId: templateInfo.revisionId || "",
          revisionEtag: templateInfo.revisionEtag || "",
        });
      },
    }));

    return <Text>{templateInfo.message}</Text>;
  }
);

export default TemplateCloneFailDialog;
