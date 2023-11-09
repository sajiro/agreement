import { IDropdownOption } from "@fluentui/react";
import {ITag } from '@fluentui/react/lib/Pickers';

export enum FormFieldType {
  textField,
  select,
  picker,
  clauseLabelDropDown,
}

export interface ICustomFormField {
  type: FormFieldType;
  label: string;
  defaultValue: string|undefined;
  value: string|undefined;
  propertyType: string;
  propertyName: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
  options?: IDropdownOption<any>[];  // for drop-downs only

  // for ClauseLabelDropDown
  selectedOptions?: IDropdownOption[];

  // for CustomPickerField
  selectedTags?: ITag[];
  ownerObjectId?: string;  // owner of the form: templateId, etc.

  // for Selenium testing
  dataAutomationId?: string;
}

export interface ICustomFormFieldProps extends ICustomFormField {
  onPropertyChangedHandler: (
    propertyType: string,
    propertyName: string,
    newValue: string | undefined,
    defaultValue: string|undefined
  ) => void;
  onPropertyBlurHandler: (
    propertyType: string,
    propertyName: string,
    newValue: string | undefined
  ) => void;
}