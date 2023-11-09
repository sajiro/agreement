import { useDispatch } from "react-redux";

import {
  AgreementObjectEditState,
  IAgreementObjectId,
} from "models/agreements";
import { PanelType, IPanelInfo } from "models/panel";
import { clausePanelFormsActions } from "store/clausePanelFormsSlice";
import { customClausePanelFormsActions } from "store/customClausePanelFormsSlice";
import { panelMessagesActions } from "store/panelMessagesSlice";
import { panelActions } from "store/panelSlice";
import { useTrackingContext } from "components/shared/TrackingContext";
import { useCallback } from "react";

const usePanel = (type: PanelType) => {
  const dispatch = useDispatch();
  const { trackEvent } = useTrackingContext();

  const clearPanel = useCallback(() => {
    if (type === PanelType.Clause) {
      dispatch(clausePanelFormsActions.clear());     
    } 
    else if (type === PanelType.CustomClause) {
      dispatch(customClausePanelFormsActions.clear());
    }

    dispatch(panelMessagesActions.clear());
  }, [dispatch]);

  const updatePanel = useCallback((panelInfo: IPanelInfo) => {
    dispatch(
      panelActions.setPanel({
        panelType: type,
        agreementObjectIds: panelInfo.agreementObjectIds,
        additionalInfo: { 
          clauseEditState: panelInfo.editState,
          preselectedPivot: panelInfo.preselectedPivot,
        },
      })
    );
  }, [dispatch]);

  const openPanel = useCallback((
    agreementObjectIds: IAgreementObjectId,
    editState?: AgreementObjectEditState,
    preselectedPivot?: string,
  ) => {
    clearPanel();
     trackEvent(`${type} ${editState || 'edit '} panel opens`)
    const panelInfo = {
      isPanelOpen: true,
      agreementObjectIds,
      editState: editState || AgreementObjectEditState.Default,
      preselectedPivot,
    };
    updatePanel(panelInfo);
  }, [clearPanel, updatePanel, trackEvent]);

  const closePanel = useCallback(() => {
    clearPanel();
    dispatch(panelActions.closePanel());
  }, [clearPanel, dispatch]);

  return {
    clearPanel,
    updatePanel,
    openPanel,
    closePanel,
  };
};

export default usePanel;
