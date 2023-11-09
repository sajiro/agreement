import { Panel, PanelType as FluentPanelType } from "@fluentui/react";
import PanelHeader from "components/shared/panel/PanelHeader";
import useConstraintEditor from "hooks/constraint/edit/useConstraintEditor";
import useConstraintInfoProvider from "hooks/constraint/useConstraintInfoProvider";
import useConstraintPanel from "hooks/constraint/useConstraintPanel";
import { ConstraintEditState } from "models/constraints";
import { IPanelProps, PanelType } from "models/panel";
import {
  getConstraintPanelInfo,
  isValidAndHasChanges,
} from "helpers/constraint";
import useConstraintDialog from "hooks/constraint/useConstraintDialog";
import { useCallback } from "react";
import stringsConst from "consts/strings";
import ConstraintActions from "./ConstraintActions";
import ConstraintEditTracker from "./ConstraintEditTracker";
import ConstraintEditor from "./ConstraintEditor";

function ConstraintPanel({
  panelInfo,
  isBlocking,
  persistentInfo,
}: IPanelProps) {
  const constraintPanelInfo = getConstraintPanelInfo({
    ...panelInfo,
    persistentInfo,
  });
  const isPanelOpen =
    panelInfo.panelType === PanelType.Constraint &&
    constraintPanelInfo.authoringInfoShown;
  const { closePanel } = useConstraintPanel();
  const { openUnsavedChangesDialog } = useConstraintDialog();
  const constraintInfo = useConstraintInfoProvider(
    constraintPanelInfo.constraintId
  );
  const constraintEditor = useConstraintEditor(
    constraintInfo,
    isPanelOpen,
    constraintPanelInfo.editState
  );
  const isNewConstraint =
    constraintPanelInfo.editState === ConstraintEditState.New;
  const title = isNewConstraint
    ? stringsConst.constraintPanel.ConstraintPanel.newConstraint
    : (constraintInfo.constraint?.display || constraintInfo.constraint?.name);

  const {
    constraintInfoEditor,
    constraintValuesEditor,
    isLoading,
    constraintEditTracker,
  } = constraintEditor;
  const { constraintInfo: mutableConstraintInfo } = constraintInfoEditor;
  const { newConstraintValues, removableConstraintValues } =
    constraintValuesEditor;
  const removedConstraintValues = removableConstraintValues.filter(
    (v) => v.isDeleted
  );

  const onClosePanel = (ignoreUnsavedChanges: boolean) => {
    const { editsMade } = isValidAndHasChanges(
      mutableConstraintInfo,
      newConstraintValues,
      removedConstraintValues,
      isNewConstraint
    );
    if (editsMade && !ignoreUnsavedChanges) {
      openUnsavedChangesDialog();
      return;
    }

    closePanel();
  };

  const ConstraintPanelHeader = useCallback(
    () => <PanelHeader title={title} onClosePanel={onClosePanel} />,
    [title, onClosePanel]
  );

  const ConstraintPanelFooter = useCallback(() => {
    if (isLoading) {
      return null;
    }

    return (
      <ConstraintActions
        constraintId={constraintPanelInfo.constraintId}
        constraintInfo={mutableConstraintInfo}
        newConstraintValues={newConstraintValues}
        removedConstraintValues={removedConstraintValues}
        onClosePanel={onClosePanel}
        isNewConstraint={isNewConstraint}
        isSubmitting={constraintEditTracker.isSubmitting}
      />
    );
  }, [
    isLoading,
    constraintPanelInfo.constraintId,
    mutableConstraintInfo,
    newConstraintValues,
    removedConstraintValues,
    onClosePanel,
    isNewConstraint,
    constraintEditTracker.isSubmitting,
  ]);

  return (
    <ConstraintEditTracker errorTracker={constraintEditTracker}>
      <Panel
        hasCloseButton={false}
        isFooterAtBottom
        type={FluentPanelType.custom}
        customWidth="450px"
        isOpen={isPanelOpen}
        closeButtonAriaLabel={stringsConst.common.closeButtonAriaLabel}
        isBlocking={isBlocking}
        onRenderHeader={ConstraintPanelHeader}
        onRenderFooter={ConstraintPanelFooter}
      >
        {!isLoading && (
          <ConstraintEditor
            constraintInfoEditor={constraintInfoEditor}
            constraintValuesEditor={constraintValuesEditor}
            isNewConstraint={isNewConstraint}
            isSubmitting={constraintEditTracker.isSubmitting}
          />
        )}
      </Panel>
    </ConstraintEditTracker>
  );
}

export default ConstraintPanel;
