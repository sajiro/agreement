import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

const initialState: string = "";

export const businessUnitSlice = createSlice({
  name: "businessUnit",
  initialState,
  reducers: {
    setBusinessUnit(
      _state: WritableDraft<string>,
      action: PayloadAction<string>
    ) {
      return action.payload;
    },
  },
});

export const businessUnitActions = businessUnitSlice.actions;
