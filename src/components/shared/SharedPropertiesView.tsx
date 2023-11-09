import { IColumnDisplayProps } from "components/shared/ColumnDisplay";
import stringsConst from "consts/strings";
import { DEFAULT_NON_EXISTING_VALUE_TEXT } from "helpers/agreements";
import { FormatDate } from "helpers/dates";
import {
  getRevisionStatusStyle,
  getRevisionStatusDisplayName,
  isPublishedRevisionVariant,
} from "helpers/revisions";
import { getDisplayNameForLanguage } from "helpers/translations";
import { AgreementObjectType, IAgreementObjectInfo } from "models/agreements";
import { IClauseContentInfo } from "models/clauses";
import { ICustomClauseContentInfo } from "models/customClauses";
import { IRevision } from "models/revisions";

// eslint-disable-next-line react/function-component-definition
const RevisionStatusDisplay = ({ revision }: { revision?: IRevision }) => (
  <span style={getRevisionStatusStyle(revision?.status)}>
    {getRevisionStatusDisplayName(revision?.status)}
  </span>
);

export const getInfoItems = (
  objectType: AgreementObjectType,
  objectInfo?: IAgreementObjectInfo
) => {
  const currentRevision = objectInfo?.currentRevision;
  const displayPublished = isPublishedRevisionVariant(currentRevision?.status);

  const infoItems = [
    {
      key: stringsConst.shared.SharedPropertiesView.version,
      value:
        currentRevision?.number === 0
          ? "-"
          : currentRevision?.number.toString(),
    },
    {
      key: stringsConst.shared.SharedPropertiesView.status,
      value: <RevisionStatusDisplay revision={currentRevision} />,
    },
    {
      key: displayPublished
        ? stringsConst.shared.SharedPropertiesView.published
        : stringsConst.shared.SharedPropertiesView.lastModified,
      value: FormatDate(currentRevision?.modifiedDate),
    },
    {
      key: displayPublished
        ? stringsConst.shared.SharedPropertiesView.publishedBy
        : stringsConst.shared.SharedPropertiesView.modifiedBy,
      value: currentRevision?.modifiedBy,
    },
  ];

  if (
    objectType !== AgreementObjectType.customClause &&
    displayPublished &&
    currentRevision?.effectiveDate
  ) {
    infoItems.splice(3, 0, {
      key: stringsConst.shared.SharedPropertiesView.goLive,
      value: FormatDate(currentRevision?.effectiveDate),
    });
  }

  if (
    objectType === AgreementObjectType.template ||
    objectType === AgreementObjectType.clause
  ) {
    infoItems.splice(1, 0, {
      key: stringsConst.shared.SharedPropertiesView.description,
      value: currentRevision?.name || "-",
    });
  }

  return infoItems;
};

export const getClauseTranslationViewProps = (
  clauseContentInfo: IClauseContentInfo | ICustomClauseContentInfo
): IColumnDisplayProps => {
  const clauseTranslationViewProps: IColumnDisplayProps = {
    values:
      clauseContentInfo.contents?.map((c) =>
        getDisplayNameForLanguage(c.language)
      ) || [],
    maxColumnCount: 3,
    minValuesPerColumn: 5,
    noValuesMessage: DEFAULT_NON_EXISTING_VALUE_TEXT,
  };

  return clauseTranslationViewProps;
};
