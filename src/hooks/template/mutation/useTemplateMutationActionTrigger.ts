/* eslint-disable arrow-body-style */

import {
  ITemplateMutationAction,
  TemplateMutationActionType,
} from "models/templateMutation";
import {
  IModifiableTemplateProperties,
  TemplateEditState,
} from "models/templatePanel";
import { ITemplateInfo } from "models/templates";
import useTemplateMutator from "./useTemplateMutator";

const useTemplateMutationActionTrigger = (
  templateInfo: ITemplateInfo,
  propertiesForm?: IModifiableTemplateProperties | undefined
) => {
  const { setMutationActions } = useTemplateMutator(templateInfo);

  const copySlotsAction = {
    actionType: TemplateMutationActionType.CopySlots,
    actionArgument: {
      templateId: templateInfo.template?.id,
      sourceRevisionId: templateInfo.currentRevision?.id,
      targetRevisionId: "",
    },
  };

  const editStateActionMappings: {
    [key in TemplateEditState]: () => ITemplateMutationAction[];
  } = {
    [TemplateEditState.Default]: () => {
      return [];
    },
    [TemplateEditState.NewTemplate]: () => {
      return [
        {
          actionType: TemplateMutationActionType.CreateTemplate,
          actionArgument: {
            templateProperties: {
              name: propertiesForm!.name?.trim(),
              description: propertiesForm!.description?.trim(),
            },
            revisionProperties: {
              name: "",
            },
          },
        },
      ];
    },
    [TemplateEditState.NewRevision]: () => {
      const createRevisionActionArgument = {
        templateId: templateInfo.template!.id,
        revisionProperties: {
          name: "",
        },
      };

      const mutationActions: ITemplateMutationAction[] = [
        {
          actionType: TemplateMutationActionType.CreateRevision,
          actionArgument: createRevisionActionArgument,
        },
      ];

      mutationActions.push(copySlotsAction);

      return mutationActions;
    },
  };

  const triggerMutation = (editState: TemplateEditState) => {
    const mutationActions = editStateActionMappings[editState]();
    setMutationActions(mutationActions);
  };

  return { triggerMutation };
};

export default useTemplateMutationActionTrigger;
