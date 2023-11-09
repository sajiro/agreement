import useDialog from "hooks/useDialog";
import { IDialogContentComponent } from "models/dialogs";
import { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { Text } from "@fluentui/react/lib/Text";
import stringsConst from "consts/strings";

type UnsavedChangesDialogProps = {
  objectName: string;
  onProceedAction: () => void;
};
const UnsavedChangesDialog = forwardRef(
  (
    props: UnsavedChangesDialogProps,
    ref: ForwardedRef<IDialogContentComponent>
  ) => {
    const { closeDialog } = useDialog();
    const { objectName, onProceedAction } = props;
    useImperativeHandle(ref, () => ({
      onProceed: () => {
        onProceedAction();
        closeDialog();
      },
    }));

    return (
      <Text block>
        {stringsConst.dialogs.UnsavedChangesDialog.message({ objectName })}
      </Text>
    );
  }
);

export default UnsavedChangesDialog;
