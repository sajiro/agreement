import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { DialogContentType, IDialog } from "models/dialogs";

const initialState: IDialog = {
  isDialogOpen: false,
  isProceeding: false,
  title: "",
  type: DialogContentType.Copy
};
/* eslint no-param-reassign: "error" */
export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setDialog(state: WritableDraft<IDialog>, action: PayloadAction<IDialog>) {
      state.isDialogOpen = action.payload.isDialogOpen;
      state.isProceeding = false;

      state.type = action.payload.type;
      state.title = action.payload.title;
      state.titleIcon = action.payload.titleIcon;
      state.titleIconColor = action.payload.titleIconColor;
      state.additionalInfo = action.payload.additionalInfo;
    },
    startProceeding(state: WritableDraft<IDialog>) {
      state.isProceeding = true;
    },
    endProceeding(state: WritableDraft<IDialog>) {
      state.isProceeding = false;
    },
    closeDialog(state: WritableDraft<IDialog>) {
      state.isDialogOpen = false;
      state.isProceeding = false;
    }
  }
});

export const dialogActions = dialogSlice.actions;
