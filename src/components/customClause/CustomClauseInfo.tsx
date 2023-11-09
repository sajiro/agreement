import { useEffect, useRef } from "react";

import {
  CustomClauseActionBarShimmer,
  CustomClausePivotShimmer,
} from "components/loadingSkeletons/CustomClauseLoadingSkeletons";
import { TitleShimmer } from "components/loadingSkeletons/GeneralLoadingSkeletons";
import DeleteOrphan from "components/shared/DeleteOrphan";
import InfoPageTitle, {
  InfoPageTitleWithLoading,
} from "components/shared/InfoPageTitle";
import NoItemSelectedDisplay from "components/shared/NoItemSelectedDisplay";
import { SharedActionBarWithLoading } from "components/shared/SharedActionBar";
import { SharedClausePivotWithLoading } from "components/shared/SharedClausePivot";

import useCustomClauseInfoProvider from "hooks/customClause/useCustomClauseInfoProvider";
import usePanel from "hooks/usePanel";
import { AgreementObjectType, IAgreementObjectId } from "models/agreements";
import { ClausePivotName, PanelType } from "models/panel";

// eslint-disable-next-line react/function-component-definition
const CustomClauseInfo = ({
  templateId,
  clauseId,
  isNothingSelected,
}: IAgreementObjectId) => {
  const { clauseInfo, clauseContentInfo, setCurrentRevision } =
    useCustomClauseInfoProvider(templateId, clauseId);

  const { openPanel: openClausePanel } = usePanel(PanelType.CustomClause);
  const currentPivotRef = useRef<string>("");

  const onInfoPagePopOut = () => {
    openClausePanel({
      templateId,
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
    clauseInfo?.currentRevision?.id
  ]);

  if (
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
        <DeleteOrphan
          objectType={AgreementObjectType.customClause}
          id={clauseId!}
        />
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
            LoadingSubstitute={CustomClauseActionBarShimmer}
            objectType={AgreementObjectType.customClause}
            objectInfo={clauseInfo}
            objectContentInfo={clauseContentInfo}
            openEditPanel={openClausePanel}
            setCurrentRevision={setCurrentRevision}
          />
          <SharedClausePivotWithLoading
            isLoading={clauseInfo.isLoading}
            LoadingSubstitute={CustomClausePivotShimmer}
            clauseInfo={clauseInfo}
            clauseContentInfo={clauseContentInfo}
            isCustomClause
            onSetPanelPivot={onSetPanelPivot}
          />
        </>
      )}
    </>
  );
};

export default CustomClauseInfo;
