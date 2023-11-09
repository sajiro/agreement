import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from "@reduxjs/toolkit/dist/query/react";
import { IRevision } from "./revisions";


export interface IAgreementForm {
  isValid: boolean;
  hasChanges: boolean;
}

export interface IAgreementObjectId {
  clauseId?: string;
  templateId?: string;
  revisionId?: string;
  constraintId?: string;
  isNothingSelected?: boolean;
}

export interface IAgreementObject {
  key: string;
  name: string;
  [k: string]: string | IAgreementObjectId;
  objectIdInfo: IAgreementObjectId;
}

export interface IAgreementObjectInfo {
  clause?: any;
  template?: any;
  revisions?: IRevision[];
  currentRevision?: IRevision;
  isLoading: boolean;
  hasData: boolean;
}

export interface IAgreementObjectContentInfo {
  contents?: any[];
  isLoading: boolean;
  hasData: boolean;
}

export interface IAgreementService {
  getAll: () => Promise<IAgreementObject[]>;
}

export enum AgreementObjectType {
  clause = "Clause",
  template = "Template",
  customClause = "CustomClause",
  constraint = "Constraint"
}

export enum AgreementObjectEditState {
  NewClause = "NewClause",
  NewTemplate = "NewTemplate",
  NewRevision = "NewRevision",
  Default = "Default"
}

export type UseGetAllQueryType = UseQuery<
  QueryDefinition<
    void,
    BaseQueryFn<string|FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
    never,
    IAgreementObject[],
    string
  >
>;