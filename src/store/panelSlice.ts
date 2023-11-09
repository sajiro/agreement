import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { IPanel, IPanelSlice } from "models/panel";

const initialState: IPanelSlice = { panelType: undefined, agreementObjectIds: {}, additionalInfo: {}, persistentInfo: {} };
/* eslint no-param-reassign: "error" */
export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    setPanel(state: WritableDraft<IPanelSlice>, action: PayloadAction<IPanel>) {
      return { ...state, ...action.payload };
    },
    updateCache(state: WritableDraft<IPanelSlice>, action: PayloadAction<{key: string; value: any; }>) {
      state.persistentInfo[action.payload.key] = action.payload.value;
    },
    closePanel(state: WritableDraft<IPanelSlice>) {
      state.panelType = undefined;
    }
  }
});

export const panelActions = panelSlice.actions;