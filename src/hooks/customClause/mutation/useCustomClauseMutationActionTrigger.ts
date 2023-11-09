/* eslint-disable prefer-destructuring */

import { AgreementObjectEditState } from "models/agreements";
import {
  CustomClauseMutationActionType,
  ICustomClauseMutationAction,
  ICustomClausePropertiesUpdateInfo,
} from "models/customClauseMutation";
import { ICustomClausePropertiesForm } from "models/customClausePanel";
import { ICustomClauseInfo } from "models/customClauses";
import { IClauseTranslationsForm } from "models/translations";
import useCustomClauseMutator from "./useCustomClauseMutator";

enum CustomClauseEditState {
  NewClause = "NewClause",
  Default = "Default",
}

const useCustomClauseMutationActionTrigger = (
  clauseInfo: ICustomClauseInfo,
  propertiesForm: ICustomClausePropertiesForm | undefined,
  translationsForm: IClauseTranslationsForm | undefined
) => {
  const { setMutationActions } = useCustomClauseMutator(clauseInfo);

  const currentClause = clauseInfo.clause;
  const currentRevision = clauseInfo.currentRevision;

  const clausePropertyEditActions = [
    {
      actionType: CustomClauseMutationActionType.UpdateProperties,
      actionArgument: {
        clauseProperties: {
          id: currentClause?.id,
          name: propertiesForm?.properties.name?.trim(),
          templateId: currentClause?.templateId,
          description: propertiesForm?.properties.description?.trim(),
          etag: currentClause?.etag,
        },
        revisionProperties: {
          id: currentRevision?.id,
          name: currentRevision?.name,
          effectiveDate: currentRevision?.effectiveDate,
          status: currentRevision?.status,
          etag: currentRevision?.etag,
        },
      } as ICustomClausePropertiesUpdateInfo,
    },
  ];

  const translationsEditActions = [
    {
      actionType: CustomClauseMutationActionType.UploadTranslations,
      actionArgument: {
        templateId: currentClause?.templateId,
        clauseId: currentClause?.id,
        revisionId: currentRevision?.id,
        translationInfo: translationsForm?.uploadedTranslations,
      },
    },
  ];

  const editStateActionMappings: {
    [key in CustomClauseEditState]: () => ICustomClauseMutationAction[];
  } = {
    [AgreementObjectEditState.Default]: () => {
      const mutationActions: ICustomClauseMutationAction[] = [];

      if (propertiesForm?.hasChanges)
        mutationActions.push(...clausePropertyEditActions);

      if (translationsForm?.hasChanges)
        mutationActions.push(...translationsEditActions);

      return mutationActions;
    },
    [AgreementObjectEditState.NewClause]: () => {
      const createRevisionActionArgument = {
        templateId: propertiesForm!.properties.templateId,
        clauseId: currentClause!.id,
        revisionProperties: propertiesForm!.revisionProperties,
      };

      return [
        {
          actionType: CustomClauseMutationActionType.CreateClause,
          actionArgument: propertiesForm!.properties,
        },
        {
          actionType: CustomClauseMutationActionType.CreateRevision,
          actionArgument: createRevisionActionArgument,
        },
      ];
    },
  };

  const triggerMutation = (editState: AgreementObjectEditState) => {
    const editStateToUse = editState as unknown as CustomClauseEditState;
    const mutationActions = editStateActionMappings[editStateToUse]();

    setMutationActions(mutationActions);
  };

  return { triggerMutation };
};

export default useCustomClauseMutationActionTrigger;
