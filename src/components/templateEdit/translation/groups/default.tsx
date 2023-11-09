import { mergeStyles } from "@fluentui/react";
import customTheme from "helpers/customTheme";
import { ITemplateRevisionSlotItem } from "models/slot";
import React from "react";
import Translations from "../translations";

const TransContainer = mergeStyles({
  width: "100%",
  color: customTheme.secondaryGrey130,
});

const mainContainer = () => ({
  display: "flex",
  paddingTop: 11,
  paddingBottom: 11,
  paddingRight: 11,
});

const clauseTitle = (level: number) => ({
  width: 330,
  paddingLeft: level * 23,
  textOverflow: "ellipsis",
  /* whiteSpace: "nowrap", */
  overflow: "hidden",
  fontWeight: 400,
  fontSize: 14,
  marginLeft: 10,
  cursor: "default",
});

const mainClass = mergeStyles({
  borderLeft: `3px solid transparent`,
  "&:hover": {
    borderLeft: `3px solid ${customTheme.focusColor}`,
  },
});

const mainClassActive = mergeStyles({
  background: customTheme.actionsBackgroundColor,
  borderLeft: `3px solid transparent`,
  "&:hover": {
    borderLeft: `3px solid ${customTheme.focusColor}`,
  },
});

const mainClassActiveCurrent = mergeStyles({
  borderLeft: `3px solid ${customTheme.focusColor}`,
  "&:hover": {
    background: `${customTheme.listItemBackgroundCheckedHovered}`,
  },
});

type Props = {
  item: ITemplateRevisionSlotItem;
};

function Default({ item }: Props) {
  const { level = 0 } = item;

  return (
    <div
      className={
        // eslint-disable-next-line no-nested-ternary
        item?.isParentSelected
          ? item.current
            ? mainClassActiveCurrent
            : mainClassActive
          : mainClass
      }
      style={mainContainer()}
    >
      <div style={{ width: "640px" }}>
        <div style={clauseTitle(level)} title={item.partName}>
          {item.partName}
        </div>
      </div>
      <div className={TransContainer}>
        <Translations partId={item.partId} />
      </div>
    </div>
  );
}

export default React.memo(Default);
