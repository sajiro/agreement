import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { ITemplateRevisionSlotItem } from "models/slot";

type Slice = {
  nodeWidth: number;
  isInit: boolean;
  previewSlots?: ITemplateRevisionSlotItem[];
};

const initialState: Slice = { nodeWidth: 0, isInit: false, previewSlots: [] };
export const previewResultSlice = createSlice({
  name: "previewResultSlice",
  initialState,
  reducers: {
    setPositionXState(
      state: WritableDraft<Slice>,
      action: PayloadAction<Slice>
    ) {
      const { nodeWidth, isInit } = action.payload;
      const tmpState = state;
      tmpState.nodeWidth = nodeWidth;
      tmpState.isInit = isInit;
    },

    setPreviewSlots(state: WritableDraft<Slice>, action: PayloadAction<Slice>) {
      const { previewSlots } = action.payload;
      const tmpState = state;
      tmpState.previewSlots = previewSlots;
    },
  },
});

export const previewResultActions = previewResultSlice.actions;
