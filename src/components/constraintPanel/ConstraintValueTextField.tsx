import { IconButton, IStyle, TextField } from "@fluentui/react";
import icons from "components/shared/Icons";
import customTheme from "helpers/customTheme";
import { IMutableConstraintValue } from "models/constraintMutation";

export type ConstraintValueTextFieldProps = {
  disabled: boolean;
  disableTextInput?: boolean;
  constraintValue: IMutableConstraintValue;
  onValueUpdated?: (valueId: string, newValue: string) => void;
  toggleValueDeletion: (valueId: string) => void;
};

function ConstraintValueTextField({
  disabled,
  disableTextInput,
  constraintValue,
  onValueUpdated,
  toggleValueDeletion,
}: ConstraintValueTextFieldProps) {
  const actionIcon = constraintValue.isDeleted ? icons.undo : icons.cancel;
  const actionIconBottomPosition = constraintValue.errorMessage ? 20 : 0;
  const textStyle = constraintValue.isDeleted ? "line-through" : "none";
  const textFieldDisabledStyle: IStyle = {
    pointerEvents: disableTextInput || disabled ? "none" : undefined,
  };
  const constraintLabelId = `constraint_value_label_${constraintValue.id}`;

  return (
    <div style={{ position: "relative" }}>
      <span style={{ display: "none" }} id={constraintLabelId}>
        {constraintValue.display}
      </span>
      <TextField
        aria-labelledby={constraintLabelId}
        styles={{
          wrapper: {
            textDecoration: textStyle,
            ...textFieldDisabledStyle,
            borderBottom: `1px solid ${customTheme.divBorderColor}`,
          },
        }}
        value={
          constraintValue.display
            ? `${constraintValue.display} (${constraintValue.name})`
            : constraintValue.name
        }
        onChange={(_, newValue) => {
          onValueUpdated!(constraintValue.id, newValue!);
        }}
        underlined
        errorMessage={constraintValue.errorMessage}
      />
      <IconButton
      data-automation-id="removeconstraintValue"
        aria-label={`toggle deletion for ${constraintValue.name}`}
        style={{
          position: "absolute",
          right: 0,
          bottom: actionIconBottomPosition,
        }}
        styles={{
          rootHovered: { backgroundColor: "transparent" },
          root: { pointerEvents: disabled ? "none" : undefined },
        }}
        iconProps={actionIcon}
        onClick={() => {
          toggleValueDeletion(constraintValue.id);
        }}
      />
    </div>
  );
}

export default ConstraintValueTextField;
