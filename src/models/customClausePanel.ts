import { AgreementObjectEditState, IAgreementForm } from "./agreements";
import { ICustomClauseContentInfo, ICustomClauseInfo } from "./customClauses";
import { IClauseTranslationsForm } from "./translations";

export interface ICustomClauseFormInitializationInfo {
  clauseInfo: ICustomClauseInfo;
  contentInfo: ICustomClauseContentInfo;
  editState: AgreementObjectEditState;
}

export interface ICustomClausePanelInfo {
  editState: AgreementObjectEditState;
  templateId?: string;
  clauseId?: string;
  revisionId?: string;
}

export interface ICustomClauseFormsInfo {
  templateId?: string;
  clauseId?: string;
  revisionId?: string;
  propertiesForm?: ICustomClausePropertiesForm;
  translationsForm?: IClauseTranslationsForm;
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

export interface ICustomClausePropertiesFormUpdatePayload
  extends IAgreementForm {
  properties?: Partial<IModifiableCustomClauseProperties>;
  revisionProperties?: Partial<IModifiableCustomClauseRevisionProperties>;
}

export interface ICustomClausePropertiesForm extends IAgreementForm {
  properties: IModifiableCustomClauseProperties;
  revisionProperties: IModifiableCustomClauseRevisionProperties;
}

export interface IModifiableCustomClauseProperties {
  category?: string; // legacy code - is set to "Content" by default, cannot be modified
  description?: string;
  name?: string;
  templateId?: string;
}

// Custom Clause has no modifiable properties
//   name is set to "V1" by default
export interface IModifiableCustomClauseRevisionProperties {
  name?: string;
}
