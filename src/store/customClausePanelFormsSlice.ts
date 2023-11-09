import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getDefaultPropertiesForm,
  getUpToDatePropertiesForm,
} from "helpers/customClauseForms";
import {
  clearUnneededTranslations,
  getDefaultTranslationsForm,
  getTranslationLanguageFromFileName,
  getUpToDateTranslationsForm,
  translationFormHasChanges,
} from "helpers/translations";
import { WritableDraft } from "immer/dist/internal";
import { AgreementObjectEditState } from "models/agreements";
import {
  ICustomClauseFormInitializationInfo,
  ICustomClauseFormsInfo,
  ICustomClausePropertiesFormUpdatePayload,
} from "models/customClausePanel";
import { IUploadedTranslation } from "models/translations";

const initialState: ICustomClauseFormsInfo = {
  templateId: undefined,
  clauseId: undefined,
  revisionId: undefined,
  propertiesForm: undefined,
  translationsForm: undefined,
  isSubmitting: false,
  hasSubmitted: false,
};

/* eslint no-param-reassign: "error" */
export const customClausePanelFormsSlice = createSlice({
  name: "customClausePanelForms",
  initialState,
  reducers: {
    initializeForm(
      state: WritableDraft<ICustomClauseFormsInfo>,
      action: PayloadAction<ICustomClauseFormInitializationInfo>
    ) {
      const { clauseInfo, contentInfo } = action.payload;

      const newClauseId = clauseInfo.clause!.id;
      const newRevisionId = clauseInfo.currentRevision?.id;
      const newTemplateId = clauseInfo.clause!.templateId;

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
      state.templateId = newTemplateId;

      state.propertiesForm = requiresDefaultProperties
        ? getDefaultPropertiesForm(clauseInfo)
        : getUpToDatePropertiesForm(clauseInfo, state.propertiesForm!);

      state.translationsForm = requiresDefaultTranslations
        ? getDefaultTranslationsForm(contentInfo)
        : getUpToDateTranslationsForm(contentInfo, state.translationsForm!);
    },
    updatePropertiesFormValue(
      state: WritableDraft<ICustomClauseFormsInfo>,
      action: PayloadAction<ICustomClausePropertiesFormUpdatePayload>
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
    updateUploadedTranslations(
      state: WritableDraft<ICustomClauseFormsInfo>,
      action: PayloadAction<IUploadedTranslation[]>
    ) {
      clearUnneededTranslations(
        state.translationsForm!.uploadedTranslations,
        action.payload
      );
      state.translationsForm!.uploadedTranslations = action.payload;
      state.translationsForm!.hasChanges = translationFormHasChanges(
        state.translationsForm!.uploadedTranslations,
        state.translationsForm!.removedTranslations
      );
    },
    updateSuccessfullyUploadedTranslations(
      state: WritableDraft<ICustomClauseFormsInfo>,
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

      state.translationsForm!.successfullyUploadedTranslations = action.payload;
      state.translationsForm!.uploadedTranslations = uploadedTranslations;
    },
    setSubmissionState(
      state: WritableDraft<ICustomClauseFormsInfo>,
      action: PayloadAction<{ isSubmitting: boolean; hasSubmitted: boolean }>
    ) {
      state.isSubmitting = action.payload.isSubmitting;
      state.hasSubmitted = action.payload.hasSubmitted;
    },
    clear(state: WritableDraft<ICustomClauseFormsInfo>) {
      if (state.translationsForm) {
        clearUnneededTranslations(
          state.translationsForm.uploadedTranslations,
          []
        );
      }

      state.propertiesForm = undefined;
      state.translationsForm = undefined;
      state.isSubmitting = false;
    },
  },
});

export const customClausePanelFormsActions =
  customClausePanelFormsSlice.actions;
