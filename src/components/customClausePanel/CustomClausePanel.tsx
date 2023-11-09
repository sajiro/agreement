import { Panel, PanelType as FluentPanelType } from "@fluentui/react";
import { CustomClausePivotShimmer } from "components/loadingSkeletons/CustomClauseLoadingSkeletons";
import { SharedClausePivotWithLoading } from "components/shared/SharedClausePivot";
import SharedClausePanelActions from "components/shared/SharedClausePanelActions";
import useSharedClausePanelInitializer from "hooks/useSharedClausePanelInitializer";
import useCustomClausePanelInfoProvider from "hooks/customClause/useCustomClausePanelInfoProvider";
import {
  AgreementObjectEditState,
  AgreementObjectType,
} from "models/agreements";
import { ICustomClausePanelInfo } from "models/customClausePanel";
import { IPanel, IPanelProps, PanelType } from "models/panel";
import DeleteOrphan from "components/shared/DeleteOrphan";
import { useCallback } from "react";
import SharedClausePanelHeader from "components/shared/SharedClausePanelHeader";
import SharedClausePanelActionBar from "components/shared/SharedClausePanelActionBar";
import stringsConst from "consts/strings";

const getClausePanelInfo = (panelInfo: IPanel): ICustomClausePanelInfo => ({
  editState:
    (panelInfo.additionalInfo.clauseEditState as AgreementObjectEditState) ||
    AgreementObjectEditState.Default,
  templateId: panelInfo.agreementObjectIds.templateId,
  clauseId: panelInfo.agreementObjectIds.clauseId,
  revisionId: panelInfo.agreementObjectIds.revisionId,
});

function CustomClausePanel({ panelInfo, isBlocking }: IPanelProps) {
  const clausePanelInfo = getClausePanelInfo(panelInfo);
  const isPanelOpen = panelInfo.panelType === PanelType.CustomClause;
  const clauseInfoProvider = useCustomClausePanelInfoProvider(clausePanelInfo);
  useSharedClausePanelInitializer(
    true,
    clauseInfoProvider,
    clausePanelInfo,
    isPanelOpen
  );

  const isLoadingClause =
    !clauseInfoProvider.clauseInfo.hasData ||
    !clauseInfoProvider.clauseContentInfo.hasData;

  const isNewClause =
    clausePanelInfo.editState === AgreementObjectEditState.NewClause;
  const PanelHeader = useCallback(() => {
    const title = isNewClause
      ? "Create new custom clause"
      : clauseInfoProvider.clauseInfo.clause?.name;
    return (
      <SharedClausePanelHeader
        title={title}
        clauseInfoProvider={clauseInfoProvider}
        panelInfo={clausePanelInfo}
        isCustomClause
      />
    );
  }, [isNewClause, clausePanelInfo, clauseInfoProvider]);

  const PanelFooter = useCallback(
    () => (
      <SharedClausePanelActions
        clauseInfoProvider={clauseInfoProvider}
        panelInfo={clausePanelInfo}
        isCustomClause
      />
    ),
    [clauseInfoProvider, clausePanelInfo]
  );

  return (
    <Panel
      data-automation-id="customClause-panel"
      styles={{ content: { maxHeight: "calc(100vh - 131px)" } }}
      hasCloseButton={false}
      isFooterAtBottom
      type={FluentPanelType.custom}
      customWidth="56%"
      isOpen={isPanelOpen}
      closeButtonAriaLabel={stringsConst.common.closeButtonAriaLabel}
      isBlocking={isBlocking}
      onRenderHeader={PanelHeader}
      onRenderFooter={PanelFooter}
    >
      {!isNewClause &&
      !clauseInfoProvider.clauseInfo.isLoading &&
      !clauseInfoProvider.clauseInfo?.currentRevision?.id &&
      clauseInfoProvider.clauseInfo.clause ? (
        <DeleteOrphan
          objectType={AgreementObjectType.customClause}
          id={clauseInfoProvider.clauseInfo.clause.id}
        />
      ) : (
        <>
          <SharedClausePanelActionBar
            isLoadingClause={isLoadingClause}
            agreementObjectType={AgreementObjectType.customClause}
            clauseInfoProvider={clauseInfoProvider}
            panelInfo={clausePanelInfo}
            isCustomClause
          />
          <SharedClausePivotWithLoading
            LoadingSubstitute={CustomClausePivotShimmer}
            isLoading={isLoadingClause}
            clauseInfo={clauseInfoProvider.clauseInfo}
            clauseContentInfo={clauseInfoProvider.clauseContentInfo}
            editState={clausePanelInfo.editState}
            isCustomClause
            preselectedPivot={panelInfo.additionalInfo.preselectedPivot}
          />
        </>
      )}
    </Panel>
  );
}

export default CustomClausePanel;
