import { FontIcon, mergeStyles, PrimaryButton } from "@fluentui/react";
import PanelActions, {
  commitButtonStyle,
} from "components/shared/panel/PanelActions";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";
import { ISlotConstraint, ITemplateRevisionSlot } from "models/slot";
import { useTemplateStructureEditor } from "../../../hooks/template/mutation/useTemplateStructureEditor";

type ClausePanelActionsProps = {
  slot: ITemplateRevisionSlot | undefined;
  constraints: ISlotConstraint[];
  onClosePanel: () => void;
  disabled?: boolean;
  noValues?: boolean;
};

const noSlotsClass = mergeStyles({
  display: "flex",
  /* paddingBottom: 12, */
  // height: "calc(100vh - 214px)",
  ".iconInfo": {
    fontSize: 16,
    color: customTheme.errorColor,
    marginTop: 3,
    marginLeft: 20,
  },
  ".infoText": {
    margin: "0 0 0 10px",
  },
});

const noValue = mergeStyles({
  display: "flex",
  alignItems: "center",
});

function ConstraintEditPanelActions({
  onClosePanel,
  slot,
  constraints,
  disabled = true,
  noValues = false,
}: ClausePanelActionsProps) {
  const { updateSlotConstraints } = useTemplateStructureEditor(onClosePanel);

  return (
    <PanelActions>
      <div className={noValue}>
        <PrimaryButton
          data-automation-id="constraint-edit-panel-action-apply-button"
          text="Apply"
          style={commitButtonStyle}
          onClick={() => {
            updateSlotConstraints(slot!, constraints);
          }}
          disabled={disabled}
        />
        {noValues && (
          <div className={noSlotsClass}>
            <FontIcon iconName="ErrorBadge" className="iconInfo" />
            <p className="infoText">
              {stringsConst.templateEdit.AddClausePanel.noValue}
            </p>
          </div>
        )}
      </div>
    </PanelActions>
  );
}

export default ConstraintEditPanelActions;
