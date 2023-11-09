import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { clauseApi } from "services/clause";
import { clauseLabelApi } from "services/clauseLabel";
import { customClauseApi } from "services/customClause";
import { constraintApi } from "services/constraint";
import { templateApi } from "services/template";
import { tagsApi } from "services/tags";
import { clausePanelFormsSlice } from "store/clausePanelFormsSlice";
import { customClausePanelFormsSlice } from "store/customClausePanelFormsSlice";
import { dialogSlice } from "store/dialogSlice";
import { panelSlice } from "store/panelSlice";
import { panelMessagesSlice } from "store/panelMessagesSlice";
import { contentPlaceholdersSlice } from "store/contentPlaceholdersSlice";
import { slotApi } from "services/slot";
import { templateFormsSlice } from "store/templateFormSlice";
import { businessUnitSlice } from "store/businessUnitSlice";
import { ccfBusinessGroupApi } from "services/businessUnit";
import { previewApi } from "services/preview";
import { templateEditPreviewSlice } from "store/templateEditPreviewSlice";
import { templateEditPanelManagementSlice } from "store/templateEditPanelManagementSlice";
import { templateEditSlice } from "store/TemplateEditSlice";
import { previewResultSlice } from "store/PreviewResultSlice";
import { resultSlotSlice } from "store/ResultSlotSlice";

export const storeFactory = (initialState = {}): EnhancedStore => {
  const store = configureStore({
    reducer: {
      [panelSlice.name]: panelSlice.reducer,
      [clausePanelFormsSlice.name]: clausePanelFormsSlice.reducer,
      [customClausePanelFormsSlice.name]: customClausePanelFormsSlice.reducer,
      [panelMessagesSlice.name]: panelMessagesSlice.reducer,
      [clauseApi.reducerPath]: clauseApi.reducer,
      [clauseLabelApi.reducerPath]: clauseLabelApi.reducer,
      [customClauseApi.reducerPath]: customClauseApi.reducer,
      [constraintApi.reducerPath]: constraintApi.reducer,
      [templateApi.reducerPath]: templateApi.reducer,
      [slotApi.reducerPath]: slotApi.reducer,
      [dialogSlice.name]: dialogSlice.reducer,
      [ccfBusinessGroupApi.reducerPath]: ccfBusinessGroupApi.reducer,
      [contentPlaceholdersSlice.name]: contentPlaceholdersSlice.reducer,
      [businessUnitSlice.name]: businessUnitSlice.reducer,
      [tagsApi.reducerPath]: tagsApi.reducer,
      [templateFormsSlice.name]: templateFormsSlice.reducer,
      [previewApi.reducerPath]: previewApi.reducer,
      [templateEditPreviewSlice.name]: templateEditPreviewSlice.reducer,
      [templateEditPanelManagementSlice.name]:
        templateEditPanelManagementSlice.reducer,
      [templateEditSlice.name]: templateEditSlice.reducer,
      [previewResultSlice.name]: previewResultSlice.reducer,
      [resultSlotSlice.name]: resultSlotSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(clauseApi.middleware)
        .concat(clauseLabelApi.middleware)
        .concat(ccfBusinessGroupApi.middleware)
        .concat(customClauseApi.middleware)
        .concat(constraintApi.middleware)
        .concat(templateApi.middleware)
        .concat(slotApi.middleware)
        .concat(tagsApi.middleware),
    preloadedState: initialState,
  });

  return store;
};
