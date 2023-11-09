import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { hasChangesTemplateProperties } from "helpers/templateForm";
import useAgreementObjectDialog from "hooks/useAgreementObjectDialog";
import { AgreementObjectType } from "models/agreements";
import { ITemplatePanelInfo } from "models/templatePanel";
import { IProvisionedTemplateInfo } from "models/templates";
import { RootState } from "store";
import { templateFormsActions } from "store/templateFormSlice";
import { panelMessagesActions } from "store/panelMessagesSlice";
import useTemplatePanel from "./useTemplatePanel";

const useNewTemplateInitializer = (
  templateInfoProvider: IProvisionedTemplateInfo,
  panelInfo: ITemplatePanelInfo,
  isPanelOpen: boolean
) => {
  const dispatch = useDispatch();
  const { closePanel } = useTemplatePanel();
  const { openUnsavedChangesDialog } = useAgreementObjectDialog();

  const { templateInfo } = templateInfoProvider;
  const { propertiesForm } = useSelector(
    (state: RootState) => state.templateForms
  );
  const hasUnsavedChanges = hasChangesTemplateProperties(propertiesForm);

  const unSavedChangesDialogInfo = useMemo(
    () => ({
      objectType: AgreementObjectType.template,
      id: templateInfo.template?.id || "",
      revisionId: templateInfo.currentRevision?.id || "",
    }),
    [templateInfo]
  );

  // Need separate useEffect to handle clearing panel states as other hook will get triggered by templateInfo changes
  useEffect(() => {
    if (!isPanelOpen) {
      dispatch(templateFormsActions.clear());
      dispatch(panelMessagesActions.clear());
    }
    return () => {
      dispatch(templateFormsActions.clear());
      dispatch(panelMessagesActions.clear());
    };
  }, [isPanelOpen, dispatch]);

  const onClosePanel = useCallback(
    (ignoreUnsavedChanges: boolean) => {
      if (hasUnsavedChanges && !ignoreUnsavedChanges) {
        openUnsavedChangesDialog({
          ...unSavedChangesDialogInfo,
          isRevisionChangeAction: false,
        });
        return;
      }

      closePanel();
    },
    [
      hasUnsavedChanges,
      unSavedChangesDialogInfo,
      openUnsavedChangesDialog,
      closePanel,
    ]
  );

  return { onClosePanel };
};

export default useNewTemplateInitializer;
