import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import {
  IConstraint,
  IConstraintContent,
  IConstraintIdentifiers,
  IConstraintValue,
} from "./constraints";

export interface IMutableConstraintBase {
  originalContent: IConstraintContent;
  errorMessage?: string;
  isModified: boolean;
  isValid: boolean;
}

export interface IMutableConstraintObject
  extends IMutableConstraintBase,
    IConstraintIdentifiers {}

export interface IMutableConstraint
  extends IMutableConstraintBase,
    IConstraint {}

export interface IMutableConstraintValue
  extends IMutableConstraintBase,
    IConstraintValue {
  isDeleted: boolean;
}

export interface IConstraintInfoEditor {
  constraintInfo: IMutableConstraint | undefined;
  setConstraintName: (name: string, what: string) => void;
  clear: () => void;
}

export interface IConstraintValuesEditor {
  newConstraintValues: IMutableConstraintValue[];
  removableConstraintValues: IMutableConstraintValue[];
  lockedConstraintValues: IConstraintValue[];
  updateNewConstraintValue: (id: string, newValue: any, what: string) => void; // POPO
  addConstraintValues: (values: string[]) => void;
  removeNewConstraintValue: (id: string) => void;
  toggleConstraintValueDeletion: (valueId: string) => void;
  clear: () => void;
}

export interface IFailedConstraintEdits {
  failedConstraintInfo?: IMutableConstraint;
  failedConstraintValueCreations?: IMutableConstraintValue[];
  failedConstraintValueDeletions?: IMutableConstraintValue[];
}

export interface IConstraintEditTracker {
  isSubmitting: boolean;
  failedEdits: IFailedConstraintEdits;
  setFailedConstraintCreation: (constraintInfo: IMutableConstraint) => void;
  setFailedValueCreations: (
    constraintValues: IMutableConstraintValue[]
  ) => void;
  setFailedValueDeletions: (
    constraintValues: IMutableConstraintValue[]
  ) => void;
  toggleIsSubmitting: () => void;
  clear: () => void;
}

export interface IConstraintEditInfo {
  constraintInfo: IMutableConstraint | undefined;
  newConstraintValues: IMutableConstraintValue[];
  removedConstraintValues: IMutableConstraintValue[];
}

export interface ICreateConstraintRequest {
  constraintInfo: IConstraintContent;
}

export interface ICreateConstraintValueRequest {
  constraintId: string | undefined;
  valueToCreate: IConstraintContent;
}

export interface IDeleteConstraintValueRequest {
  constraintId: string;
  constraintValueId: string;
}

export interface IMutationResult {
  isError: boolean;
  isSuccess: boolean;
  status: QueryStatus;
  errorMessage?: string;
}

export interface IConstraintValuesMutationResponse {
  successfulIds: string[];
  failureIds: string[];
}

export interface IConstraintValueInfo {
  id: string;
  name: string;
  display: string;
}

export interface IConstraintValuesMutationRequest
  extends IConstraintMutationRequest {
  constraintValueInfos: IConstraintValueInfo[];
}

/* export interface IMutationResult {
  isSuccess: boolean;
  isError: boolean;
  status: QueryStatus;
} */

export interface IConstraintMutationRequest {
  constraintId: string;
  allowRetry: boolean;
}
