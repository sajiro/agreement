import { ActionButton, Callout, DirectionalHint, mergeStyleSets, Text } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { IPanelMessageCallout } from "models/panelMessage";
import PanelMessage from "./PanelMessage";

const styles = mergeStyleSets({
  callout: {
    borderRadius: "2px",
    width: "400px",
    padding: "20px 24px 24px 24px",
  },
  calloutTitle: {
    marginBottom: "12px",
    fontSize: "20px",
    lineHeight: "28px",
  },
  calloutBody: {
    marginBottom: "16px",
    fontSize: "12px",
    lineHeight: "16px",
  },
  message: {
    marginBottom: "8px",
  },
  messageText: {
    fontSize: "14px",
    lineHeight: "16px",
  }
});

function MessageCallout({ callout, targetId, toggleCallout }: { callout: IPanelMessageCallout; targetId: string; toggleCallout: () => void; }) {
  const labelId = useId("callout-label");
  const descriptionId = useId("callout-description");
  const messagesId = useId("messages");

  return (
    <Callout
      ariaLabelledBy={labelId}
      ariaDescribedBy={descriptionId}
      className={styles.callout}
      beakWidth={16}
      target={`#${targetId}`}
      onDismiss={toggleCallout}
      directionalHint={DirectionalHint.topRightEdge}
    >
      <Text block id={labelId} className={styles.calloutTitle}>Unable to save all edits</Text>
      <Text block id={descriptionId} className={styles.calloutBody}>{callout.infoText}</Text>
      <div id={messagesId}>
        {callout.subMessages.map((message, index) =>
          <div key={index} className={styles.message}>
            <span className={styles.messageText}>
              <PanelMessage message={message.message} type={message.type} />
            </span>
          </div>
        )}
      </div>
    </Callout>
  );
}

function PanelMessageCallout({ buttonText, callout }: { buttonText: string; callout: IPanelMessageCallout; }) {
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  const buttonId = useId("callout-button");

  return (
    <span>
      <ActionButton id={buttonId} onClick={toggleIsCalloutVisible} text={buttonText} />
      { isCalloutVisible && <MessageCallout callout={callout} targetId={buttonId} toggleCallout={toggleIsCalloutVisible} /> }
    </span>
  );
}

export default PanelMessageCallout;