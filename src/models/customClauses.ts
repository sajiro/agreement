import { IRevision } from "./revisions";

export interface IProvisionedCustomClauseInfo {
  clauseInfo: ICustomClauseInfo;
  clauseContentInfo: ICustomClauseContentInfo;
  setCurrentRevision: (revision: IRevision | undefined) => void;
}

export interface ICustomClauseContentInfo {
  contents?: ICustomClauseContent[];
  isLoading: boolean;
  hasData: boolean;
}

export interface ICustomClauseInfo {
  clause?: ICustomClause;
  revisions?: IRevision[];
  currentRevision?: IRevision;
  isLoading: boolean;
  hasData: boolean;
}

export interface ICustomClause {
  category: CustomClauseCategory | undefined;
  createdBy: string;
  createdDate: string;
  description: string;
  etag: string;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  name: string;
  revisionsUri: string;
  templateId: string;
  templateName: string;
}

export interface ICustomClauseRevision extends IRevision {
  displayOption?: string;
}

export enum CustomClauseCategory {
  Content = "Content",
}

export interface ICustomClauseContent {
  language: string;
  length: number;
  disposition: string;
  contents: any;
  lastModified: Date;
  status: string;
  sasUri: string;
  sasExpiration: Date;
}
