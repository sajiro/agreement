import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

interface ItemplateConstraintsSlice {
  value?: string;
  name?:string;
  id?:string;

}

const initialState: ItemplateConstraintsSlice = { value: undefined,name:undefined,id:undefined };

export const templateConstraintsSlice = createSlice({
  name: "templateConstraints",
  initialState,
  reducers: {
    constraintsValue(
      state: WritableDraft<ItemplateConstraintsSlice>,
      action: PayloadAction<ItemplateConstraintsSlice>
    ) {
      return { ...state, ...action.payload };
    }
  },
});

export const templateConstraintsActions = templateConstraintsSlice.actions;
