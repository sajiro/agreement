import ColumnDisplay, {
  IColumnDisplayProps,
} from "components/shared/ColumnDisplay";
import GroupedList, {
  GroupedListItem,
  HeadingType,
} from "components/shared/GroupedList";
import { Text } from "@fluentui/react";
import WithLoading from "components/shared/WithLoading";
import { DEFAULT_NON_EXISTING_VALUE_TEXT } from "helpers/agreements";
import { IConstraintValue } from "models/constraints";
import stringsConst from "consts/strings";

function ConstraintGroupedList({
  constraintValues,
}: {
  constraintValues: IConstraintValue[] | undefined;
}) {
  const constraintValuesViewProps: IColumnDisplayProps = {
    values: constraintValues!.map((v) =>
     v.display === "" || v.display===v.name ? v.name : `${v.display} (${v.name})`
    ),
    maxColumnCount: 3,
    minValuesPerColumn: 5,
    noValuesMessage: DEFAULT_NON_EXISTING_VALUE_TEXT,
    isSmallSection:true
  };

  const groupedListItems: GroupedListItem[] = [
    {
      headingType: HeadingType.subHeading,
      headingText: stringsConst.constraint.ConstraintGroupedList.headingValues,
      element: <ColumnDisplay {...constraintValuesViewProps} />,
      hasInfoCallout: {
        title:stringsConst.constraint.ConstraintGroupedList.callOutMessage,
        message:<><div><Text>The name of the values will always be shown. If a friendly name exist, then it will be included as well.</Text></div><Text>The format will be either:</Text>  <ul style={{marginLeft: "-15px"}}><li>Name</li><li>Friendly name (name)</li></ul></>
      }
    },
  ];

  return <GroupedList groupedListItems={groupedListItems} />;
}

export default ConstraintGroupedList;

export const ConstraintGroupedListWithLoading = WithLoading(
  ConstraintGroupedList
);
