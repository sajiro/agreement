import useTemplateEditPanelManager from "hooks/template/useTemplateEditPanelManager";
import { TemplateEditPanelType } from "store/templateEditPanelManagementSlice";
import AddClausePanel from "../clauses/AddClausePanel";
import ConstraintEditPanel from "../constraints/ConstraintEditPanel";

function TemplateEditPanelOverlay() {
  const { openedPanel, closePanel } = useTemplateEditPanelManager();

  return (
    <>
      { openedPanel === TemplateEditPanelType.AddClause && <AddClausePanel closePanel={closePanel} /> }
      { openedPanel === TemplateEditPanelType.EditConstraints && <ConstraintEditPanel closePanel={closePanel} /> }
    </>
  );
}

export default TemplateEditPanelOverlay;