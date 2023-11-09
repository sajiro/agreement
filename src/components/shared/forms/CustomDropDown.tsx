import { Dropdown, IDropdownOption } from "@fluentui/react";
import { ICustomFormFieldProps } from "models/properties";

const dropdownStyles: React.CSSProperties = {
  marginBottom: "20px",
  width: "320px",
};

// eslint-disable-next-line
const CustomDropDown = ({
  value: selectedKey,
  placeholder,
  label,
  options,
  disabled,
  required,
  propertyType,
  propertyName,
  dataAutomationId,
  onPropertyChangedHandler,
}: ICustomFormFieldProps) => (
  <Dropdown
    data-automation-id={dataAutomationId}
    selectedKey={selectedKey}
    placeholder={placeholder}
    label={label}
    options={options!}
    style={dropdownStyles}
    onChange={(_event, option?: IDropdownOption) => {
      onPropertyChangedHandler(
        propertyType!,
        propertyName!,
        option?.key as string,
        selectedKey
      );
    }}
    disabled={disabled}
    required={required}
    dropdownWidth="auto"
  />
);

export default CustomDropDown;
