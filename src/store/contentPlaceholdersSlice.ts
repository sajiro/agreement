import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

interface IDynamicPlaceholders {
  [k: string]: string;
}

const initialState: { [k: string]: IDynamicPlaceholders } = {};

interface IClausePlaceholderAction {
  clauseId: string;
  revisionId: string;
  id: string;
  value: string;
}

export const contentPlaceholdersSlice = createSlice({
  name: "contentPlaceholders",
  initialState,
  reducers: {
    updateRevision(
      state: WritableDraft<{ [k: string]: IDynamicPlaceholders }>,
      action: PayloadAction<IClausePlaceholderAction>
    ) {
      const { clauseId, revisionId, id, value } = action.payload;
      const clauseRevision = `${clauseId}.${revisionId}`;

      return {
        ...state,
        [`${clauseRevision}`]: {
          ...state[`${clauseRevision}`],
          [`${id}`]: value,
        },
      };
    },
  },
});

export const contentPlaceholdersActions = contentPlaceholdersSlice.actions;
