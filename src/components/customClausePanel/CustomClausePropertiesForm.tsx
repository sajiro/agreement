import { useDispatch, useSelector } from "react-redux";
// import { IDropdownOption } from "@fluentui/react";

import Forms from "components/shared/Forms";
import {
  // dropdownOptions,
  hasDifferentValuePairs,
  isFormValid,
  nameOf,
} from "helpers/forms";
import { AgreementObjectEditState } from "models/agreements";
import {
  ICustomClausePropertiesFormUpdatePayload,
  IModifiableCustomClauseProperties,
  // IModifiableCustomClauseRevisionProperties,
} from "models/customClausePanel";
import {
  // CustomClauseCategory,
  // ClauseDisplayOption,
  ICustomClauseInfo,
  // ICustomClauseRevision,
} from "models/customClauses";
import { FormFieldType, ICustomFormField } from "models/properties";
import { RootState } from "store";
import { customClausePanelFormsActions } from "store/customClausePanelFormsSlice";
import { config } from "config";

// eslint-disable-next-line react/function-component-definition
const CustomClausePropertiesForm = ({
  editState,
  clauseInfo,
}: {
  editState: AgreementObjectEditState;
  clauseInfo: ICustomClauseInfo;
}) => {
  const dispatch = useDispatch();
  const { propertiesForm, isSubmitting } = useSelector(
    (state: RootState) => state.customClausePanelForms
  );
  const isNewClause = editState === AgreementObjectEditState.NewClause;

  // For disabling the form when an action is occurring (data is being retrieved or is submitting data)
  const isLoading = clauseInfo.isLoading || isSubmitting;

  const currentClause = clauseInfo.clause;
  const formProperties = propertiesForm?.properties;

  const formFields: ICustomFormField[] = [
    {
      type: FormFieldType.textField,
      propertyName: nameOf<IModifiableCustomClauseProperties>("name"),
      propertyType:
        nameOf<ICustomClausePropertiesFormUpdatePayload>("properties"),
      defaultValue: currentClause?.name,
      value: formProperties?.name,
      label: "Clause name",
      required: true,
      disabled: isLoading || false,
      dataAutomationId: "customClauseNameField",
    },
    {
      type: FormFieldType.select,
      propertyName: nameOf<IModifiableCustomClauseProperties>("templateId"),
      propertyType:
        nameOf<ICustomClausePropertiesFormUpdatePayload>("properties"),
      options: config.customClauseTemplateInfo,
      label: "Template",
      defaultValue: currentClause?.templateId,
      value: formProperties?.templateId,
      placeholder: "Select an option",
      required: true,
      disabled: isLoading || !isNewClause,
      dataAutomationId: "customClauseTemplateField",
    },
    {
      type: FormFieldType.textField,
      propertyName: nameOf<IModifiableCustomClauseProperties>("description"),
      propertyType:
        nameOf<ICustomClausePropertiesFormUpdatePayload>("properties"),
      defaultValue: currentClause?.description,
      value: formProperties?.description,
      label: "Description",
      required: false,
      disabled: isLoading || false,
      dataAutomationId: "customClauseDescriptionField",
    },
  ];

  const onPropertyChanged = (
    propertyType: string,
    propertyName: string,
    newValue: string | undefined
  ) => {
    const updatedFormField = formFields.find(
      (f) => f.propertyType === propertyType && f.propertyName === propertyName
    );
    updatedFormField!.value = newValue;

    const formFieldValuesInfo = formFields.map((f) => ({
      existing: f.defaultValue!,
      new: f.value!,
      value: f.value,
      required: f.required,
    }));
    const isValid = isFormValid(formFieldValuesInfo);
    const hasChanges = hasDifferentValuePairs(formFieldValuesInfo);

    const updatedProperty: ICustomClausePropertiesFormUpdatePayload = {
      [propertyType]: { [propertyName]: newValue },
      isValid,
      hasChanges,
    };

    dispatch(
      customClausePanelFormsActions.updatePropertiesFormValue(updatedProperty)
    );
  };

  if (!propertiesForm) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  const onPropertyBlur = () => {};

  return (
    <div
      data-automation-id="customClausePropertiesForm"  
      style={{ maxWidth: "50%" }}
    >
      <Forms
        formFields={formFields}
        onPropertyChanged={onPropertyChanged}
        onPropertyBlur={onPropertyBlur}
      />
    </div>
  );
};

export default CustomClausePropertiesForm;
