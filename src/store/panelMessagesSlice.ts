import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { IPanelMessageSlice } from "models/panelMessage";

const initialState: IPanelMessageSlice = {};
export const panelMessagesSlice = createSlice({
  name: "panelMessages",
  initialState,
  reducers: {
    setMessage(_state: WritableDraft<IPanelMessageSlice>, action: PayloadAction<IPanelMessageSlice>) {
      return action.payload;
    },
    clear() {
      return {};
    }
  }
});

export const panelMessagesActions = panelMessagesSlice.actions;