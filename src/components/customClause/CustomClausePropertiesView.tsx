/* eslint-disable react/function-component-definition */

import { mergeStyleSets, Text } from "@fluentui/react";
import { CustomClauseTranslationsShimmer } from "components/loadingSkeletons/CustomClauseLoadingSkeletons";
import ColumnDisplay, {
  IColumnDisplayProps,
} from "components/shared/ColumnDisplay";
import GroupedList, {
  GroupedListItem,
  HeadingType,
} from "components/shared/GroupedList";
import InfoCard from "components/shared/InfoCard";
import {
  getInfoItems,
  getClauseTranslationViewProps,
} from "components/shared/SharedPropertiesView";
import WithLoading from "components/shared/WithLoading";
import { DEFAULT_NON_EXISTING_VALUE_TEXT } from "helpers/agreements";
import {
  ICustomClauseContentInfo,
  ICustomClauseInfo,
} from "models/customClauses";
import { AgreementObjectType } from "models/agreements";
import stringsConst from "consts/strings";
import UsedInTemplateView from "components/shared/UsedInTemplateView";
import customTheme from "helpers/customTheme";

const ClauseTranslationsWithLoading = WithLoading(ColumnDisplay);

type ClausePropertiesViewProps = {
  // eslint-disable-next-line react/require-default-props
  clauseInfo?: ICustomClauseInfo;
  clauseContentInfo: ICustomClauseContentInfo;
};
const styles = mergeStyleSets({
  usedInTemplateConatiner: {
    ...customTheme.groupedListContainer,
    alignItems: "flex-start",
  },
});
// eslint-disable-next-line react/function-component-definition
const CustomClausePropertiesView = ({
  clauseInfo,
  clauseContentInfo,
}: ClausePropertiesViewProps) => {
  const infoItems = getInfoItems(AgreementObjectType.customClause, clauseInfo);
  const currentClause = clauseInfo?.clause;

  const templateLink = currentClause?.templateId ? (
    <div
      data-automation-id="customClauseProperties-templateLink" 
      className={styles.usedInTemplateConatiner}
    >
      <UsedInTemplateView
        templateId={currentClause?.templateId}
        templateName={currentClause?.templateName}
      />
    </div>
  ) : (
    <Text>{DEFAULT_NON_EXISTING_VALUE_TEXT}</Text>
  );

  const clauseTranslationViewProps: IColumnDisplayProps =
    getClauseTranslationViewProps(clauseContentInfo);

  const groupedListItems: GroupedListItem[] = [
    {
      headingType: HeadingType.subHeading,
      headingText: stringsConst.common.description,
      element: <Text>{currentClause?.description}</Text>,
    },
    {
      headingType: HeadingType.subHeading,
      headingText: stringsConst.common.usedInTemplate,
      element: templateLink,
    },
    {
      headingType: HeadingType.subHeading,
      headingText: stringsConst.common.id,
      element: <Text>{currentClause?.id}</Text>,
    },
    {
      headingType: HeadingType.subHeading,
      headingText: stringsConst.common.translations,
      element: (
        <ClauseTranslationsWithLoading
          isLoading={clauseContentInfo.isLoading}
          LoadingSubstitute={CustomClauseTranslationsShimmer}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...clauseTranslationViewProps}
          isSmallSection
        />
      ),
    },
  ];

  if (!currentClause?.description) {
    groupedListItems.splice(0, 1);
  }

  return (
    <>
      <InfoCard 
        dataAutomationId="customClauseProperties-infoCard"
        infoItems={infoItems} 
        keyColumnWidth="86" 
      />
      <GroupedList groupedListItems={groupedListItems} />
    </>
  );
};

export default CustomClausePropertiesView;
