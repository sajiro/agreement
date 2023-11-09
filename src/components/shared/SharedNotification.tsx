import { IMessageBarStyles, MessageBar } from "@fluentui/react/lib/MessageBar";
import stringsConst from "consts/strings";
import useTemplateEditPanelManager from "hooks/template/useTemplateEditPanelManager";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { TemplateEditPanelType } from "store/templateEditPanelManagementSlice";
import { templateEditActions } from "store/TemplateEditSlice";

function SharedNotification() {
  const dispatch = useDispatch();
  const { openedPanel } = useTemplateEditPanelManager();
  const { messageInfo } = useSelector((state: RootState) => state.templateEdit);

  const isPreviewPanelOpen = openedPanel === TemplateEditPanelType.Preview;
  const messageBarStyles: IMessageBarStyles = {
    root: {
      width: `calc(100% - ${isPreviewPanelOpen ? 320 : 0}px)`,
      position: "absolute",
      top: 96,
    },
  };

  const onDismiss = () => {
    dispatch(templateEditActions.setMessage(undefined));
  };

  useEffect(
    () => () => {
      onDismiss();
    },
    []
  );

  if (!messageInfo) return null;
  return (
    <MessageBar
      data-automation-id="notificationbar"
      messageBarType={messageInfo.type}
      styles={messageBarStyles}
      onDismiss={onDismiss}
      dismissButtonAriaLabel={stringsConst.common.closeButtonAriaLabel}
    >
      {messageInfo.message}
    </MessageBar>
  );
}

export default SharedNotification;
