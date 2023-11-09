import { IAgreementForm, AgreementObjectEditState } from "./agreements";
import { IClauseLabelInfo } from "./clauseLabels"
import { IClauseContentInfo, IClauseInfo } from "./clauses";
import { IClauseTranslationsForm } from "./translations";

export interface IClauseFormInitializationInfo {
  clauseInfo: IClauseInfo;
  contentInfo: IClauseContentInfo;
  editState: AgreementObjectEditState;

  // "PS Category" clause labels are only used by "Professional Services" business unit
  isBusinessUnitPS?: boolean;
}

export interface IClauseFormsInfo {
  clauseId: string | undefined;
  revisionId: string | undefined;
  propertiesForm: IClausePropertiesForm | undefined;
  translationsForm: IClauseTranslationsForm | undefined;
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

export interface IClausePropertiesFormUpdatePayload extends IAgreementForm {
  properties?: Partial<IModifiableClauseProperties>;
  revisionProperties?: Partial<IModifiableClauseRevisionProperties>;
}

export interface IClausePropertiesForm extends IAgreementForm {
  properties: IModifiableClauseProperties;
  revisionProperties: IModifiableClauseRevisionProperties;
}

export interface IModifiableClauseProperties {
  name?: string;
  category?: string;

  // clause labels for "Professional Services" business unit
  psCategoryLabelInfo?: IClauseLabelInfo;
}

export interface IModifiableClauseRevisionProperties {
  name?: string;
  displayOption?: string;
}

export interface IClausePanelInfo {
  editState: AgreementObjectEditState;
  clauseId?: string;
  revisionId?: string;
}
