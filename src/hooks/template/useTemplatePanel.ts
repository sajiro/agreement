import { useDispatch } from "react-redux";

import { PanelType } from "models/panel";
import { ITemplatePanelInfo, TemplateEditState } from "models/templatePanel";
import { panelActions } from "store/panelSlice";
import { templateFormsActions } from "store/templateFormSlice";
import { useTrackingContext } from "components/shared/TrackingContext";

const useTemplatePanel = () => {
  const dispatch = useDispatch();
  const { trackEvent } = useTrackingContext();
  const clearPanel = () => {
    dispatch(templateFormsActions.clear());
  };

  const updatePanel = (templatePanelInfo: ITemplatePanelInfo) => {
    dispatch(
      panelActions.setPanel({
        panelType: PanelType.Template,
        agreementObjectIds: {
          templateId: templatePanelInfo.templateId,
          revisionId: templatePanelInfo.revisionId,
        },
        additionalInfo: {
          templateEditState: templatePanelInfo.editState,
        },
      })
    );
  };

  const openPanel = (
    templateId: string | undefined,
    revisionId: string | undefined,
    editState?: TemplateEditState
  ) => {
    // We need to force a clear to the template properties form for when we return from the template edit page we don't have a way to reset the redux store when returning to the layout page
    clearPanel();
    trackEvent(`Template ${editState || 'edit '} panel opens`)
    const panelInfo = {
      isPanelOpen: true,
      templateId,
      revisionId,
      editState: editState || TemplateEditState.Default,
    };
    updatePanel(panelInfo);
  };

  const closePanel = () => {
    clearPanel();

    dispatch(panelActions.closePanel());
  };

  return { 
    clearPanel,
    updatePanel, 
    openPanel, 
    closePanel 
  };
};

export default useTemplatePanel;
