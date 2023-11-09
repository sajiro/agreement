import { Text } from "@fluentui/react";

import WithLoading from "components/shared/WithLoading";
import GroupedList, {
  GroupedListItem,
  HeadingType,
} from "components/shared/GroupedList";
import InfoCard from "components/shared/InfoCard";
import {
  getInfoItems,
  getClauseTranslationViewProps,
} from "components/shared/SharedPropertiesView";
import {
  ClauseLabelsShimmer,
  TranslationsShimmer,
  UsedInTemplateShimmer,
} from "components/loadingSkeletons/ClauseLoadingSkeletons";
import ColumnDisplay, {
  IColumnDisplayProps,
} from "components/shared/ColumnDisplay";
import stringsConst from "consts/strings";
import { DEFAULT_NON_EXISTING_VALUE_TEXT } from "helpers/agreements";
import useBusinessUnit from "hooks/useBusinessUnit";
import { AgreementObjectType } from "models/agreements";
import { ILabelData } from "models/clauseLabels";
import {
  IClauseContentInfo,
  IClauseInfo,
  IClauseRevision,
} from "models/clauses";
import { useGetUsedInTemplateQuery } from "services/clause";
import ClauseUsedInTemplateDisplay from "./ClauseUsedInTemplateDisplay";

const ClauseTranslationsWithLoading = WithLoading(ColumnDisplay);
const UsedInTemplateDisplayWithLoading = WithLoading(
  ClauseUsedInTemplateDisplay
);
const PSCategoryLabelsWithLoading = WithLoading(ColumnDisplay);

// eslint-disable-next-line react/function-component-definition
const ClauseLabelsView = ({
  isLoading,
  clauseLabels,
}: {
  isLoading?: boolean;
  clauseLabels?: ILabelData[];
}) => {
  const clauseLabelViewProps: IColumnDisplayProps = {
    values: clauseLabels?.map((label) => label.name || "") || [],
    maxColumnCount: 3,
    minValuesPerColumn: 5,
    noValuesMessage: DEFAULT_NON_EXISTING_VALUE_TEXT,
    styled: {
      paddingTop: 0,
      paddingBottom: 12,
    },
  };

  return (
    <div data-automation-id="psCategory-viewField">
      <Text
        data-automation-id="psCategory-fieldTitle"
        variant="smallPlus"
        style={{ fontWeight: 600 }}
      >
        {stringsConst.common.psCategory}
      </Text>
      <PSCategoryLabelsWithLoading
        isLoading={!!isLoading}
        LoadingSubstitute={ClauseLabelsShimmer}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...clauseLabelViewProps}
      />
    </div>
  );
};

type ClausePropertiesViewProps = {
  // eslint-disable-next-line react/require-default-props
  clauseInfo?: IClauseInfo;
  clauseContentInfo: IClauseContentInfo;
};

// eslint-disable-next-line react/function-component-definition
const ClausePropertiesView = ({
  clauseInfo,
  clauseContentInfo,
}: ClausePropertiesViewProps) => {
  const infoItems = getInfoItems(AgreementObjectType.clause, clauseInfo);
  const { currentData, isLoading } = useGetUsedInTemplateQuery(
    clauseInfo?.clause?.id
  );
  const currentRevision = clauseInfo?.currentRevision as IClauseRevision;

  // "PS Category" clause labels are only used by "Professional Services" business unit
  const { isProfessionalServices } = useBusinessUnit();
  const isBusinessUnitPS = isProfessionalServices();
  const hasClauseLabels =
    isBusinessUnitPS && !!clauseInfo?.psCategoryLabelInfo?.clauseLabels;

  const clauseTranslationViewProps: IColumnDisplayProps =
    getClauseTranslationViewProps(clauseContentInfo);

  const groupedListItems: GroupedListItem[] = [
    {
      headingType: HeadingType.subHeading,
      headingText: stringsConst.common.usedInTemplate,
      element: (
        <UsedInTemplateDisplayWithLoading
          isLoading={isLoading}
          LoadingSubstitute={UsedInTemplateShimmer}
          templateList={currentData}
        />
      ),
      hasInfoCallout: {
        title: stringsConst.clause.ClausePropertiesView.howToReadThis,
        message: (
          <>
            <p>
              A template is listed if the clause is included in any version of
              the template.
            </p>
            <p>
              The presence of a template does not necessarily mean the clause is
              currently being offered to customers. The clause could be in a
              draft, unpublished version or in an older version which is no
              longer being given to customers.
            </p>
          </>
        ),
      },
    },
    {
      headingType: HeadingType.subHeading,
      headingText: stringsConst.common.category,
      element: <Text>{clauseInfo?.clause?.category}</Text>,
    },
    {
      headingType: HeadingType.subHeading,
      headingText: stringsConst.common.displayOption,
      element: <Text>{currentRevision?.displayOption}</Text>,
    },
  ];

  return (
    <>
      <InfoCard
        infoItems={infoItems}
        dataAutomationId="clauseProperties-infoCard"
      />
      <GroupedList groupedListItems={groupedListItems} />
      {hasClauseLabels ? (
        <ClauseLabelsView
          isLoading={clauseInfo?.isLoading}
          clauseLabels={clauseInfo?.psCategoryLabelInfo?.clauseLabels}
        />
      ) : null}
      <div
        data-automation-id="clauseProperties-translations"
        style={{ marginTop: "16px" }}
      >
        <Text
          data-automation-id="section-heading"
          variant="mediumPlus"
          style={{ fontWeight: 600 }}
        >
          {stringsConst.common.translations}
        </Text>
        <ClauseTranslationsWithLoading
          isLoading={clauseContentInfo.isLoading}
          LoadingSubstitute={TranslationsShimmer}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...clauseTranslationViewProps}
        />
      </div>
    </>
  );
};

export default ClausePropertiesView;
