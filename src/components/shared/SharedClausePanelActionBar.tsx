import { ClauseActionBarShimmer } from "components/loadingSkeletons/ClauseLoadingSkeletons";
import usePanel from "hooks/usePanel";
import useSharedClausePanelController from "hooks/useSharedClausePanelController";
import { AgreementObjectType } from "models/agreements";
import { IClausePanelInfo } from "models/clausePanel";
import { IProvisionedClauseInfo } from "models/clauses";
import { ICustomClausePanelInfo } from "models/customClausePanel";
import { IProvisionedCustomClauseInfo } from "models/customClauses";
import { PanelType } from "models/panel";
import { SharedActionBarWithLoading } from "./SharedActionBar";

type SharedClausePanelActionBarProps = {
  isLoadingClause: boolean;
  isCustomClause: boolean;
  agreementObjectType: AgreementObjectType;
  clauseInfoProvider: IProvisionedClauseInfo | IProvisionedCustomClauseInfo;
  panelInfo: IClausePanelInfo | ICustomClausePanelInfo;
};

function SharedClausePanelActionBar({
  isLoadingClause,
  isCustomClause,
  agreementObjectType,
  clauseInfoProvider,
  panelInfo,
}: SharedClausePanelActionBarProps) {
  const { openPanel: openEditPanel } = usePanel(
    isCustomClause ? PanelType.CustomClause : PanelType.Clause
  );
  const { setCurrentRevision } = useSharedClausePanelController(
    isCustomClause,
    clauseInfoProvider,
    panelInfo
  );

  return (
    <SharedActionBarWithLoading
      LoadingSubstitute={ClauseActionBarShimmer}
      isLoading={isLoadingClause}
      objectType={agreementObjectType}
      objectInfo={clauseInfoProvider.clauseInfo}
      objectContentInfo={clauseInfoProvider.clauseContentInfo}
      openEditPanel={openEditPanel}
      setCurrentRevision={setCurrentRevision}
      editState={panelInfo.editState}
      componentInfo="TemplateEdit"
    />
  );
}

export default SharedClausePanelActionBar;
