import CustomTextField from "components/shared/forms/CustomTextField";
import CustomDropDown from "components/shared/forms/CustomDropDown";
import CustomPicker from "components/shared/forms/CustomPickerField";
import {
  FormFieldType,
  ICustomFormField,
  ICustomFormFieldProps,
} from "models/properties";
import ClauseLabelDropDown from "./forms/ClauseLabelDropDown";

export interface FormProps {
  onPropertyChanged: (
    propertyType: string,
    propertyName: string,
    newValue: string | undefined,
    defaultValue: string | undefined
  ) => void;
  formFields: ICustomFormField[];
  onPropertyBlur: (
    propertyType: string,
    propertyName: string,
    newValue: string | undefined
  ) => void;
}
// eslint-disable-next-line
const Forms = ({
  onPropertyChanged,
  formFields,
  onPropertyBlur,
}: FormProps) => {
  const formFieldTypeMappings = {
    [FormFieldType.textField]: CustomTextField,
    [FormFieldType.select]: CustomDropDown,
    [FormFieldType.picker]: CustomPicker,
    [FormFieldType.clauseLabelDropDown]: ClauseLabelDropDown,
  };
  const hiddenStyle = {
    display: "none",
  };

  return (
    <>
      {formFields.map((formField, index) => {
        const FormFieldComponent = formFieldTypeMappings[formField.type];
        const formFieldProps: ICustomFormFieldProps = {
          ...formField,
          onPropertyChangedHandler: onPropertyChanged,
          onPropertyBlurHandler: onPropertyBlur,
        };

        if (formField.hidden) {
          return (
            <div style={hiddenStyle} key={`formField_${index}`}>
              <FormFieldComponent {...formFieldProps} />
            </div>
          );
        }

        return (
          <FormFieldComponent key={`formField_${index}`} {...formFieldProps} />
        );
      })}
    </>
  );
};

export default Forms;
