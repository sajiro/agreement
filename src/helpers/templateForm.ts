import { ITemplatePropertiesForm, IModifiableTemplateProperties } from "../models/templatePanel";

type TemplateModifiableProperties = { properties: IModifiableTemplateProperties};
export const areClauseModifiablePropertiesEqual = (properties1: TemplateModifiableProperties, properties2: TemplateModifiableProperties) => {
  const isPropertiesEqual = 
    properties1.properties.description === properties2.properties.description &&
    properties1.properties.name === properties2.properties.name &&
    properties1.properties.revision === properties2.properties.revision &&
    properties1.properties.tags === properties2.properties.tags;

  return isPropertiesEqual ;
};
export const getUpToDatePropertiesForm = ( currentPropertiesForm: ITemplatePropertiesForm): ITemplatePropertiesForm => {
  const currentProperties: TemplateModifiableProperties = {
    properties: { description: "description", name: "clausename", revision: "revision", tags:[] }
  };
  const { hasChanges, isValid, ...modifiedProperties } = currentPropertiesForm;
  const areFormsSame = areClauseModifiablePropertiesEqual(currentProperties, modifiedProperties);
  return areFormsSame ? { ...currentProperties, isValid: true, hasChanges: false } : { ...modifiedProperties, isValid: true, hasChanges: true };
};

export const hasChangesTemplateProperties = (propertiesForm: IModifiableTemplateProperties | undefined) =>
  propertiesForm?.name || 
  propertiesForm?.description || 
  (propertiesForm?.tags && propertiesForm?.tags.length > 0);

export const isValidTemplateProperties = (propertiesForm: IModifiableTemplateProperties | undefined) =>
  !!propertiesForm?.name?.trim();
