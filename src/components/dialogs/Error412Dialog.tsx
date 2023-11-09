import { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { Text } from "@fluentui/react/lib/Text";
import stringsConst from "consts/strings";
import useDialog from "hooks/useDialog";
import useRouter from "hooks/useRouter";
import { IDialogContentComponent } from "models/dialogs";

const Error412Dialog = forwardRef(
  (_props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const { refresh } = useRouter();
    const { closeDialog } = useDialog();

    useImperativeHandle(ref, () => ({
      onProceed: () => {
        refresh();
        closeDialog();
      },
    }));

    return <Text>{stringsConst.dialogs.Error412.message}</Text>;
  }
);

export default Error412Dialog;
