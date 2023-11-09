import { IDropdownOption } from "@fluentui/react";
import {
  dropdownOptions,
  hasDifferentValuePairs,
  isFormValid,
  nameOf,
} from "helpers/forms";
import {
  IClausePropertiesFormUpdatePayload,
  IModifiableClauseProperties,
  IModifiableClauseRevisionProperties,
} from "models/clausePanel";
import {
  ClauseCategory,
  ClauseDisplayOption,
  IClauseInfo,
  IClauseRevision,
} from "models/clauses";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { clausePanelFormsActions } from "store/clausePanelFormsSlice";
import Forms from "components/shared/Forms";
import { FormFieldType, ICustomFormField } from "models/properties";
import { AgreementObjectEditState } from "models/agreements";
import stringsConst from "consts/strings";
import { getDropdownOptionsFromLabels } from "helpers/clauseForms";

const clauseCategoryOptions: IDropdownOption[] =
  dropdownOptions(ClauseCategory);

const clauseDisplayOptions: IDropdownOption[] =
  dropdownOptions(ClauseDisplayOption);

// eslint-disable-next-line react/function-component-definition
const ClausePropertiesForm = ({
  editState,
  clauseInfo,
}: {
  editState: AgreementObjectEditState;
  clauseInfo: IClauseInfo;
}) => {
  const dispatch = useDispatch();
  const { propertiesForm, isSubmitting } = useSelector(
    (state: RootState) => state.clausePanelForms
  );
  const isNewClause = editState === AgreementObjectEditState.NewClause;

  // For disabling the form when an action is occurring (data is being retrieved or is submitting data)
  const isLoading = clauseInfo.isLoading || isSubmitting;

  const currentRevision = clauseInfo?.currentRevision as IClauseRevision;

  const formFields: ICustomFormField[] = [
    {
      type: FormFieldType.textField,
      propertyName: nameOf<IModifiableClauseProperties>("name"),
      propertyType: nameOf<IClausePropertiesFormUpdatePayload>("properties"),
      defaultValue: clauseInfo.clause?.name,
      value: propertiesForm?.properties.name,
      label: stringsConst.clausePanel.ClausePropertiesForm.clauseNameLabel,
      required: true,
      disabled: isLoading || false,
      dataAutomationId: "clauseNameField",
    },
    {
      type: FormFieldType.textField,
      propertyName: nameOf<IModifiableClauseRevisionProperties>("name"),
      propertyType:
        nameOf<IClausePropertiesFormUpdatePayload>("revisionProperties"),
      defaultValue: currentRevision?.name,
      value: propertiesForm?.revisionProperties.name,
      label: stringsConst.clausePanel.ClausePropertiesForm.versionNameLabel,
      required: false,
      placeholder:
        stringsConst.clausePanel.ClausePropertiesForm.versionPlaceholder,
      disabled: isLoading || isNewClause || false,
      hidden: isNewClause,
      dataAutomationId: "revisionNameField",
    },
    {
      type: FormFieldType.select,
      propertyName: nameOf<IModifiableClauseProperties>("category"),
      propertyType: nameOf<IClausePropertiesFormUpdatePayload>("properties"),
      options: clauseCategoryOptions,
      label: stringsConst.clausePanel.ClausePropertiesForm.categoryLabel,
      defaultValue: clauseInfo.clause?.category?.toString(),
      value: propertiesForm?.properties.category,
      placeholder:
        stringsConst.clausePanel.ClausePropertiesForm.categoryPlaceholder,
      required: true,
      disabled: isLoading || !isNewClause,
      dataAutomationId: "clauseCategoryField",
    },
    {
      type: FormFieldType.select,
      propertyName:
        nameOf<IModifiableClauseRevisionProperties>("displayOption"),
      propertyType:
        nameOf<IClausePropertiesFormUpdatePayload>("revisionProperties"),
      options: clauseDisplayOptions,
      label: stringsConst.clausePanel.ClausePropertiesForm.displayLabel,
      defaultValue: currentRevision?.displayOption?.toString(),
      value: propertiesForm?.revisionProperties?.displayOption,
      required: false,
      disabled: isLoading || false,
      dataAutomationId: "displayOptionField",
    },
  ];

  // "PS Category" drop-down is only displayed to users in "Professional Services" business unit
  if (clauseInfo.psCategoryLabelInfo) {
    const formLabelInfo = propertiesForm?.properties.psCategoryLabelInfo;

    formFields.push({
      type: FormFieldType.clauseLabelDropDown,
      propertyName: nameOf<IModifiableClauseProperties>("psCategoryLabelInfo"),
      propertyType: nameOf<IClausePropertiesFormUpdatePayload>("properties"),
      label: stringsConst.clausePanel.ClausePropertiesForm.psCategoryLabel,
      required: false,
      disabled: isLoading,
      defaultValue: "",
      value: "",
      options: getDropdownOptionsFromLabels(
        clauseInfo.psCategoryLabelInfo.psCategoryLabels
      ),
      selectedOptions: getDropdownOptionsFromLabels(
        formLabelInfo?.clauseLabels
      ),
      ownerObjectId: clauseInfo.clause?.id,
      dataAutomationId: "psCategoryField",
    });
  }

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

    // separate flow for "PS Category" clauseLabelDropDown control
    if (
      propertyName ===
      nameOf<IModifiableClauseProperties>("psCategoryLabelInfo")
    ) {
      dispatch(clausePanelFormsActions.setFormValid({ isValid }));
      return;
    }

    const hasChanges = hasDifferentValuePairs(formFieldValuesInfo);
    const updatedProperty: IClausePropertiesFormUpdatePayload = {
      [propertyType]: { [propertyName]: newValue },
      isValid,
      hasChanges,
    };

    dispatch(
      clausePanelFormsActions.updatePropertiesFormValue(updatedProperty)
    );
  };

  if (!propertiesForm) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  const onPropertyBlur = () => {};

  return (
    <div
      data-automation-id="clausePropertiesForm" 
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

export default ClausePropertiesForm;
