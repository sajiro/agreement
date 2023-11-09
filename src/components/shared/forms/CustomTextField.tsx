import { IRawStyle, ITextFieldStyles, TextField } from "@fluentui/react";
import { getFormFieldErrorMessage } from "helpers/forms";
import { ICustomFormFieldProps } from "models/properties";
// import { useEffect, useState } from "react";

function CustomTextField({
  label,
  placeholder,
  value,
  defaultValue,
  required,
  propertyType,
  propertyName,
  disabled,
  dataAutomationId,
  onPropertyChangedHandler,
  onPropertyBlurHandler,
}: ICustomFormFieldProps) {
  const fieldProps: { multiline?: boolean; rows?: number } = {};

  const textFieldStyles: Partial<ITextFieldStyles> = {
    root: {
      marginBottom: "20px",
      width: "320px",
    },
  };

  if (propertyName === "description") {
    fieldProps.multiline = true;
    fieldProps.rows = 3;

    const rootStyles = textFieldStyles.root as IRawStyle;
    rootStyles.width = "420px";
  }

  return (
    <TextField
      data-automation-id={dataAutomationId}
      label={label}
      placeholder={placeholder}
      value={value}
      styles={textFieldStyles}
      validateOnFocusOut
      validateOnLoad={value !== defaultValue}
      onGetErrorMessage={required ? getFormFieldErrorMessage : undefined}
      onChange={(_, newValue?: string) => {
        onPropertyChangedHandler(
          propertyType!,
          propertyName!,
          newValue,
          defaultValue
        );
      }}
      onBlur={() => {
        onPropertyBlurHandler(propertyType!, propertyName!, value);
      }}
      required={required}
      disabled={disabled}
      {...fieldProps}
    />
  );
}

export default CustomTextField;
