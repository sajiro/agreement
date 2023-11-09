import { Spinner } from "@fluentui/react";
import { IPanelMessage } from "models/panelMessage";
import { useSelector } from "react-redux";
import { RootState } from "store";
import PanelMessage from "./PanelMessage";
import PanelMessageCallout from "./PanelMessageCallout";

function SubmittingMessage() {
  return <Spinner label="Committing changes..." labelPosition="right" />;
}

function MainMessage({message, type, isSubmitting}: IPanelMessage & {isSubmitting: boolean;}) {
  return (
    <>
      { isSubmitting && <SubmittingMessage /> }
      { !isSubmitting && type && <PanelMessage message={message} type={type} /> }
    </>
  ); 
}

function PanelMessenger({ isSubmitting }: {isSubmitting: boolean;}) {
  const { message, type, callout } = useSelector((state: RootState) => state.panelMessages);

  return (
    <div
      role="alert"
      data-automation-id="panel-message"
      style={{ marginLeft: 12 }}
    >
      <MainMessage isSubmitting={isSubmitting} message={message} type={type} />
      { callout && !isSubmitting && <PanelMessageCallout callout={callout} buttonText="more info" /> }
    </div>
  );
}

export default PanelMessenger;