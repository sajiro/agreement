import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { IAgreementObject } from "./agreements";

export interface IConstraintInfo {
  constraint: IConstraint | undefined;
  constraintValues: IConstraintValue[] | undefined;
  isLoading: boolean;
}

export interface IConstraint
  extends IConstraintIdentifiers,
    IConstraintMetadata {
  valuesUri: string;
}

export interface IConstraintValue
  extends IConstraintIdentifiers,
    IConstraintMetadata {
  inUse: boolean;
}

export interface IConstraintTemplateEditPanel {
  key: string;
  name: string;
  display: string;
}

export interface IConstraintIdentifiers extends IConstraintContent {
  id: string;
}

export interface IConstraintMetadata {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface IConstraintDisplayInfo {
  constraintLabel: string;
  values: IConstraintValue[];
}

export interface IConstraintDisplayMapping {
  [k: string]: IConstraintDisplayInfo;
}

export interface IConstraintContent {
  name: string;
  display: string;
}

export interface IConstraintValuesMappingFetcher {
  constraintsFetcher: () => Promise<{
    data?: IAgreementObject[];
    error?: FetchBaseQueryError | SerializedError;
  }>;
  constraintValuesFetcher: (
    constraintId: string
  ) => Promise<{
    data?: IConstraintValue[];
    error?: FetchBaseQueryError | SerializedError;
  }>;
}

export enum ConstraintEditState {
  New = "New",
  Edit = "Edit",
}

export enum ConstraintOperator {
  Include = "Include",
  Exclude = "Exclude",
}
