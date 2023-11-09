import { IDropdownOption } from "@fluentui/react";
import _ from "lodash";

import { ILabelData } from "models/clauseLabels";
import {
  IClausePropertiesForm,
  IModifiableClauseProperties,
  IModifiableClauseRevisionProperties,
} from "models/clausePanel";
import {
  ClauseDisplayOption,
  IClauseInfo,
  IClauseRevision,
} from "models/clauses";

export const getDefaultPropertiesForm = (
  clauseInfo: IClauseInfo,
  isBusinessUnitPS?: boolean
): IClausePropertiesForm => {
  const currentRevision = clauseInfo?.currentRevision as IClauseRevision;

  const result: IClausePropertiesForm = {
    properties: {
      name: clauseInfo.clause?.name,
      category: clauseInfo.clause?.category?.toString(),
    },
    revisionProperties: {
      displayOption:
        currentRevision?.displayOption || ClauseDisplayOption.Default,
      name: clauseInfo.currentRevision?.name,
    },
    isValid: true, // Cannot know validity here, but form won't be submittable unless it has changed anyways,
    hasChanges: false,
  };

  // "PS Category" clause labels are only used by "Professional Services" business unit
  if (isBusinessUnitPS && clauseInfo.psCategoryLabelInfo) {
    result.properties.psCategoryLabelInfo = {
      ...clauseInfo.psCategoryLabelInfo,
    };
  }

  return result;
};

type ClauseModifiableProperties = {
  properties: IModifiableClauseProperties;
  revisionProperties: IModifiableClauseRevisionProperties;
};

export const diffClauseLabels = (
  labels_1: ILabelData[],
  labels_2: ILabelData[]
) => {
  const iteratee = (item: ILabelData) => item.id;

  const diff1 = _.differenceBy(labels_1, labels_2, iteratee);
  const diff2 = _.differenceBy(labels_2, labels_1, iteratee);

  return {
    deleted: diff1,
    added: diff2,
  };
};

export const areClauseLabelsEqual = (
  labels_1: ILabelData[],
  labels_2: ILabelData[]
) => {
  const { deleted, added } = diffClauseLabels(labels_1, labels_2);

  return deleted.length === 0 && added.length === 0;
};

export const areClauseModifiablePropertiesEqual = (
  properties1: ClauseModifiableProperties,
  properties2: ClauseModifiableProperties,
  isBusinessUnitPS?: boolean
) => {
  let isPropertiesEqual =
    properties1.properties.category === properties2.properties.category &&
    properties1.properties.name?.trim() === properties2.properties.name?.trim();

  // "PS Category" clause labels are only used by "Professional Services" business unit
  if (isBusinessUnitPS && isPropertiesEqual) {
    const psCategoryLabelInfo1 = properties1.properties.psCategoryLabelInfo;
    const psCategoryLabelInfo2 = properties2.properties.psCategoryLabelInfo;

    if (psCategoryLabelInfo1 && psCategoryLabelInfo2) {
      isPropertiesEqual = areClauseLabelsEqual(
        psCategoryLabelInfo1.clauseLabels,
        psCategoryLabelInfo2.clauseLabels
      );
    }
  }

  const isRevisionPropertiesEqual =
    properties1.revisionProperties.displayOption ===
      properties2.revisionProperties.displayOption &&
    properties1.revisionProperties.name?.trim() ===
      properties2.revisionProperties.name?.trim();

  return isPropertiesEqual && isRevisionPropertiesEqual;
};

export const getUpToDatePropertiesForm = (
  clauseInfo: IClauseInfo,
  currentPropertiesForm: IClausePropertiesForm,
  isBusinessUnitPS?: boolean
): IClausePropertiesForm => {
  const currentRevision = clauseInfo?.currentRevision as IClauseRevision;

  const currentProperties: ClauseModifiableProperties = {
    properties: {
      category: clauseInfo.clause?.category,
      name: clauseInfo.clause?.name,
    },
    revisionProperties: {
      name: currentRevision?.name,
      displayOption: currentRevision?.displayOption?.toString(),
    },
  };

  // "PS Category" clause labels are only used by "Professional Services" business unit
  if (isBusinessUnitPS && clauseInfo.psCategoryLabelInfo) {
    currentProperties.properties.psCategoryLabelInfo = {
      ...clauseInfo.psCategoryLabelInfo,
    };
  }

  const { hasChanges, isValid, ...modifiedProperties } = currentPropertiesForm;
  const areFormsSame = areClauseModifiablePropertiesEqual(
    currentProperties,
    modifiedProperties
  );

  return areFormsSame
    ? { ...currentProperties, isValid: true, hasChanges: false }
    : { ...modifiedProperties, isValid: true, hasChanges: true };
};

export const getDropdownOptionsFromLabels = (
  labels: ILabelData[] | undefined
) => {
  if (!labels) {
    return [];
  }

  const options: IDropdownOption[] = labels.map((label) => ({
    key: label.id,
    text: label.name || "",
  }));

  return options;
};

export const getLabelsFromDropdownOptions = (
  options: IDropdownOption[] | undefined
) => {
  if (!options) {
    return [];
  }

  const labels: ILabelData[] = options.map((option) => ({
    id: option.key.toString(),
    name: option.text || "",
  }));

  return labels;
};
