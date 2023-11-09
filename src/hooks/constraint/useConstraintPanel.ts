import { ConstraintEditState } from "models/constraints";
import { PanelType } from "models/panel";
import { useDispatch } from "react-redux";
import { panelActions } from "store/panelSlice";

const useConstraintPanel = () => {
  const dispatch = useDispatch();

  const openPanel = (constraintId: string|undefined, editState: ConstraintEditState) => {
    dispatch(panelActions.setPanel({
      panelType: PanelType.Constraint,
      agreementObjectIds: { constraintId },
      additionalInfo: { constraintEditState: editState }
    }));
  };

  const closePanel = () => {
    dispatch(panelActions.closePanel());
  };

  return { openPanel, closePanel };
};

export default useConstraintPanel;