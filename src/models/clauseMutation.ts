import { IModifiableClauseProperties, IModifiableClauseRevisionProperties } from "./clausePanel";
import { IClause, IClauseRevision } from "./clauses";

export enum ClauseMutationActionType {
  CreateClause = "CreateClause",
  CreateRevision = "CreateRevision",
  UpdateProperties = "UpdateProperties",
  UpdateLabels = "UpdateLabels",
  DeleteTranslations = "DeleteTranslations",
  CopyTranslations = "CopyTranslations",
  UploadTranslations = "UploadTranslations",
}

export interface IClauseMutationAction {
  actionType: ClauseMutationActionType;
  actionArgument: any;
}

export interface IClausePropertiesUpdateInfo {
  clauseId: string;
  clauseProperties: Partial<IClause>;
  revisionProperties: Partial<IClauseRevision>;
}

export interface ICreateClauseRequest {
  clauseProperties: IModifiableClauseProperties;
  revisionProperties: IModifiableClauseRevisionProperties;
}

export interface ICreateClauseRevisionRequest {
  clauseId: string;
  revisionProperties: IModifiableClauseRevisionProperties;
}
export interface IPreviewDocumentURLRequest{
  clauseId:string|undefined;
  revisionId:string|undefined;
  language:string|undefined;
  content:any;
}

export interface IPreviewDocumentURLResponse{
  id:string;
  href:string;
}