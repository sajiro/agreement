import stringsConst from "consts/strings";
import { IPanelMessage, IPanelMessageSlice } from "models/panelMessage";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { panelMessagesActions } from "store/panelMessagesSlice";

const usePanelMessenger = () => {
  const dispatch = useDispatch();

  // shared by Clause and Custom Clause
  const setClausePanelMessage = useCallback(
    (mainMessage: IPanelMessage, subMessages: IPanelMessage[] | undefined) => {
      const messageInfo: IPanelMessageSlice = { ...mainMessage };

      if (subMessages) {
        messageInfo.callout = {
          infoText: stringsConst.common.panelMessages.partialFailClause,
          subMessages,
        };
      }

      dispatch(panelMessagesActions.setMessage(messageInfo));
    },
    [dispatch]
  );

  const setConstraintPanelMessage = useCallback(
    (message: IPanelMessage, isPartialSuccess: boolean) => {
      const messageInfo: IPanelMessageSlice = { ...message };
      if (isPartialSuccess) {
        messageInfo.callout = {
          infoText: stringsConst.common.panelMessages.partialFailConstraint,
          subMessages: [],
        };
      }

      dispatch(panelMessagesActions.setMessage(messageInfo));
    },
    [dispatch]
  );

  const setTemplatePanelMessage = useCallback(
    (message: IPanelMessage) => {
      const messageInfo: IPanelMessageSlice = { ...message };

      dispatch(panelMessagesActions.setMessage(messageInfo));
    },
    [dispatch]
  );

  return {
    setClausePanelMessage,
    setConstraintPanelMessage,
    setTemplatePanelMessage,
  };
};

export default usePanelMessenger;
