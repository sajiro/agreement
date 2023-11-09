import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

export enum TemplateEditPanelType {
  AddClause = "AddClause",
  EditConstraints = "EditConstraints",
  Clause = "Clause",
  Preview = "Preview"
}

type Slice = { openedPanel: TemplateEditPanelType|undefined; };
const initialState: Slice = { openedPanel: undefined };

/* eslint no-param-reassign: "error" */
export const templateEditPanelManagementSlice = createSlice({
  name: "templateEditPanelManagement",
  initialState,
  reducers: {
    openPanel: (state: WritableDraft<Slice>, action: PayloadAction<TemplateEditPanelType>) => {
      state.openedPanel = action.payload;
    },
    closePanel: (state: WritableDraft<Slice>) => {
      state.openedPanel = undefined;
    }
  }
});

export const templateEditPanelManagementActions = templateEditPanelManagementSlice.actions;