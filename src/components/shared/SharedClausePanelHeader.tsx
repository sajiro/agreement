import useSharedClausePanelController from "hooks/useSharedClausePanelController";
import { IClausePanelInfo } from "models/clausePanel";
import { IProvisionedClauseInfo } from "models/clauses";
import { ICustomClausePanelInfo } from "models/customClausePanel";
import { IProvisionedCustomClauseInfo } from "models/customClauses";
import PanelHeader from "./panel/PanelHeader";

type SharedClausePanelHeaderProps = {
  title: string|undefined;
  isCustomClause: boolean;
  clauseInfoProvider: IProvisionedClauseInfo|IProvisionedCustomClauseInfo;
  panelInfo: IClausePanelInfo|ICustomClausePanelInfo;
};

function SharedClausePanelHeader({ title, isCustomClause, clauseInfoProvider, panelInfo } : SharedClausePanelHeaderProps) {
  const { onClosePanel } = useSharedClausePanelController(isCustomClause, clauseInfoProvider, panelInfo);

  return (
    <PanelHeader title={title} onClosePanel={onClosePanel} />
  );
}

export default SharedClausePanelHeader;