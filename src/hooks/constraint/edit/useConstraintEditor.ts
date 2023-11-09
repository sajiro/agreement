import { EMPTY_CONSTRAINT, EMPTY_CONSTRAINT_VALUES } from "helpers/constraint";
import { ConstraintEditState, IConstraintInfo } from "models/constraints";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { panelMessagesActions } from "store/panelMessagesSlice";
import useConstraintEditTracker from "./useConstraintEditTracker";
import useConstraintInfoEditor from "./useConstraintInfoEditor";
import useConstraintValuesEditor from "./useConstraintValuesEditor";

const useConstraintEditor = (
  constraintInfo: IConstraintInfo,
  isPanelOpen: boolean,
  editState: ConstraintEditState
) => {
  const dispatch = useDispatch();
  const constraintEditTracker = useConstraintEditTracker();

  const { constraint, constraintValues } = constraintInfo;
  const isNewConstraint = editState === ConstraintEditState.New;
  const constraintToUse = isNewConstraint ? EMPTY_CONSTRAINT : constraint;
  const constraintValuesToUse = isNewConstraint
    ? EMPTY_CONSTRAINT_VALUES
    : constraintValues;
  const constraintInfoEditor = useConstraintInfoEditor(
    constraintToUse,
    constraintEditTracker.failedEdits
  );
  const constraintValuesEditor = useConstraintValuesEditor(
    constraintValuesToUse,
    constraintEditTracker.failedEdits
  );

  const { clear: clearEditErrors } = constraintEditTracker;
  useEffect(
    () => () => {
      clearEditErrors();
      constraintInfoEditor.clear();
      constraintValuesEditor.clear();
      dispatch(panelMessagesActions.clear());
    },
    [
      clearEditErrors,
      constraintInfoEditor.clear,
      constraintValuesEditor.clear,
      dispatch,
    ]
  );

  return {
    constraintInfoEditor,
    constraintValuesEditor,
    constraintEditTracker,
    isLoading: !constraintInfoEditor.constraintInfo,
  };
};

export default useConstraintEditor;
