import { FontIcon } from "@fluentui/react";
import { IPanelMessage, PanelMessageType } from "models/panelMessage";
import { CSSProperties } from "react";

function getMessageIcon(messageType: PanelMessageType) {
  const iconStyle: CSSProperties = {
    fontSize: "18px",
    position: "relative",
    marginRight: "6px",
    top: "4px",
  };

  return {
    [PanelMessageType.Success]: <FontIcon iconName="CheckMark" style={{ color: "#107C10", ...iconStyle }} />,
    [PanelMessageType.Error]: <FontIcon iconName="ErrorBadge" style={{ color: "#A4262C", ...iconStyle }} />,
    [PanelMessageType.Canceled]: <FontIcon iconName="Blocked2" style={{ color: "#797775", ...iconStyle }} />
  }[messageType];
}

function PanelMessage({message, type}: IPanelMessage) {
  return (
    <>{getMessageIcon(type!)}{message}</>
  );
}

export default PanelMessage;