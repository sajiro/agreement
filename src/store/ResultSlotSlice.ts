import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { ITemplateRevisionSlotItem } from "models/slot";

type Slice = {
  previewSlots?: ITemplateRevisionSlotItem[];
  isTriggered?: boolean;
  toggle?: boolean;
};

const initialState: Slice = {
  previewSlots: [],
  isTriggered: false,
  toggle: false,
};
export const resultSlotSlice = createSlice({
  name: "resultSlotSlice",
  initialState,
  reducers: {
    setPreviewSlots(state: WritableDraft<Slice>, action: PayloadAction<Slice>) {
      const { previewSlots } = action.payload;
      const tmpState = state;
      tmpState.previewSlots = previewSlots;
    },
    setTriggered(state: WritableDraft<Slice>, action: PayloadAction<Slice>) {
      const { isTriggered } = action.payload;
      const tmpState = state;
      tmpState.isTriggered = isTriggered;
    },
    setShowTestClauses(
      state: WritableDraft<Slice>,
      action: PayloadAction<Slice>
    ) {
      const { toggle } = action.payload;
      const tmpState = state;
      tmpState.toggle = toggle;
    },
  },
});

export const resultSlotActions = resultSlotSlice.actions;
