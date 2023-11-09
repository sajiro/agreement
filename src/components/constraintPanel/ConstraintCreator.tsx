import { mergeStyles, TextField, Text } from "@fluentui/react";
import { IConstraintInfoEditor } from "models/constraintMutation";
import stringsConst from "consts/strings";
// import { getConstraintErrorMessage } from "helpers/constraint";
import customTheme from "helpers/customTheme";
import ConstraintEditSection from "./ConstraintEditSection";

const TextFieldClass = mergeStyles({
  marginBottom: 21,
  marginTop: 24,
  width: "70%",
});

function ConstraintCreator({
  constraintInfoEditor,
  isSubmitting,
}: {
  constraintInfoEditor: IConstraintInfoEditor;
  isSubmitting: boolean;
}) {
  const { constraintInfo, setConstraintName } = constraintInfoEditor;

  return (
    <ConstraintEditSection style={{ marginTop: 11 }}>
      <Text style={{ color: customTheme.secondaryGrey130 }}>
        {stringsConst.constraintPanel.ConstraintCreator.constraintDescription}
      </Text>
      <TextField
       data-automation-id="constraintname"
        className={TextFieldClass}
        label={
          stringsConst.constraintPanel.ConstraintCreator.constraintNameLabel
        }
        value={constraintInfo!.name}
        onChange={(_, newValue) => {
          setConstraintName(newValue!, "name");
        }}
        validateOnLoad={false}
        validateOnFocusOut
        // onGetErrorMessage={() => getConstraintErrorMessage(constraintInfo!)}
        errorMessage={constraintInfo!.errorMessage}
        disabled={isSubmitting}
        required
      />
      <TextField
       data-automation-id="constraintfriendlyname"
        className={TextFieldClass}
        label={
          stringsConst.constraintPanel.ConstraintCreator.constraintDisplayLabel
        }
        value={constraintInfo!.display}
        onChange={(_, newValue) => {
          setConstraintName(newValue!, "display");
        }}
        disabled={isSubmitting}
      />
    </ConstraintEditSection>
  );
}

export default ConstraintCreator;
