import { useEffect, useRef, useState } from "react";
import { mergeStyleSets, Pivot, PivotItem } from "@fluentui/react";
import _ from "lodash";

import ClausePropertiesView from "components/clause/ClausePropertiesView";
import ClauseDynamicValuesForm from "components/clausePanel/ClauseDynamicValuesForm";
import ClausePropertiesForm from "components/clausePanel/ClausePropertiesForm";
import ClauseTranslationsForm from "components/clausePanel/ClauseTranslationsForm";
import CustomClausePropertiesView from "components/customClause/CustomClausePropertiesView";
import CustomClausePropertiesForm from "components/customClausePanel/CustomClausePropertiesForm";
import CustomClauseTranslationsForm from "components/customClausePanel/CustomClauseTranslationsForm";
import {
  ClausePreviewShimmer,
  TranslationsFormShimmer,
} from "components/loadingSkeletons/ClauseLoadingSkeletons";
import { CustomClauseTranslationsFormShimmer } from "components/loadingSkeletons/CustomClauseLoadingSkeletons";
import SharedClausePreview from "components/shared/SharedClausePreview";
import WithLoading from "components/shared/WithLoading";

import { isPublishedRevisionVariant } from "helpers/revisions";
import { AgreementObjectEditState } from "models/agreements";
import { IClauseContentInfo, IClauseInfo, IClausePlaceHolderContentInfo } from "models/clauses";
import {
  ICustomClauseContentInfo,
  ICustomClauseInfo,
} from "models/customClauses";
import { ClausePivotName } from "models/panel";
import { RevisionStatus } from "models/revisions";

const styles = mergeStyleSets({
  clausePivot: {
    height: "calc(100vh - 384px)",
    overflow: "auto",
    marginTop: "20px",

    ".ms-Panel &": {
      height: "calc(100vh - 260px)",
    },
  },
  isReadOnly: {
    ".ms-Panel &": {
      height: "calc(100vh - 178px)",
    },
  },
});

const ClausePreviewWithLoading = WithLoading(SharedClausePreview);

const getDefaultSelectedPivot = (
  editState: AgreementObjectEditState | undefined,
  isReadonly: boolean,
  preselectedPivot?: string
) => {
  if (!editState || editState === AgreementObjectEditState.NewClause) {
    return ClausePivotName.Properties.toString();
  }

  if (preselectedPivot) {
    return preselectedPivot;
  }

  if (isReadonly) {
    return ClausePivotName.Preview.toString();
  }

  return ClausePivotName.Translations.toString();
};

const getPropertiesComponent = (
  clauseInfo: IClauseInfo | ICustomClauseInfo,
  clauseContentInfo: IClauseContentInfo | ICustomClauseContentInfo,
  editState: AgreementObjectEditState | undefined,
  isCustomClause: boolean,
  isReadonly: boolean
) => {
  if (isCustomClause) {
    return !editState || isReadonly ? (
      <CustomClausePropertiesView
        clauseInfo={clauseInfo as ICustomClauseInfo}
        clauseContentInfo={clauseContentInfo}
      />
    ) : (
      <CustomClausePropertiesForm
        clauseInfo={clauseInfo as ICustomClauseInfo}
        editState={editState!}
      />
    );
  }

  return !editState || isReadonly ? (
    <ClausePropertiesView
      clauseInfo={clauseInfo as IClauseInfo}
      clauseContentInfo={clauseContentInfo}
    />
  ) : (
    <ClausePropertiesForm
      clauseInfo={clauseInfo as IClauseInfo}
      editState={editState!}
    />
  );
};

const getPivotItems = (
  clauseInfo: IClauseInfo | ICustomClauseInfo,
  clauseContentInfo: IClauseContentInfo | ICustomClauseContentInfo,
  clausePlaceholderContent: IClausePlaceHolderContentInfo | undefined,
  editState: AgreementObjectEditState | undefined,
  isCustomClause: boolean,
  isReadonly: boolean
) => {
  const propertiesComponent = getPropertiesComponent(
    clauseInfo,
    clauseContentInfo,
    editState,
    isCustomClause,
    isReadonly
  );

  // creating a new clause or custom clause: show only Properties
  const pivotItems = [
    {
      key: ClausePivotName.Properties,
      value: propertiesComponent,
    },
  ];

  // info panel and edit panel, for clause and custom clause
  if (editState !== AgreementObjectEditState.NewClause) {
    // when in edit panel and the current revision is not read-only (not published),
    // show the Translations pivot
    if (editState && !isReadonly) {
      const TranslationsFormWithLoading = isCustomClause
        ? WithLoading(CustomClauseTranslationsForm)
        : WithLoading(ClauseTranslationsForm);

      const FormShimmer = isCustomClause
        ? CustomClauseTranslationsFormShimmer
        : TranslationsFormShimmer;

      pivotItems.push({
        key: ClausePivotName.Translations,
        value: (
          <TranslationsFormWithLoading
            isLoading={clauseContentInfo.isLoading}
            LoadingSubstitute={FormShimmer}
            isLoadingTranslations={clauseContentInfo.isLoading}
          />
        ),
      });
    }

    // for clause only, if it has placeholder content
    // show the Placeholders pivot in info panel and edit panel
    if (
      !isCustomClause &&
      clausePlaceholderContent &&
      !_.isEmpty(clausePlaceholderContent.content) &&
      !_.isEmpty((clausePlaceholderContent.content as any).contents)
    ) {
      pivotItems.push({
        key: ClausePivotName.ContentPlaceholders,
        value: (
          <ClauseDynamicValuesForm
            dynamicPlaceholderContentInfo={clausePlaceholderContent!.content}
            clauseId={clauseInfo.clause?.id}
            revisionId={clauseInfo.currentRevision?.id}
          />
        ),
      });
    }

    // show the Preview pivot in info panel and edit panel
    pivotItems.push({
      key: ClausePivotName.Preview,
      value: (
        <ClausePreviewWithLoading
          isLoading={clauseContentInfo.isLoading}
          LoadingSubstitute={ClausePreviewShimmer}
          clauseContentInfo={clauseContentInfo}
          clauseId={clauseInfo.clause?.id}
          revisionId={clauseInfo.currentRevision?.id}
          isCustomClause={isCustomClause}
          dynamicPlaceholderContentInfo={
            !isCustomClause ? clausePlaceholderContent!.content : null
          }
        />
      ),
    });
  }

  return pivotItems.map((item) => {
    const itemKey = item.key.toString();

    return (
      <PivotItem
        className={`${styles.clausePivot} ${
          isReadonly ? styles.isReadOnly : ""
        }`}
        key={itemKey}
        headerText={itemKey}
        itemKey={itemKey}
      >
        {item.value}
      </PivotItem>
    );
  });
};

const usePivotManager = (
  clauseInfo: IClauseInfo | ICustomClauseInfo,
  editState: AgreementObjectEditState | undefined,
  isReadonly: boolean,
  preselectedPivot?: string
) => {
  const [pivotKey, setPivotKey] = useState<string | undefined>(undefined);
  const previousRevisionIdRef = useRef<string | undefined>(undefined);
  const defaultSelectedPivot = getDefaultSelectedPivot(
    editState,
    isReadonly,
    preselectedPivot
  );

  useEffect(() => {
    if (previousRevisionIdRef.current !== clauseInfo.currentRevision?.id) {
      previousRevisionIdRef.current = clauseInfo.currentRevision?.id;
      setPivotKey(defaultSelectedPivot);
    }
  }, [clauseInfo.currentRevision?.id, defaultSelectedPivot]);

  const currentPivotKey = pivotKey || ClausePivotName.Properties.toString();

  return [currentPivotKey, setPivotKey] as [string, (pivotKey: string) => void];
};

type ClausePivotProps = {
  clauseInfo: IClauseInfo | ICustomClauseInfo;
  clauseContentInfo: IClauseContentInfo | ICustomClauseContentInfo;
  clausePlaceholderContent: IClauseContentInfo | undefined;
  // eslint-disable-next-line react/require-default-props
  editState: AgreementObjectEditState | undefined;
  isCustomClause: boolean;
  preselectedPivot?: string;
  onSetPanelPivot?: (pivot: string) => void;
};

function SharedClausePivot({
  clauseInfo,
  clauseContentInfo,
  clausePlaceholderContent,
  editState,
  isCustomClause,
  preselectedPivot,
  onSetPanelPivot,
}: ClausePivotProps) {
  const isReadonly =
    isPublishedRevisionVariant(clauseInfo.currentRevision?.status) ||
    clauseInfo.currentRevision?.status === RevisionStatus.Test;
  const pivotItems = getPivotItems(
    clauseInfo,
    clauseContentInfo,
    clausePlaceholderContent,
    editState,
    isCustomClause,
    isReadonly
  );
  const [pivotKey, setPivotKey] = usePivotManager(
    clauseInfo,
    editState,
    isReadonly,
    preselectedPivot
  );

  return (
    <Pivot
      data-automation-id="shared-clause-pivot"
      style={{ position: "relative" }}
      selectedKey={pivotKey}
      onLinkClick={(item?: PivotItem) => {
        setPivotKey(item!.props.itemKey!);

        if (onSetPanelPivot) {
          onSetPanelPivot(item!.props.itemKey!);
        }
      }}
    >
      {pivotItems}
    </Pivot>
  );
}

export const SharedClausePivotWithLoading = WithLoading(SharedClausePivot);

export default SharedClausePivot;
