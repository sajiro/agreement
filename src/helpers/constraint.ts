import {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/dist/query";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { MaybePromise } from "@reduxjs/toolkit/dist/query/tsHelpers";
import stringsConst from "consts/strings";
import {
  IConstraintValueInfo,
  IConstraintValuesMutationResponse,
  IMutableConstraint,
  IMutableConstraintObject,
  IMutableConstraintValue,
} from "models/constraintMutation";
import {
  ConstraintEditState,
  IConstraint,
  IConstraintIdentifiers,
  /*   IConstraintNameType, */
  IConstraintValue,
} from "models/constraints";
import { IPanel, IPanelCache } from "models/panel";

export const isValidConstraintObjectValue = (value: string) => value.trim() !== "";

export const isExistingConstraintValue = (
  modifiedConstraint: IConstraintIdentifiers,
  existingValues: IConstraintIdentifiers[] | undefined
) => {
  const lowerCasedValue = modifiedConstraint.name.toLowerCase(); // Assumes name and display are the same
  return !!existingValues?.find(
    (v) =>
      v.id !== modifiedConstraint.id &&
      v.name !== "" &&
      v.name.toLowerCase() === lowerCasedValue
  );
};

export const getConstraintErrorMessage = (
  constraintObject: IMutableConstraintObject
) => {
  if (!constraintObject.isValid) {
    if (!isValidConstraintObjectValue(constraintObject.name)) {
      const constraintObjectType: string = constraintObject.id === "blankConstraint" ? "Constraint key" : "Constraint value key";
      const emptyErrorMessage = stringsConst.constraintPanel.ConstraintCreator.emptyErrorMessage({constraintObjectType});
      const whitespaceErrorMessage = stringsConst.constraintPanel.ConstraintCreator.whitespaceErrorMessage({constraintObjectType});
      const errorMessage = constraintObject.name === "" ? emptyErrorMessage : whitespaceErrorMessage;
      return errorMessage;
    }

    return "Constraint values must be unique";
  }

  return "";
};

export const setConstraintObjectValidity = (
  constraintObject: IMutableConstraintObject,
  existingValues: IConstraintIdentifiers[] | undefined,
  skipValidityCheck: boolean = false
) => {
  const isValidValue =
    skipValidityCheck || isValidConstraintObjectValue(constraintObject.name);
  const isExistingValue = isExistingConstraintValue(
    constraintObject,
    existingValues
  );

  if (!isValidValue || isExistingValue) {
    constraintObject.isValid = false;
  }
};

/* eslint no-param-reassign: "error" */
export const updateConstraintObject = (
  newValue: string,
  constraintObject: IMutableConstraintObject,
  existingValues: IConstraintIdentifiers[] | undefined,
  what: string = "name"
) => {
  if (what === "display") {
    constraintObject.display = newValue;
  } else {
    constraintObject.name = newValue;
    constraintObject.isModified =
      constraintObject.originalContent.name !== newValue;
    constraintObject.isValid = true;
    constraintObject.errorMessage = undefined; // remove any previous errors and treat as new update/edit

    setConstraintObjectValidity(constraintObject, existingValues);
    constraintObject.errorMessage = getConstraintErrorMessage(constraintObject);
  }
};

export const getNewConstraintValue = (
  constraintValue: string,
  constraintId: string
): IMutableConstraintValue => ({
  name: constraintValue,
  display: constraintValue,
  originalContent: { name: constraintValue, display: constraintValue },
  id: `${constraintId}`,
  createdBy: "",
  createdDate: "",
  modifiedBy: "",
  modifiedDate: "",
  isDeleted: false,
  isModified: true,
  inUse: false,

  // validity with overlapping values will be checked elsewhere, all newly added values need to be accounted for
  isValid: isValidConstraintObjectValue(constraintValue),
});

// Need to be reference values to prevent infinite loop of useEffect
export const EMPTY_CONSTRAINT_VALUES: IConstraintValue[] = [];
export const EMPTY_CONSTRAINT: IConstraint = {
  id: "blankConstraint",
  name: "",
  display: "",
  createdBy: "",
  createdDate: "",
  modifiedBy: "",
  modifiedDate: "",
  valuesUri: "",
};

export const convertToEditableConstraint = (
  constraint: IConstraint
): IMutableConstraint => ({
  ...constraint,
  originalContent: { name: constraint.name, display: constraint.display },
  isModified: false,
  isValid: isValidConstraintObjectValue(constraint.name),
});

export const convertToEditableConstraintValues = (
  constraintValues: IConstraintValue[]
): IMutableConstraintValue[] =>
  constraintValues.map((v) => ({
    ...v,
    originalContent: { name: v.name, display: v.display },
    isDeleted: false,
    isModified: false,
    isValid: true,
  }));

export type BaseQueryFunctionType = (
  arg: string | FetchArgs
) => MaybePromise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
>;

export const hasFailedResults = (results: IConstraintValuesMutationResponse) =>
  results.failureIds.length > 0;

export const deleteConstraintValues = async (
  constraintId: string,
  valuesToDelete: IConstraintValueInfo[],
  baseQuery: BaseQueryFunctionType
) => {
  const deletionPromises = valuesToDelete.map((cv) =>
    baseQuery({
      url: `constraint/${constraintId}/value/${cv.id}`,
      method: "DELETE",
    })
  );
  const deletionResults = await Promise.all(deletionPromises);
  const deletionResultsWithIds = deletionResults.map((dr, index) => ({
    id: valuesToDelete[index].id,
    ...dr,
  }));
  return {
    successfulIds: deletionResultsWithIds
      .filter((r) => r.data)
      .map((r) => r.id),
    failureIds: deletionResultsWithIds.filter((r) => r.error).map((r) => r.id),
  };
};

export const createConstraintValues = async (
  constraintId: string,
  valuesToCreate: IConstraintValueInfo[],
  baseQuery: BaseQueryFunctionType
) => {
  const creationPromises = valuesToCreate.map((cv) => {
    const { id, ...constraintInfo } = cv;
    return baseQuery({
      url: `constraint/${constraintId}/value`,
      method: "POST",
      body: constraintInfo,
    });
  });

  const creationResults = await Promise.all(creationPromises);
  const creationResultsWithIds = creationResults.map((cr, index) => ({
    id: valuesToCreate[index].id,
    ...cr,
  }));
  return {
    successfulIds: creationResultsWithIds
      .filter((cr) => cr.data)
      .map((r) => r.id),
    failureIds: creationResultsWithIds
      .filter((cr) => cr.error)
      .map((r) => r.id),
  };
};

export const isValidAndHasChanges = (
  constraintInfo: IMutableConstraint | undefined,
  newConstraintValues: IMutableConstraintValue[],
  removedConstraintValues: IMutableConstraintValue[],
  isNewConstraint: boolean
) => {
  const isNewConstraintValuesValid =
    (isNewConstraint ? newConstraintValues.length > 0 : true) &&
    newConstraintValues.every((v) => v.isValid);
  const isValid = !!constraintInfo?.isValid && isNewConstraintValuesValid;
  const editsMade =
    !!constraintInfo?.isModified ||
    newConstraintValues.length > 0 ||
    removedConstraintValues.length > 0;

  return { isValid, editsMade };
};

export const getConstraintPanelInfo = (panelInfo: IPanel & IPanelCache) => ({
  constraintId: panelInfo.agreementObjectIds.constraintId,
  editState:
    (panelInfo.additionalInfo.constraintEditState as ConstraintEditState) ||
    ConstraintEditState.Edit,
  authoringInfoShown:
    (panelInfo.persistentInfo.previouslyOpened as boolean) || false,
});
