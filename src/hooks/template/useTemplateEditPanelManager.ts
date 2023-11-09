import { useTrackingContext } from "components/shared/TrackingContext";
import useClausePanel from "hooks/clause/useClausePanel";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { templateEditPanelManagementActions, TemplateEditPanelType } from "store/templateEditPanelManagementSlice";

const useTemplateEditPanelManager = () => {
  const dispatch = useDispatch();
  const { trackEvent } = useTrackingContext();
  const { openClausePanelAtMostRecentPublishedRevision } = useClausePanel();
  const { openedPanel } = useSelector((state: RootState) => state.templateEditPanelManagement);

  const openPanel = useCallback((panelType: TemplateEditPanelType) => {
    dispatch(templateEditPanelManagementActions.openPanel(panelType));
  }, [dispatch]);

  const closePanel = useCallback(() => {
    dispatch(templateEditPanelManagementActions.closePanel());
  }, [dispatch]);

  const openClausePanelWrapper = useCallback((clauseId: string) => {
    openClausePanelAtMostRecentPublishedRevision(clauseId);
    trackEvent("Clause panel opens from template edit");
  }, [openClausePanelAtMostRecentPublishedRevision]);

  return { openedPanel, openPanel, closePanel, openClausePanel: openClausePanelWrapper };
};

export default useTemplateEditPanelManager;