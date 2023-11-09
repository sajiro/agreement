import * as React from "react";
import {
  mergeStyleSets,
  DelayedRender,
  Callout,
  Text,
  DirectionalHint,
} from "@fluentui/react";
import icons from "components/shared/Icons";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { IconButton } from "@fluentui/react/lib/Button";

interface InfoCalloutProps {
  position: DirectionalHint;
  title: string;
  message?: JSX.Element;
  height?: string;
  width?: string;
}

const styles = mergeStyleSets({
  button: {
    height: "20px",
    width: "20px",
    position: "relative",
    top: "-1px",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:active": {
      backgroundColor: "transparent",
    },
    i: {
      fontSize: "12px",
    },
  },
  callout: {
    padding: "20px 24px",
  },
  title: {
    marginBottom: 12,
    fontWeight: 600,
  },
});

// eslint-disable-next-line
const InfoCallout: React.FC<InfoCalloutProps> = ({
  position,
  title,
  message,
  height,
  width
}) => {
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const buttonId = useId("callout-button");
  const labelId = useId("callout-label");

  return (
    <>
      <IconButton
        id={buttonId}
        aria-label="More info"
        iconProps={icons.info}
        onClick={toggleIsCalloutVisible}
        className={styles.button}
        data-automation-id="calloutbutton"
      />
      {isCalloutVisible && (
        <Callout
        data-automation-id="calloutcontainer"
          className={styles.callout}
          ariaLabelledBy={labelId}
          target={`#${buttonId}`}
          onDismiss={toggleIsCalloutVisible}
          role="status"
          aria-live="assertive"
          directionalHint={position}
          style={{height:height||"100%",width:width||"320px"}}
        >
          <DelayedRender>
            <div>
              <Text
                block
                variant="xLarge"
                className={styles.title}
                id={labelId}
                data-automation-id="calloutitle"
              >
                {title}
              </Text>
              {message}
            </div>
          </DelayedRender>
        </Callout>
      )}
    </>
  );
};

export default InfoCallout;
