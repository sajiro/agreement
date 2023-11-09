import { ITextProps, mergeStyleSets, Stack, Text } from "@fluentui/react";
import customTheme from "helpers/customTheme";
import React from "react";
import InfoCallout from "./InfoCallout";

export enum HeadingType {
  subHeading,
  heading,
}

export type GroupedListItem = {
  headingType: HeadingType;
  headingText: string;
  element: JSX.Element | JSX.Element[];
  hasInfoCallout?: {
    title: string;
    message: JSX.Element;
  };
};

const headingStyle = {
  fontWeight: 600,
} as const;

const textSizeMapping = {
  [HeadingType.subHeading]: "smallPlus",
  [HeadingType.heading]: "mediumPlus",
};

const styles = mergeStyleSets({
  groupListStyles: {
    ...customTheme.groupedListContainer,
  },
  groupListItem: {
    margin: "0 0 12px 0",
  },
});
// eslint-disable-next-line
const GroupedList = ({
  groupedListItems,
}: {
  groupedListItems: GroupedListItem[];
}) => (
  <div className={styles.groupListStyles}>
    {groupedListItems.map((listItem, index) => {
      const textSize = textSizeMapping[
        listItem.headingType
      ] as ITextProps["variant"];
      return (
        <div key={`groupedListItem_${index}`} className={styles.groupListItem} data-automation-id="groupedlist">
          <Stack horizontal>
            <Text variant={textSize} style={headingStyle}>
              {listItem.headingText}
            </Text>
            {listItem.hasInfoCallout !== undefined ? (
              <InfoCallout
                position={12}
                title={listItem.hasInfoCallout!.title}
                message={listItem.hasInfoCallout!.message}
                height="100%"
                width="323px"
              />
            ) : null}
          </Stack>
          {listItem.element}
        </div>
      );
    })}
  </div>
);

export default GroupedList;
