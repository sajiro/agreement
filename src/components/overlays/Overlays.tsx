import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

import ClausePanel from "components/clausePanel/ClausePanel";
import CustomClausePanel from "components/customClausePanel/CustomClausePanel";
import ConstraintPanel from "components/constraintPanel/ConstraintPanel";
import ConstraintAuthoringInfoPanel from "components/constraintPanel/ConstraintAuthoringInfoPanel";
import TemplatePanel from "components/templatePanel/TemplatePanel";
import DialogComponent from "components/shared/dialogs/Dialog";

// eslint-disable-next-line
const Overlays = () => {
  const dialog = useSelector((state: RootState) => state.dialog);
  const panel = useSelector((state: RootState) => state.panel);
  const [isPanelBlocking, setIsPanelBlocking] = useState(true);

  useEffect(() => {
    const panelBlocking = !dialog.isDialogOpen;
    setIsPanelBlocking(panelBlocking);
  }, [dialog.isDialogOpen]);

  return (
    <>
      {panel.panelType! === "Clause" ? (
        <ClausePanel
          panelInfo={panel}
          isBlocking={isPanelBlocking}
          persistentInfo={panel.persistentInfo}
        />
      ) : null}

      {panel.panelType! === "CustomClause" ? (
        <CustomClausePanel
          panelInfo={panel}
          isBlocking={isPanelBlocking}
          persistentInfo={panel.persistentInfo}
        />
      ) : null}

      {panel.panelType! === "Constraint" ? (
        <ConstraintPanel
          panelInfo={panel}
          isBlocking={isPanelBlocking}
          persistentInfo={panel.persistentInfo}
        />
      ) : null}

      {panel.panelType! === "Constraint" ? (
        <ConstraintAuthoringInfoPanel
          panelInfo={panel}
          isBlocking={isPanelBlocking}
          persistentInfo={panel.persistentInfo}
        />
      ) : null}

      {panel.panelType! === "Template" ? (
        <TemplatePanel
          panelInfo={panel}
          isBlocking={isPanelBlocking}
          persistentInfo={panel.persistentInfo}
        />
      ) : null}

      <DialogComponent />
    </>
  );
};

export default Overlays;
