import {
  ICustomClausePropertiesForm,
  IModifiableCustomClauseProperties,
  IModifiableCustomClauseRevisionProperties,
} from "models/customClausePanel";
import {
  ICustomClauseInfo,
  // ICustomClauseRevision
} from "models/customClauses";

export const getDefaultPropertiesForm = (
  clauseInfo: ICustomClauseInfo
): ICustomClausePropertiesForm => {
  const customClause = clauseInfo.clause;

  return {
    properties: {
      category: customClause?.category || "Content",
      description: customClause?.description,
      name: customClause?.name,
      templateId: customClause?.templateId,
    },
    revisionProperties: {
      name: clauseInfo.currentRevision?.name || "V1",
    },
    isValid: true, // Cannot know validity here, but form won't be submittable unless it has changed anyways,
    hasChanges: false,
  };
};

type ModifiableProperties = {
  properties: IModifiableCustomClauseProperties;
  revisionProperties: IModifiableCustomClauseRevisionProperties;
};

const arePropertiesEqual = (
  properties1: ModifiableProperties,
  properties2: ModifiableProperties
) => {
  const clauseProperties1 = properties1.properties;
  const clauseProperties2 = properties2.properties;
  const revisionProperties1 = properties1.revisionProperties;
  const revisionProperties2 = properties2.revisionProperties;

  const isClausePropertiesEqual =
    clauseProperties1.name?.trim() === clauseProperties2.name?.trim() &&
    clauseProperties1.description?.trim() ===
      clauseProperties2.description?.trim() &&
    clauseProperties1.templateId === clauseProperties2.templateId;

  const isRevisionPropertiesEqual =
    revisionProperties1.name === revisionProperties2.name;

  return isClausePropertiesEqual && isRevisionPropertiesEqual;
};

export const getUpToDatePropertiesForm = (
  clauseInfo: ICustomClauseInfo,
  currentPropertiesForm: ICustomClausePropertiesForm
): ICustomClausePropertiesForm => {
  const customClause = clauseInfo.clause;

  const currentProperties: ModifiableProperties = {
    properties: {
      category: customClause?.category || "Content",
      description: customClause?.description,
      name: customClause?.name,
      templateId: customClause?.templateId,
    },
    revisionProperties: {
      name: clauseInfo.currentRevision?.name || "V1",
    },
  };
  const { hasChanges, isValid, ...modifiedProperties } = currentPropertiesForm;
  const areFormsSame = arePropertiesEqual(
    currentProperties,
    modifiedProperties
  );

  return areFormsSame
    ? { ...currentProperties, isValid: true, hasChanges: false }
    : { ...modifiedProperties, isValid: true, hasChanges: true };
};
