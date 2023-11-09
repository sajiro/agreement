import { IConstraintValuesEditor } from "models/constraintMutation";
import { mergeStyleSets } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import customTheme from "helpers/customTheme";
import stringsConst from "consts/strings";
import ConstraintValueTextField from "./ConstraintValueTextField";
import ConstraintEditSection from "./ConstraintEditSection";

const styles = mergeStyleSets({
  deletableValuesClass: {
    display: "flex",
    flexDirection: "column",
  },
  deletableValuesTextClass: {
    lineHeight: 20,
    paddingTop: 5,
    color: customTheme.secondaryGrey130,
  },
  deletableValuesTextFieldClass: {
    ".ms-TextField": {
      paddingRight: 24,
    },
  },
  labels: {
    fontWeight: 600,
  },
});
function ConstraintValuesRemover({
  constraintValuesEditor,
  isSubmitting,
}: {
  constraintValuesEditor: IConstraintValuesEditor;
  isSubmitting: boolean;
}) {
  const { removableConstraintValues, toggleConstraintValueDeletion } =
    constraintValuesEditor;

  if (removableConstraintValues.length === 0) {
    return (
      <div className={styles.deletableValuesClass}>
        <Text className={styles.labels}>
          {stringsConst.constraintPanel.ConstraintValuesRemover.deletableValues}
        </Text>
        <Text className={styles.deletableValuesTextClass}>
          {
            stringsConst.constraintPanel.ConstraintValuesRemover
              .initialDeleteValueDesc
          }
        </Text>
      </div>
    );
  }
  return (
    <ConstraintEditSection style={{ display: "flex", flexDirection: "column" }}>
      <Text className={styles.labels}>
        {stringsConst.constraintPanel.ConstraintValuesRemover.deletableValues}
      </Text>
      <Text className={styles.deletableValuesTextClass}>
        {stringsConst.constraintPanel.ConstraintValuesRemover.renameDesc}
      </Text>
      <div style={{ marginTop: 15 }}>
        {removableConstraintValues!.map((constraintValue, index) => (
          <div
            className={styles.deletableValuesTextFieldClass}
            key={`constraintValue_${index}`}
          >
            <ConstraintValueTextField
              constraintValue={constraintValue}
              toggleValueDeletion={toggleConstraintValueDeletion}
              disabled={isSubmitting}
              disableTextInput
            />
          </div>
        ))}
      </div>
    </ConstraintEditSection>
  );
}

export default ConstraintValuesRemover;
