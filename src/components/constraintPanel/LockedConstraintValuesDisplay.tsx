import { IConstraintValue } from "models/constraints";
import { Text } from "@fluentui/react/lib/Text";
import { Stack } from "@fluentui/react/lib/Stack";
import InfoCallout from "components/shared/InfoCallout";
import ColumnDisplay from "components/shared/ColumnDisplay";
import customTheme from "helpers/customTheme";
import stringsConst from "consts/strings";
import ConstraintEditSection from "./ConstraintEditSection";

function LockedConstraintValuesDisplay({
  lockedConstraintValues,
}: {
  lockedConstraintValues: IConstraintValue[];
}) {
  const values = lockedConstraintValues.map((v) => v.display || v.name);

  return (
    <ConstraintEditSection
      style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}
    >
      <Stack horizontal>
        <Text style={{ fontWeight: 600 }}>
          {
            stringsConst.constraintPanel.LockedConstraintValuesDisplay
              .inUseValues
          }
        </Text>
        <div style={{ paddingTop: "3px" }}>
          <InfoCallout
            position={1}
            title={
              stringsConst.constraintPanel.LockedConstraintValuesDisplay
                .inUseValues
            }
            message={
              <Text>
                {
                  stringsConst.constraintPanel.LockedConstraintValuesDisplay
                    .callOutMessage
                }
              </Text>
            }
            height="108px"
            width="258px"
          />
        </div>
      </Stack>
      <div style={{ color: customTheme.secondaryGrey130 }} data-automation-id="edit-panel-column-display">
        <ColumnDisplay
          maxColumnCount={2}
          minValuesPerColumn={5}
          noValuesMessage="none"
          values={values}
          isSmallSection
        />
      </div>
    </ConstraintEditSection>
  );
}

export default LockedConstraintValuesDisplay;
