import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { ItemplatePreviewConfig } from "models/templateMutation";

const initDate = new Date();
const initialState: ItemplatePreviewConfig = {
  languagelocale: "en-us",
  asofdate: initDate.toISOString(),
  context: {},
  IncludeTestRevision: false,
};

export const templateEditPreviewSlice = createSlice({
  name: "templateEditPreview",
  initialState,
  reducers: {
    setPreviewConfig(
      state: WritableDraft<ItemplatePreviewConfig>,
      action: PayloadAction<ItemplatePreviewConfig>
    ) {
      return { ...state, ...action.payload };
    },
  },
});

export const templateEditPreviewActions = templateEditPreviewSlice.actions;
