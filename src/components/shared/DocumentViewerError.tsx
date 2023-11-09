import { Text } from "@fluentui/react/lib/Text";
import { FontIcon } from "@fluentui/react";
import { CSSProperties } from "react";
import customTheme from "helpers/customTheme";

function DocumentViewerError({
  errorMessage,
  errorStyle,
}: {
  errorMessage: string;
  errorStyle?: CSSProperties;
}) {
  return (
    <div style={errorStyle}>
      <Text>
        <FontIcon
          iconName="ErrorBadge"
          style={{
            color: customTheme.errorIcon,
            marginRight: 3,
            position: "relative",
            top: 2,
          }}
        />
        {errorMessage}
      </Text>
    </div>
  );
}

export default DocumentViewerError;
