import { areClauseLabelsEqual, diffClauseLabels } from "helpers/clauseForms";
import { getTranslationsToCopy } from "helpers/translations";
import useBusinessUnit from "hooks/useBusinessUnit";
import { AgreementObjectEditState } from "models/agreements";
import { IUpdateClauseLabelsRequest } from "models/clauseLabels";
import {
  ClauseMutationActionType,
  IClauseMutationAction,
  IClausePropertiesUpdateInfo,
} from "models/clauseMutation";
import { IClausePropertiesForm } from "models/clausePanel";
import {
  ClauseCategory,
  ClauseDisplayOption,
  IClauseInfo,
} from "models/clauses";
import { IClauseTranslationsForm } from "models/translations";
import useClauseMutator from "./useClauseMutator";

const useClauseMutationActionTrigger = (
  clauseInfo: IClauseInfo,
  propertiesForm: IClausePropertiesForm | undefined,
  translationsForm: IClauseTranslationsForm | undefined
) => {
  const { setMutationActions } = useClauseMutator(clauseInfo);

  // mutation actions after Create Clause, eg: Update Clause Labels (only for "Professional Services" business unit)
  const postCreateClauseActions: IClauseMutationAction[] = [];

  const clausePropertyEditActions = [
    {
      actionType: ClauseMutationActionType.UpdateProperties,
      actionArgument: {
        clauseId: clauseInfo.clause?.id,
        clauseProperties: {
          id: clauseInfo.clause?.id,
          name: propertiesForm?.properties.name?.trim(),
          category: propertiesForm?.properties.category as ClauseCategory,
          etag: clauseInfo.clause?.etag,
        },
        revisionProperties: {
          id: clauseInfo.currentRevision?.id,
          name: propertiesForm?.revisionProperties.name?.trim(),
          displayOption: propertiesForm?.revisionProperties
            .displayOption as ClauseDisplayOption,
          effectiveDate: clauseInfo.currentRevision?.effectiveDate,
          status: clauseInfo.currentRevision?.status,
          etag: clauseInfo.currentRevision?.etag,
        },
      } as IClausePropertiesUpdateInfo,
    },
  ];

  // "PS Category" clause labels are only used by "Professional Services" business unit
  const { isProfessionalServices } = useBusinessUnit();
  const isBusinessUnitPS = isProfessionalServices();

  if (isBusinessUnitPS) {
    const savedLabels = clauseInfo.psCategoryLabelInfo?.clauseLabels;
    const formLabels =
      propertiesForm?.properties.psCategoryLabelInfo?.clauseLabels;

    if (formLabels && formLabels.length > 0) {
      postCreateClauseActions.push({
        actionType: ClauseMutationActionType.UpdateLabels,
        actionArgument: {
          clauseId: "",
          deletedLabels: [],
          addedLabels: formLabels,
        } as IUpdateClauseLabelsRequest,
      });
    }

    if (
      savedLabels &&
      formLabels &&
      !areClauseLabelsEqual(savedLabels, formLabels)
    ) {
      const { deleted: deletedLabels, added: addedLabels } = diffClauseLabels(
        savedLabels,
        formLabels
      );

      clausePropertyEditActions.push({
        actionType: ClauseMutationActionType.UpdateLabels,
        actionArgument: {
          clauseId: clauseInfo.clause?.id || "",
          deletedLabels,
          addedLabels,
        } as IUpdateClauseLabelsRequest | any,
      });
    }
  }

  const deleteTranslationsAction = {
    actionType: ClauseMutationActionType.DeleteTranslations,
    actionArgument: {
      clauseId: clauseInfo.clause?.id,
      revisionId: clauseInfo.currentRevision?.id,
      languageLocales: translationsForm?.removedTranslations,
    },
  };

  const translationsToCopy = getTranslationsToCopy(translationsForm);

  const copyTranslationsAction = {
    actionType: ClauseMutationActionType.CopyTranslations,
    actionArgument: {
      clauseId: clauseInfo.clause?.id,
      sourceRevisionId: clauseInfo.currentRevision?.id,
      targetRevisionId: "",
      languageLocales: translationsToCopy,
    },
  };

  const uploadTranslationsAction = {
    actionType: ClauseMutationActionType.UploadTranslations,
    actionArgument: {
      clauseId: clauseInfo.clause?.id,
      revisionId: clauseInfo.currentRevision?.id,
      translationInfo: translationsForm?.uploadedTranslations,
    },
  };

  const editStateActionMappings: {
    [key in Exclude<
      AgreementObjectEditState,
      AgreementObjectEditState.NewTemplate
    >]: () => IClauseMutationAction[];
  } = {
    [AgreementObjectEditState.Default]: () => {
      const mutationActions: IClauseMutationAction[] = [];

      if (propertiesForm?.hasChanges) {
        mutationActions.push(...clausePropertyEditActions);
      }

      if (translationsForm?.hasChanges) {
        if (translationsForm.removedTranslations.length > 0) {
          mutationActions.push(deleteTranslationsAction);
        }
        if (translationsForm.uploadedTranslations.length > 0) {
          mutationActions.push(uploadTranslationsAction);
        }
      }

      return mutationActions;
    },
    // eslint-disable-next-line arrow-body-style
    [AgreementObjectEditState.NewClause]: () => {
      const mutationActions: IClauseMutationAction[] = [
        {
          actionType: ClauseMutationActionType.CreateClause,
          actionArgument: {
            clauseProperties: propertiesForm!.properties,
            revisionProperties: propertiesForm!.revisionProperties,
          },
        },
      ];

      if (postCreateClauseActions.length > 0) {
        mutationActions.push(...postCreateClauseActions);
      }

      return mutationActions;
    },
    [AgreementObjectEditState.NewRevision]: () => {
      const mutationActions: IClauseMutationAction[] = [
        {
          actionType: ClauseMutationActionType.CreateRevision,
          actionArgument: {
            clauseId: clauseInfo.clause!.id,
            revisionProperties: propertiesForm!.revisionProperties,
          },
        },
      ];

      if (propertiesForm?.hasChanges) {
        mutationActions.push(...clausePropertyEditActions);
      }

      /*
        Copy translations from the current revision when creating a new revision.
        Existing translations selected for deletion are not copied - no separate API call to delete translations.
        Send a separate API call to upload new translations.
      */
      if (translationsForm) {
        if (translationsToCopy.length > 0) {
          mutationActions.push(copyTranslationsAction);
        }

        if (
          translationsForm.hasChanges &&
          translationsForm.uploadedTranslations.length > 0
        ) {
          uploadTranslationsAction.actionArgument.revisionId = "";
          mutationActions.push(uploadTranslationsAction);
        }
      }

      return mutationActions;
    },
  };

  const triggerMutation = (editState: AgreementObjectEditState) => {
    const editStateToUse = editState as Exclude<
      AgreementObjectEditState,
      AgreementObjectEditState.NewTemplate
    >;
    const mutationActions = editStateActionMappings[editStateToUse]();
    setMutationActions(mutationActions);
  };

  return { triggerMutation };
};

export default useClauseMutationActionTrigger;
