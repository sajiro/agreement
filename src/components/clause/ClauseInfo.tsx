import { useEffect, useRef } from "react";

import {
  ClauseActionBarShimmer,
  ClausePivotShimmer,
} from "components/loadingSkeletons/ClauseLoadingSkeletons";
import { TitleShimmer } from "components/loadingSkeletons/GeneralLoadingSkeletons";
import DeleteOrphan from "components/shared/DeleteOrphan";
import InfoPageTitle, {
  InfoPageTitleWithLoading,
} from "components/shared/InfoPageTitle";
import NoItemSelectedDisplay from "components/shared/NoItemSelectedDisplay";
import { SharedActionBarWithLoading } from "components/shared/SharedActionBar";
import { SharedClausePivotWithLoading } from "components/shared/SharedClausePivot";
import useDialog from "hooks/useDialog";
import usePanel from "hooks/usePanel";
import useClauseInfoProvider from "hooks/clause/useClauseInfoProvider";
import { 
  AgreementObjectType, 
  IAgreementObjectId 
} from "models/agreements";
import { ClausePivotName, PanelType } from "models/panel";

// eslint-disable-next-line react/function-component-definition
const ClauseInfo = ({ clauseId, isNothingSelected }: IAgreementObjectId) => {
  const {
    clauseInfo,
    clauseContentInfo,
    setCurrentRevision,
    clausePlaceholderContent,
    isClause404Error,
  } = useClauseInfoProvider(clauseId);

  const { openPanel: openClausePanel } = usePanel(PanelType.Clause);
  const { openError404Dialog } = useDialog();
  const currentPivotRef = useRef<string>("");

  const onInfoPagePopOut = () => {
    openClausePanel({ 
      clauseId, 
      revisionId: clauseInfo?.currentRevision?.id,
    }, undefined, currentPivotRef.current);
  };

  const onSetPanelPivot = (pivot: string) => {
    currentPivotRef.current = pivot;
  };

  useEffect(() => {
    currentPivotRef.current = ClausePivotName.Properties.toString();
  }, [
    clauseId,  
    clauseInfo?.currentRevision?.id,
  ]);

  useEffect(() => {
    if (isClause404Error) {
      openError404Dialog("clause", AgreementObjectType.clause, false);
    }
  }, [isClause404Error]);
  
  if (
    !isClause404Error &&
    !clauseInfo.isLoading &&
    !clauseInfo?.currentRevision?.id &&
    clauseInfo.clause
  ) {
    return (
      <>
        <InfoPageTitle
          title={clauseInfo?.clause?.name}
          onInfoPagePopOut={onInfoPagePopOut}
        />
        <DeleteOrphan objectType={AgreementObjectType.clause} id={clauseId!} />
      </>
    );
  }

  return (
    <>
      {isNothingSelected && <NoItemSelectedDisplay itemType="clause" />}
      {!isNothingSelected && (
        <>
          <InfoPageTitleWithLoading
            isLoading={clauseInfo.isLoading}
            LoadingSubstitute={TitleShimmer}
            title={clauseInfo?.clause?.name}
            onInfoPagePopOut={onInfoPagePopOut}
          />
          <SharedActionBarWithLoading
            isLoading={clauseInfo.isLoading}
            LoadingSubstitute={ClauseActionBarShimmer}
            objectType={AgreementObjectType.clause}
            objectInfo={clauseInfo}
            objectContentInfo={clauseContentInfo}
            openEditPanel={openClausePanel}
            setCurrentRevision={setCurrentRevision}
          />
          <SharedClausePivotWithLoading
            isLoading={clauseInfo.isLoading}
            LoadingSubstitute={ClausePivotShimmer}
            clauseInfo={clauseInfo}
            clauseContentInfo={clauseContentInfo}
            clausePlaceholderContent={clausePlaceholderContent}
            isCustomClause={false}
            onSetPanelPivot={onSetPanelPivot}
          />
        </>
      )}
    </>
  );
};

export default ClauseInfo;
