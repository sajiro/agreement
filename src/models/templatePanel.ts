import { ITag } from "@fluentui/react/lib/Pickers";
import { IAgreementForm } from "./agreements";
import { ITemplateInfo } from "./templates";

export interface ITemplatePanelInfo {
  editState: TemplateEditState;
  templateId?: string;
  revisionId?: string;
}

export interface ITemplateFormsInfo {
  templateId: string | undefined;
  revisionId: string | undefined;
  propertiesForm: IModifiableTemplateProperties | undefined;
  isSubmitting: boolean;
}

export interface IModifiableTemplateProperties {
  name?: string;
  revision?: string;
  description?: string;
  tags?: ITag[];
}

export interface IModifiableTemplateRevisionProperties {
  name?: string;
  displayOption?: string;
}

export interface ITemplatePropertiesForm extends IAgreementForm {
  properties: IModifiableTemplateProperties;
}

export interface ITemplatePropertiesFormUpdatePayload extends IAgreementForm {
  properties?: Partial<IModifiableTemplateProperties>;
  revisionProperties?: Partial<IModifiableTemplateRevisionProperties>;
}

export interface ITemplateFormInitializationInfo {
  templateInfo: ITemplateInfo;
  // contentInfo: IClauseContentInfo;
  editState: TemplateEditState;
}

export enum TemplateEditState {
  NewTemplate = "NewTemplate",
  NewRevision = "NewRevision",
  Default = "Default"
}
