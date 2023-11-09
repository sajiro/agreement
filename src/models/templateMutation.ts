import {
  IModifiableTemplateProperties,
  IModifiableTemplateRevisionProperties,
} from "./templatePanel";

export enum TemplateMutationActionType {
  CreateTemplate = "CreateTemplate",
  CreateRevision = "CreateRevision",
  CopySlots = "CopySlots",
}

export interface ITemplateMutationAction {
  actionType: TemplateMutationActionType;
  actionArgument: any;
}

export interface ICreateTemplateRequest {
  templateProperties: IModifiableTemplateProperties;
  revisionProperties: IModifiableTemplateRevisionProperties;
}

export interface ICreateTemplateRevisionRequest {
  templateId: string;
  revisionProperties: IModifiableTemplateRevisionProperties;
}

export interface ItemplatePreviewConfig {
  languagelocale: string;
  asofdate: string;
  context: { [key: string]: any };
  IncludeTestRevision: boolean;
}

export interface IPreviewTemplatePreviewRequest {
  templateId: string;
  revisionId: string;
  config: ItemplatePreviewConfig;
}
