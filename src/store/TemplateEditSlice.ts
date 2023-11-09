import { MessageBarType } from "@fluentui/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

type MessageInfo = { message: string; type: MessageBarType; };
type Slice = { isLoading: boolean; isLocked: boolean; messageInfo?: MessageInfo };
const initialState: Slice = { isLoading: false, isLocked: false };
export const templateEditSlice = createSlice({
  name: "templateEdit",
  initialState,
  reducers: {
    setLockedState(state: WritableDraft<Slice>, action: PayloadAction<boolean>) {
      // eslint-disable-next-line no-param-reassign
      state.isLocked = action.payload;
    },
    setLoadingState(state: WritableDraft<Slice>, action: PayloadAction<boolean>) {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = action.payload;
    },
    setMessage(state: WritableDraft<Slice>, action: PayloadAction<MessageInfo|undefined>) {
      // eslint-disable-next-line no-param-reassign
      state.messageInfo = action.payload;
    }
  }
});

export const templateEditActions = templateEditSlice.actions;