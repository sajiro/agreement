import { DefaultButton, PrimaryButton } from "@fluentui/react";
import PanelActions, {
  commitButtonStyle,
} from "components/shared/panel/PanelActions";
import useConstraintMutator from "hooks/constraint/mutation/useConstraintMutator";
import {
  IMutableConstraint,
  IMutableConstraintValue,
} from "models/constraintMutation";
import PanelMessenger from "components/shared/panel/PanelMessenger";
import { isValidAndHasChanges } from "helpers/constraint";
import stringsConst from "consts/strings";
import ActionWarning from "./ActionWarning";

export type ConstraintActionsProps = {
  constraintId: string | undefined;
  constraintInfo: IMutableConstraint | undefined;
  newConstraintValues: IMutableConstraintValue[];
  removedConstraintValues: IMutableConstraintValue[];
  isNewConstraint: boolean;
  isSubmitting: boolean;
  onClosePanel: (ignoreUnsavedChanges: boolean) => void;
};

function ConstraintActions({
  constraintId,
  isNewConstraint,
  isSubmitting,
  onClosePanel,
  ...editedValues
}: ConstraintActionsProps) {
  const { createNewConstraint, triggerConstraintValueMutations } =
    useConstraintMutator(constraintId);

  const commitButtonText = isNewConstraint
    ? stringsConst.common.create
    : stringsConst.common.save;
  const closeButtonText = isNewConstraint
    ? stringsConst.common.cancel
    : stringsConst.common.close;
  const buttonSectionMargin = isNewConstraint ? 20 : 0;
  const { constraintInfo, newConstraintValues, removedConstraintValues } =
    editedValues;

  const { isValid, editsMade } = isValidAndHasChanges(
    constraintInfo,
    newConstraintValues,
    removedConstraintValues,
    isNewConstraint
  );

  const onCommit = () => {
    const constraintEditInfo = {
      constraintInfo,
      newConstraintValues,
      removedConstraintValues,
    };

    if (isNewConstraint) {
      createNewConstraint(constraintEditInfo);
      return;
    }

    triggerConstraintValueMutations(constraintId!, constraintEditInfo);
  };

  return (
    <PanelActions>
      <div>
        {isNewConstraint && <ActionWarning />}
        <div
          style={{
            display: "flex",
            marginTop: buttonSectionMargin,
            alignItems: "center",
          }}
        >
          <PrimaryButton
            style={commitButtonStyle}
            text={commitButtonText}
            disabled={!isValid || !editsMade}
            onClick={onCommit}
            data-automation-id="panel-constraintsavebutton"
          />
          <DefaultButton
            data-automation-id="panel-constraintcancelButton"
            text={closeButtonText}
            onClick={() => {
              onClosePanel(true);
            }}
          />
          <PanelMessenger isSubmitting={isSubmitting} />
        </div>
      </div>
    </PanelActions>
  );
}

export default ConstraintActions;
