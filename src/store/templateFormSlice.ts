import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import {
  ITemplateFormsInfo,
  ITemplateFormInitializationInfo,
  IModifiableTemplateProperties,
} from "models/templatePanel";
import { ITag } from "@fluentui/react/lib/Pickers";

const properties: IModifiableTemplateProperties = {
  name: "template",
  revision: "template revision",
  description: "template description",
  tags: [],
};
const initialState: ITemplateFormsInfo = {
  templateId: undefined,
  revisionId: undefined,
  propertiesForm: properties,
  isSubmitting: false,
};
/* eslint no-param-reassign: "error" */
export const templateFormsSlice = createSlice({
  name: "templateForms",
  initialState,
  reducers: {
    initializeForm(
      state: WritableDraft<ITemplateFormsInfo>,
      action: PayloadAction<ITemplateFormInitializationInfo>
    ) {
      const { templateInfo } = action.payload;
      state.propertiesForm = {
        name: templateInfo?.template?.name,
        revision: templateInfo?.currentRevision?.name,
        description: templateInfo?.template?.description,
      };
    },
    updatePropertiesFormValue(
      state: WritableDraft<ITemplateFormsInfo>,
      action: PayloadAction<IModifiableTemplateProperties>
    ) {
      const { name, revision, description, tags } = {
        ...state.propertiesForm,
        ...action.payload,
      };
      state.propertiesForm = { name, revision, description, tags };
    },
    getSaveTags(
      state: WritableDraft<ITemplateFormsInfo>,
      action: PayloadAction<ITag[] | undefined>
    ) {
      if (action.payload !== undefined) {
        const tags = [...action.payload];
        const {
          name,
          revision,
          description,
          tags: tagsArray,
        } = { ...state.propertiesForm, tags };
        state.propertiesForm = { name, revision, description, tags: tagsArray };
      }
    },

    setSubmissionState(
      state: WritableDraft<ITemplateFormsInfo>,
      action: PayloadAction<boolean>
    ) {
      state.isSubmitting = action.payload;
    },
    clear(state: WritableDraft<ITemplateFormsInfo>) {
      state.propertiesForm = undefined;
      state.isSubmitting = false;
    },
  },
});

export const templateFormsActions = templateFormsSlice.actions;
