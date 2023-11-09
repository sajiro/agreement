import { IConstraint } from "./constraints";
import { IRevision } from "./revisions";

export interface ITemplate {
  category: string;
  constraints: IConstraint[];
  createdBy: string;
  createdDate: string;
  description: string;
  etag: string;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  name: string;
  revisionsUri: string;
  status: string;
}

export interface ITemplateInfo {
  template?: ITemplate;
  revisions?: IRevision[];
  currentRevision?: IRevision;
  isLoading: boolean;
  hasData: boolean;
}

export interface IProvisionedTemplateInfo {
  templateInfo: ITemplateInfo;
  setCurrentRevision: (revision: ITemplateRevision | undefined) => void;
  isPublishable: boolean;
}

export interface ITemplateRevision extends IRevision {
  displayOption: string;
}


export const noCorrespondingLanguagePreviewErrorInfo = { code: "4001", messageRegex: "No (.*) content .* of part (.*)\\." };
export const noActiveRevisionLanguagePreviewErrorInfo = { code: "IncompleteAssemblyMaterial", messageRegex: ".* Part Id (.*) on .*" };
export interface ITemplatePreviewError {
  code: string;
  data: any[];
  details: { code: string; message: string; target: any }[];
  message: string;
  source: string;
}