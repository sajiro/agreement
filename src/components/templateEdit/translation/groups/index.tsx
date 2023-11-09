import { css, IconButton, mergeStyles, mergeStyleSets } from "@fluentui/react";
import icons from "components/shared/Icons";
import customTheme from "helpers/customTheme";
import { ITemplateRevisionSlot, ITemplateRevisionSlotItem } from "models/slot";
import React from "react";

const styles = mergeStyleSets({
  mainClass: { display: "flex", minHeight: 20, cursor: "default" },
  wrapper: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    height: "100%",
    flexShrink: 0,
  },
  toggleBtn: {
    height: 28,
    width: 32,
    padding: 0,
    ":hover": {
      background: "transparent",
    },
  },
});

const mainContainerActiveCurrent = mergeStyles({
  borderLeft: `3px solid ${customTheme.focusColor}`,
  "&:hover": {
    background: `${customTheme.listItemBackgroundCheckedHovered}`,
  },
});

const mainContainerActive = mergeStyles({
  background: `${customTheme.actionsBackgroundColor}`,
  borderLeft: `3px solid transparent`,
  "&:hover": {
    borderLeft: `3px solid ${customTheme.focusColor}`,
  },
});

const mainContainer = mergeStyles({
  borderLeft: `3px solid transparent`,
  "&:hover": {
    borderLeft: `3px solid ${customTheme.focusColor} `,
  },
});

const itemP = mergeStyles({
  margin: "7px 0 7px 2px",
  fontWeight: 600,
  fontSize: 14,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
});

const subContainer = (level: number) => ({
  width: 330, // - item.level * 40,
  paddingLeft: level * 22,
});

type GroupProps = {
  item: ITemplateRevisionSlotItem;
  collapseSlots?: (
    id: string,
    item: ITemplateRevisionSlot[],
    slot: ITemplateRevisionSlotItem
  ) => void;
};

function Groups({ item, collapseSlots = () => {} }: GroupProps) {
  return (
    <div
      className={css(
        styles.mainClass,
        // eslint-disable-next-line no-nested-ternary
        item?.isParentSelected
          ? item.current
            ? mainContainerActiveCurrent
            : mainContainerActive
          : mainContainer
      )}
    >
      <div style={subContainer(item.level)}>
        <p className={itemP} title={item.name}>
          <IconButton
            data-automation-id="icon-button-translation-arrow"
            aria-label="Translation group"
            title={item.name}
            className={css(styles.toggleBtn)}
            styles={{
              rootPressed: {
                backgroundColor: "transparent",
              },
              icon: {
                transition: "transform 0.1s",
                size: "12",
                fontSize: 12,
                transform: item.isCollapsed ? "rotate(90deg)" : "rotate(0deg)",
              },
            }}
            iconProps={icons.expand}
            onClick={() => {
              collapseSlots(item.id, item.slots, item);
            }}
          />
          {item.name === "" ? "-" : item.name}
        </p>
      </div>
    </div>
  );
}

export default React.memo(Groups);
