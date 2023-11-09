import stringsConst from "consts/strings";
import { DialogContentType, IConstraintDeletionContent } from "models/dialogs";
import useDialog from "../useDialog";

const useConstraintDialog = () => {
  const { openDialog } = useDialog();

  const openDeletionDialog = (deletionContent: IConstraintDeletionContent) => {
    const title = stringsConst.dialogs.useConstraintDialog.deleteConstraint;
    openDialog({
      title,
      type: DialogContentType.constraintDeletion,
      additionalInfo: deletionContent,
    });
  };

  const openUnsavedChangesDialog = () => {
    openDialog({
      title: stringsConst.dialogs.useConstraintDialog.unsavedChanges,
      type: DialogContentType.constraintUnsavedChanges,
    });
  };

  return { openDeletionDialog, openUnsavedChangesDialog };
};

export default useConstraintDialog;
