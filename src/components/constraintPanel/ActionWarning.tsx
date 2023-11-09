import { FontIcon } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";

function ActionWarning() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        padding: 10,
        border: `1px solid ${customTheme.divBorderColor}`,
      }}
    >
      <FontIcon
        iconName="Info"
        style={{ fontSize: 18, marginRight: 8, color: customTheme.messageLink }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text variant="smallPlus" style={{ fontWeight: 700 }}>
          {stringsConst.constraintPanel.ConstraintActions.ActionWarning.heading}
        </Text>
        <Text variant="smallPlus">
          {
            stringsConst.constraintPanel.ConstraintActions.ActionWarning
              .description
          }
        </Text>
      </div>
    </div>
  );
}

export default ActionWarning;
