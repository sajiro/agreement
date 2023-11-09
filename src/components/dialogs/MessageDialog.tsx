import useDialog from "hooks/useDialog";
import { IDialogContentComponent, IMessageContent } from "models/dialogs";
import { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { Text } from '@fluentui/react/lib/Text';

const MessageDialog = forwardRef((props: any, ref: ForwardedRef<IDialogContentComponent>) => {
  const { closeDialog } = useDialog();
  const { message, subMessages } = props as IMessageContent;

  useImperativeHandle(ref, () => ({
    onProceed: closeDialog
  }));

  return (
    <>
      <Text>{message}</Text>
      { subMessages && <div>
        <ul>
          { subMessages.map((subMessage, index) => (
            <li key={`subMessage${index}`}>{subMessage}</li>
          )) }
        </ul>
      </div> }
    </>
  );
});

export default MessageDialog;