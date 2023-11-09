import { Panel, PanelType as FluentPanelType } from "@fluentui/react";
import SharedClausePanelActions from "components/shared/SharedClausePanelActions";
import { SharedClausePivotWithLoading } from "components/shared/SharedClausePivot";
import { ClausePivotShimmer } from "components/loadingSkeletons/ClauseLoadingSkeletons";
import useSharedClausePanelInitializer from "hooks/useSharedClausePanelInitializer";
import useClausePanelInfoProvider from "hooks/clause/useClausePanelInfoProvider";
import {
  AgreementObjectEditState,
  AgreementObjectType,
} from "models/agreements";
import { IClausePanelInfo } from "models/clausePanel";
import { IPanel, IPanelProps, PanelType } from "models/panel";
import stringsConst from "consts/strings";
import DeleteOrphan from "components/shared/DeleteOrphan";
import { useCallback } from "react";
import SharedClausePanelHeader from "components/shared/SharedClausePanelHeader";
import SharedClausePanelActionBar from "components/shared/SharedClausePanelActionBar";

const getClausePanelInfo = (panelInfo: IPanel): IClausePanelInfo => ({
  editState:
    (panelInfo.additionalInfo.clauseEditState as AgreementObjectEditState) ||
    AgreementObjectEditState.Default,
  clauseId: panelInfo.agreementObjectIds.clauseId,
  revisionId: panelInfo.agreementObjectIds.revisionId,
});

function ClausePanel({ panelInfo, isBlocking }: IPanelProps) {
  const isPanelOpen = panelInfo.panelType === PanelType.Clause;
  const clausePanelInfo = getClausePanelInfo(panelInfo);
  const clauseInfoProvider = useClausePanelInfoProvider(clausePanelInfo);
  useSharedClausePanelInitializer(
    false,
    clauseInfoProvider,
    clausePanelInfo,
    isPanelOpen
  );

  const isNewClause =
    clausePanelInfo.editState === AgreementObjectEditState.NewClause;
  const isLoadingClause =
    !clauseInfoProvider.clauseInfo.hasData ||
    !clauseInfoProvider.clauseContentInfo.hasData ||
    !clauseInfoProvider.clausePlaceholderContent.hasData;

  const PanelHeader = useCallback(() => {
    const title = isNewClause
      ? stringsConst.clausePanel.ClausePanel.createNewClause
      : clauseInfoProvider.clauseInfo.clause?.name;
    return (
      <SharedClausePanelHeader
        title={title}
        clauseInfoProvider={clauseInfoProvider}
        isCustomClause={false}
        panelInfo={clausePanelInfo}
      />
    );
  }, [isNewClause, clausePanelInfo, clauseInfoProvider]);

  const PanelFooter = useCallback(
    () => (
      <SharedClausePanelActions
        isCustomClause={false}
        clauseInfoProvider={clauseInfoProvider}
        panelInfo={clausePanelInfo}
      />
    ),
    [clauseInfoProvider, clausePanelInfo]
  );

  return (
    <Panel
      data-automation-id="clause-panel"
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
          objectType={AgreementObjectType.clause}
          id={clauseInfoProvider.clauseInfo.clause.id}
        />
      ) : (
        <>
          <SharedClausePanelActionBar
            isLoadingClause={isLoadingClause}
            agreementObjectType={AgreementObjectType.clause}
            clauseInfoProvider={clauseInfoProvider}
            panelInfo={clausePanelInfo}
            isCustomClause={false}
          />
          <SharedClausePivotWithLoading
            LoadingSubstitute={ClausePivotShimmer}
            isLoading={isLoadingClause}
            clauseInfo={clauseInfoProvider.clauseInfo}
            clauseContentInfo={clauseInfoProvider.clauseContentInfo}
            clausePlaceholderContent={
              clauseInfoProvider.clausePlaceholderContent
            }
            editState={clausePanelInfo.editState}
            isCustomClause={false}
            preselectedPivot={panelInfo.additionalInfo.preselectedPivot}
          />
        </>
      )}
    </Panel>
  );
}

export default ClausePanel;
