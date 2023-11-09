import { Text } from "@fluentui/react/lib/Text";
import stringsConst from "consts/strings";
import { isMutationCompleted } from "helpers/mutation";
import useDeleteCompleteConstraintMutation from "hooks/constraint/mutation/useDeleteCompleteConstraintMutation";
import useConstraintInfoProvider from "hooks/constraint/useConstraintInfoProvider";
import useDialog from "hooks/useDialog";
import {
  IConstraintDeletionContent,
  IDialogContentComponent,
} from "models/dialogs";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";

const ConstraintDeletionDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const deletionInfo = props as IConstraintDeletionContent;
    const constraintInfo = useConstraintInfoProvider(deletionInfo.constraintId);
    const { deleteCompleteConstraint, deletionResult, resetDeletionResult } =
      useDeleteCompleteConstraintMutation();
    const { openSuccessDialog, openErrorDialog } = useDialog();

    useEffect(() => {
      if (isMutationCompleted(deletionResult)) {
        if (deletionResult.isSuccess) {
          openSuccessDialog(
            stringsConst.dialogs.ConstraintDeletionDialog.success
          );
        }

        if (deletionResult.isError) {
          openErrorDialog(stringsConst.dialogs.ConstraintDeletionDialog.error);
        }

        resetDeletionResult();
      }
    }, [
      deletionResult,
      openSuccessDialog,
      openErrorDialog,
      resetDeletionResult,
    ]);

    useImperativeHandle(ref, () => ({
      onProceed: () => {
        deleteCompleteConstraint(
          deletionInfo.constraintId,
          constraintInfo.constraintValues!
        );
      },
    }));

    return (
      <Text block>{stringsConst.dialogs.ConstraintDeletionDialog.proceed}</Text>
    );
  }
);

export default ConstraintDeletionDialog;
