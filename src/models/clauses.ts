import { IClauseLabelInfo } from "./clauseLabels";
import { IRevision } from "./revisions";

export interface IProvisionedClauseInfo {
  clauseInfo: IClauseInfo;
  clauseContentInfo: IClauseContentInfo;
  setCurrentRevision: (revision: IRevision|undefined) => void;
  clausePlaceholderContent: IClausePlaceHolderContentInfo;

  // flag for GetClause 404 error -- only clauses, not custom clauses 
  isClause404Error?: boolean;
}

export interface IClausePlaceHolderContentInfo {
  content?: IClauseContent;
  isLoading: boolean;
  hasData: boolean;
}

export interface IClauseContentInfo {
  contents?: IClauseContent[];
  isLoading: boolean;
  hasData: boolean;
}

export interface IClauseInfo {
  clause?: IClause;
  revisions?: IRevision[];
  currentRevision?: IRevision;
  isLoading: boolean;
  hasData: boolean;

  // clause labels for "Professional Services" business unit
  psCategoryLabelInfo?: IClauseLabelInfo;
}

export interface IClause {
  category: ClauseCategory | undefined;
  createdBy: string;
  createdDate: string;
  description: string;
  etag: string;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  name: string;
  revisionsUri: string;
  status : string;
}

export interface IClauseRevision extends IRevision {
  contentsUri: string;
  displayOption: ClauseDisplayOption | undefined;
}

export enum ClauseCategory {
  Content = "Content",
  HeaderFooter = "Header/Footer",
}

export interface IClauseContent {
  language: string;
  length: number;
  disposition: string;
  contents: any;
  lastModified: Date;
  status: string;
  sasUri: string;
  sasExpiration: Date;
}

export interface ITranslationInfo {
  deleted: boolean;
  isSuccessfullyDeleted: boolean;
  isNewlyUploaded: boolean;
  value: string;
}

export interface IPublishedClause {
  key: string;
  name: string;
  category: ClauseCategory;
}

export enum ClauseDisplayOption {
  Default = "Default",
  Always = "Always",
  Suppress = "Suppress",
  AddOn = "AddOn",
}
