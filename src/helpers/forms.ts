import { IComboBoxOption, IDropdownOption } from "@fluentui/react";
import { AgreementObjectEditState } from "models/agreements";
import { IClausePropertiesForm } from "models/clausePanel";
import { IClauseTranslationsForm } from "models/translations";
import stringsConst from "consts/strings";

interface Enum {
  [key: string]: string;
}

export const isEmptyString = (value: string) => value.length === 0; 

export const comboBoxOptions = (type: Enum): IComboBoxOption[] =>
  Object.keys(type).map((c) => ({
    key: c.toString(),
    text: c.toString(),
  }));

export const dropdownOptions = (type: Enum): IDropdownOption[] =>
  Object.keys(type).map((c) => ({
    key: c.toString(),
    text: c.toString(),
  }));

export const nameOf = <T>(name: keyof T) => name;

export const getFormFieldErrorMessage = (value: string): string => {
  if (isEmptyString(value)) return stringsConst.common.errorMessageEmpty;
  if (isEmptyString(value.trim())) return stringsConst.common.errorMessageWhitespace;
  return "" // No Error
}

export const isFormValid = (
  formValues: { value: string | undefined; required: boolean | undefined }[]
) =>
  formValues.every((formValue) => {
    const required = formValue.required || false;
    return (
      !required ||
      (formValue.value !== undefined && formValue.value.trim().length !== 0)
    );
  });

export const hasDifferentValuePairs = (
  valuePairs: { existing: string; new: string }[]
) => {
  const allSame = valuePairs.every(
    (valuePair) =>valuePair.new===undefined || valuePair.existing === valuePair.new 
  );
  return !allSame;
};

export const hasChanges = (
  propertiesForm: IClausePropertiesForm | undefined,
  translationsForm: IClauseTranslationsForm | undefined,
  editState: AgreementObjectEditState
) =>
  propertiesForm?.hasChanges ||
  translationsForm?.hasChanges ||
  editState === AgreementObjectEditState.NewRevision;
