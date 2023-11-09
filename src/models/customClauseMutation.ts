import { 
  IModifiableCustomClauseProperties, 
  IModifiableCustomClauseRevisionProperties 
} from "./customClausePanel";
import { 
  ICustomClause, 
  ICustomClauseRevision 
} from "./customClauses";

export enum CustomClauseMutationActionType {
  CreateClause = "CreateClause",
  CreateRevision = "CreateRevision",
  UpdateProperties = "UpdateProperties",
  UploadTranslations = "UploadTranslations",
}

export interface ICustomClauseMutationAction {
  actionType: CustomClauseMutationActionType;
  actionArgument: any;
}

export interface ICustomClausePropertiesUpdateInfo {
  templateId: string;
  clauseId: string;
  clauseProperties: Partial<ICustomClause>;
  revisionProperties: Partial<ICustomClauseRevision>;
}

export interface ICreateCustomClauseRequest {
  clauseProperties: IModifiableCustomClauseProperties;
}

export interface ICreateCustomClauseRevisionRequest {
  templateId: string;
  clauseId: string;
  revisionProperties: IModifiableCustomClauseRevisionProperties;
}
