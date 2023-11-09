import {
  IconButton,
  ITextFieldStyleProps,
  ITextFieldStyles,
  mergeStyleSets,
  TextField,
} from "@fluentui/react";
import icons from "components/shared/Icons";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";
import { IMutableConstraintValue } from "models/constraintMutation";
import { useCallback, useEffect, useState } from "react";

const actionIcon = icons.delete;

const styles = mergeStyleSets({
  ErrorP: {
    fontSize: 12,
    margin: "0 5px",
    color: customTheme.errorColor,
    lineHeight: 20,
  },
  textContainer: {
    width: "100%",
  },
});

const TextFieldStyle = (
  props: ITextFieldStyleProps
): Partial<ITextFieldStyles> => {
  const { required } = props;
  return {
    fieldGroup: [
      {
        backgroundColor: "transparent",
        border: "none",
        "::after": {
          border: "none",
        },
        "::before": {
          color: "transparent",
        },
      },

      required && {
        border: "green",
      },
    ],
  };
};

export type ConstraintCustomTextfieldProps = {
  disabled?: boolean;
  constraintValue: IMutableConstraintValue;
  toggleValueDeletion: (valueId: string) => void;
  onValueUpdated?: (valueId: string, newValue: any, what: string) => void;
  isFocused: boolean;
  index: number;
};

function ConstraintCustomTextfield({
  disabled,
  constraintValue,
  toggleValueDeletion,
  onValueUpdated,
  isFocused,
  index
}: ConstraintCustomTextfieldProps) {
  const ContainerStyle = (props: string) => {
    let borderStyle = `1px solid ${customTheme.divBorderColor}`;
    if (props === "focus") {
      borderStyle = `1px solid ${customTheme.focusColor}`;
    } else if (props === "error") {
      borderStyle = `1px solid ${customTheme.errorColor}`;
    }
    return {
      padding: "2px 0",
      display: "flex",
      borderBottom: borderStyle,
    };
  };
  const [showError, SetShowError] = useState(false);
  const [textFieldBorderState, SetTextFieldBorderState] = useState("default");

  const onChangeNameValue = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      onValueUpdated!(constraintValue.id, newValue!, "");
    },
    [onValueUpdated]
  );

  const onChangeDisplayValue = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      onValueUpdated!(constraintValue.id, newValue!, "display");
    },
    [onValueUpdated]
  );

  useEffect(() => {
    SetShowError(!!constraintValue.errorMessage);
  }, [constraintValue.errorMessage]);

  return (
    <>
      <div style={ContainerStyle(textFieldBorderState)}>
        <div className={styles.textContainer}>
          <TextField
          data-automation-id={`constraintvaluename${index}`}
            ariaLabel="name"
            disabled={disabled}
            value={constraintValue.name}
            styles={TextFieldStyle}
            onChange={(_, newValue) => {
              if (newValue === "") {
                SetShowError(false);
              }
              onChangeNameValue(_, newValue!);
            }}
            onFocus={() => {
              SetTextFieldBorderState("focus");
              if (!constraintValue.errorMessage) {
                SetShowError(false);
              }
            }}
            onBlur={(ev) => {
              if (ev.target.value === "") {
                SetShowError(true);
                SetTextFieldBorderState("error");
                onChangeNameValue(ev, ev.target.value);
              } else {
                SetTextFieldBorderState("default");
              }
            }}
            autoFocus={isFocused}
            required
            placeholder={stringsConst.common.EnterValue}
            aria-required
          />
        </div>
        <div className={styles.textContainer}>
          <TextField
            ariaLabel="display"
            onChange={onChangeDisplayValue}
            disabled={disabled}
            styles={TextFieldStyle}
            value={constraintValue.display}
            onFocus={() =>
              showError ? SetShowError(true) : SetTextFieldBorderState("focus")
            }
            onBlur={() =>
              showError
                ? SetShowError(true)
                : SetTextFieldBorderState("default")
            }
            data-automation-id={`constraintvaluefriendlyname${index}`}
          />
        </div>
        <IconButton
          aria-label={`toggle deletion for ${constraintValue.name}`}
          disabled={disabled}
          iconProps={actionIcon}
          onClick={() => {
            toggleValueDeletion(constraintValue.id);
          }}
        />
      </div>
      {!!constraintValue.errorMessage && showError && (
        <p className={styles.ErrorP} role="alert">
          {constraintValue.errorMessage}
        </p>
      )}
    </>
  );
}

export default ConstraintCustomTextfield;
