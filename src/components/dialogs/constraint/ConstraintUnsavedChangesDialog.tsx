import useConstraintPanel from "hooks/constraint/useConstraintPanel";
import { IDialogContentComponent } from "models/dialogs";
import { ForwardedRef, forwardRef } from "react";
import UnsavedChangesDialog from "../UnsavedChangesDialog";

const ConstraintUnsavedChangesDialog = forwardRef((_props: any, ref: ForwardedRef<IDialogContentComponent>) => {
  const { closePanel } = useConstraintPanel();

  return (
    <UnsavedChangesDialog ref={ref} objectName="constraint" onProceedAction={closePanel} />
  );
});

export default ConstraintUnsavedChangesDialog;