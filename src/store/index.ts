import {
  configureStore,
  Middleware,
  MiddlewareAPI,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { clauseApi } from "services/clause";
import { clauseLabelApi } from "services/clauseLabel";
import { customClauseApi } from "services/customClause";
import { constraintApi } from "services/constraint";
import { templateApi } from "services/template";
import { tagsApi } from "services/tags";
import { clausePanelFormsSlice } from "store/clausePanelFormsSlice";
import { customClausePanelFormsSlice } from "store/customClausePanelFormsSlice";
import { dialogSlice, dialogActions } from "store/dialogSlice";
import { panelSlice } from "store/panelSlice";
import { panelMessagesSlice } from "store/panelMessagesSlice";
import { contentPlaceholdersSlice } from "store/contentPlaceholdersSlice";
import { slotApi } from "services/slot";
import { previewApi } from "services/preview";
import { ccfBusinessGroupApi } from "services/businessUnit";
import { businessUnitSlice } from "store/businessUnitSlice";
import { DialogContentType } from "models/dialogs";
import icons from "components/shared/Icons";
import stringsConst from "consts/strings";
import { templateFormsSlice } from "./templateFormSlice";
import { templateEditPanelManagementSlice } from "./templateEditPanelManagementSlice";
import { templateEditPreviewSlice } from "./templateEditPreviewSlice";
import { templateEditSlice } from "./TemplateEditSlice";
import { previewResultSlice } from "./PreviewResultSlice";
import { resultSlotSlice } from "./ResultSlotSlice";

const rtkQueryErrorLogger: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      const statusCode = action.payload.status as number;

      if (statusCode === 405) {
        api.dispatch(
          dialogActions.setDialog({
            isDialogOpen: true,
            title: stringsConst.dialogs.Error405.title,
            titleIcon: icons.error.iconName,
            titleIconColor: icons.error.color,
            type: DialogContentType.error405,
          })
        );
      }

      if (statusCode === 412) {
        api.dispatch(
          dialogActions.setDialog({
            isDialogOpen: true,
            title: stringsConst.dialogs.Error412.title,
            titleIcon: icons.error.iconName,
            titleIconColor: icons.error.color,
            type: DialogContentType.error412,
          })
        );
      }

      if (statusCode === 403) {
        api.dispatch(
          dialogActions.setDialog({
            isDialogOpen: true,
            title: stringsConst.dialogs.Error403.title,
            titleIcon: icons.error.iconName,
            titleIconColor: icons.error.color,
            type: DialogContentType.messageDialog,
            additionalInfo: {
              message: stringsConst.dialogs.Error403.message,
            },
          })
        );
      }

      if (statusCode >= 500 && statusCode <= 599) {
        api.dispatch(
          dialogActions.setDialog({
            isDialogOpen: true,
            title: "Server Error",
            titleIcon: icons.error.iconName,
            titleIconColor: icons.error.color,
            type: DialogContentType.messageDialog,
            additionalInfo: {
              message: "Unexpected server error occurred",
            },
          })
        );
      }
    }

    return next(action);
  };

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
    [contentPlaceholdersSlice.name]: contentPlaceholdersSlice.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [templateFormsSlice.name]: templateFormsSlice.reducer,
    [previewApi.reducerPath]: previewApi.reducer,
    [templateEditPreviewSlice.name]: templateEditPreviewSlice.reducer,
    [ccfBusinessGroupApi.reducerPath]: ccfBusinessGroupApi.reducer,
    [businessUnitSlice.name]: businessUnitSlice.reducer,
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
      .concat(customClauseApi.middleware)
      .concat(constraintApi.middleware)
      .concat(templateApi.middleware)
      .concat(slotApi.middleware)
      .concat(tagsApi.middleware)
      .concat(previewApi.middleware)
      .concat(ccfBusinessGroupApi.middleware)
      .concat(rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
