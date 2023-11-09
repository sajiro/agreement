import { mergeStyleSets } from '@fluentui/react';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Text } from '@fluentui/react/lib/Text';
import useDialog from "hooks/useDialog";
import { IDialogContentComponent, IMessageContent } from "models/dialogs";
import { ForwardedRef, forwardRef, useImperativeHandle } from "react";

const styles = mergeStyleSets({
  processingDialogContainer: {
    display:"flex",
    paddingTop:"17px"
  },
  spinner: {
    paddingRight:"10px"
  },
});

const ProcessingDialog = forwardRef((props: any, ref: ForwardedRef<IDialogContentComponent>) => {
  const { closeDialog } = useDialog();
  const messageInfo = props as IMessageContent;

  useImperativeHandle(ref, () => ({
    onProceed: closeDialog
  }));

  return (
     <div className={styles.processingDialogContainer}>
        <Spinner size={SpinnerSize.medium} className={styles.spinner} /><Text>{messageInfo.message}</Text>
      </div>
  );
});

export default ProcessingDialog;