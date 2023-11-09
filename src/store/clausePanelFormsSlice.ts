import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  areClauseLabelsEqual,
  getDefaultPropertiesForm,
  getUpToDatePropertiesForm,
} from "helpers/clauseForms";
import {
  clearUnneededTranslations,
  getDefaultTranslationsForm,
  getTranslationLanguageFromFileName,
  getUpToDateTranslationsForm,
  translationFormHasChanges,
} from "helpers/translations";
import { WritableDraft } from "immer/dist/internal";
import { AgreementObjectEditState } from "models/agreements";
import { ILabelData } from "models/clauseLabels";
import {
  IClauseFormInitializationInfo,
  IClauseFormsInfo,
  IClausePropertiesFormUpdatePayload,
} from "models/clausePanel";
import {
  IClauseTranslationsForm,
  IUploadedTranslation,
} from "models/translations";

// if some translation(s) are successfully deleted then uploaded again,
// remove them from translationsForm.successfullyRemovedTranslations
const handleUploadAfterDelete = (
  translationsForm: IClauseTranslationsForm,
  successfullyUploadedTranslations: string[]
) => {
  translationsForm.successfullyRemovedTranslations =
    translationsForm.successfullyRemovedTranslations.filter(
      (t) => !successfullyUploadedTranslations.includes(t)
    );
};

const initialState: IClauseFormsInfo = {
  clauseId: undefined,
  revisionId: undefined,
  propertiesForm: undefined,
  translationsForm: undefined,
  isSubmitting: false,
  hasSubmitted: false,
};
/* eslint no-param-reassign: "error" */
export const clausePanelFormsSlice = createSlice({
  name: "clausePanelForms",
  initialState,
  reducers: {
    initializeForm(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<IClauseFormInitializationInfo>
    ) {
      const { clauseInfo, contentInfo } = action.payload;
      const newClauseId = clauseInfo.clause!.id;
      const newRevisionId = clauseInfo.currentRevision?.id;

      const isDifferentClause =
        state.clauseId !== newClauseId ||
        state.revisionId !== newRevisionId ||
        action.payload.editState !== AgreementObjectEditState.Default;
      const requiresDefaultProperties =
        !state.propertiesForm || isDifferentClause;
      const requiresDefaultTranslations =
        !state.translationsForm || isDifferentClause;

      state.hasSubmitted = false;
      state.clauseId = newClauseId;
      state.revisionId = newRevisionId;
      state.propertiesForm = requiresDefaultProperties
        ? getDefaultPropertiesForm(clauseInfo, action.payload.isBusinessUnitPS)
        : getUpToDatePropertiesForm(clauseInfo, state.propertiesForm!, action.payload.isBusinessUnitPS);
      state.translationsForm = requiresDefaultTranslations
        ? getDefaultTranslationsForm(contentInfo)
        : getUpToDateTranslationsForm(contentInfo, state.translationsForm!);
    },
    updatePropertiesFormValue(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<IClausePropertiesFormUpdatePayload>
    ) {
      const properties = {
        ...state.propertiesForm!.properties,
        ...action.payload.properties,
      };
      const revisionProperties = {
        ...state.propertiesForm!.revisionProperties,
        ...action.payload.revisionProperties,
      };
      state.propertiesForm = {
        properties,
        revisionProperties,
        isValid: action.payload.isValid,
        hasChanges: action.payload.hasChanges,
      };
    },
    updateClauseLabels(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<ILabelData[]>
    ) {
      const currentLabelInfo = state.propertiesForm?.properties.psCategoryLabelInfo;
      if (!currentLabelInfo) {
        return;
      }

      if (!areClauseLabelsEqual(currentLabelInfo.clauseLabels, action.payload)) {
        state.propertiesForm!.hasChanges = true;
        currentLabelInfo.clauseLabels = action.payload;
      }
    },
    setFormValid(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<{ isValid: boolean; }>
    ) {
      if (state.propertiesForm) {
        state.propertiesForm.isValid = action.payload.isValid;
      }
    },
    updateUploadedTranslations(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<IUploadedTranslation[]>
    ) {
      clearUnneededTranslations(
        state.translationsForm!.uploadedTranslations,
        action.payload
      );
      state.translationsForm!.uploadedTranslations = action.payload;
      const hasError = action.payload.some((item) => item.errorMessage);
      state.translationsForm!.isValid = !hasError;
      state.translationsForm!.hasChanges = translationFormHasChanges(
        state.translationsForm!.uploadedTranslations,
        state.translationsForm!.removedTranslations
      );
    },
    updateRemovedTranslations(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<string[]>
    ) {
      state.translationsForm!.removedTranslations = action.payload;
      state.translationsForm!.hasChanges = translationFormHasChanges(
        state.translationsForm!.uploadedTranslations,
        state.translationsForm!.removedTranslations
      );
    },
    updateSuccessfullyUploadedTranslations(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<string[]>
    ) {
      const isUploaded = (t: IUploadedTranslation) =>
        action.payload.includes(
          getTranslationLanguageFromFileName(t.fileName)!
        );
      const uploadedTranslations =
        state.translationsForm!.uploadedTranslations.filter(
          (t) => !isUploaded(t)
        );

      clearUnneededTranslations(
        state.translationsForm!.uploadedTranslations,
        uploadedTranslations
      );
      handleUploadAfterDelete(state.translationsForm!, action.payload);

      state.translationsForm!.successfullyUploadedTranslations = action.payload;
      state.translationsForm!.uploadedTranslations = uploadedTranslations;
    },
    updateSuccessfullyRemovedTranslations(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<string[]>
    ) {
      const isRemoved = (languageLocale: string) =>
        action.payload.includes(languageLocale);

      const removedTranslations =
        state.translationsForm!.removedTranslations.filter(
          (t) => !isRemoved(t)
        );

      state.translationsForm!.successfullyRemovedTranslations = action.payload;
      state.translationsForm!.removedTranslations = removedTranslations;
    },
    setSubmissionState(
      state: WritableDraft<IClauseFormsInfo>,
      action: PayloadAction<{ isSubmitting: boolean; hasSubmitted: boolean }>
    ) {
      state.isSubmitting = action.payload.isSubmitting;
      state.hasSubmitted = action.payload.hasSubmitted;
    },
    clear(state: WritableDraft<IClauseFormsInfo>) {
      if (state.translationsForm) {
        clearUnneededTranslations(
          state.translationsForm.uploadedTranslations,
          []
        );
      }

      state.propertiesForm = undefined;
      state.translationsForm = undefined;
      state.isSubmitting = false;
      state.hasSubmitted = false;
    },
  },
});

export const clausePanelFormsActions = clausePanelFormsSlice.actions;
