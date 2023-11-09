import { css, IconButton, mergeStyleSets } from "@fluentui/react";
import { INode } from "models/node";

import icons from "../Icons";

const styles = mergeStyleSets({
  wrapper: {
    display: "flex",
    textAlign: "center",
    height: "100%",
    flexShrink: 0,
    marginLeft: -8, // Account for toggle button padding
  },
  toggleBtn: {
    height: 28,
    width: 32,
    padding: 0,
  },
});

type NodeHeaderToggleProps<T> = {
  node: INode<T>;
  isOpen: boolean;
  disable: boolean;
  toggleNodeOpenState: (node: INode<T>) => void;
  setOpen: (state: boolean) => void;
};
function NodeHeaderToggle<T>({
  node,
  isOpen,
  disable,
  toggleNodeOpenState,
  setOpen,
}: NodeHeaderToggleProps<T>) {
  return (
    <div className={styles.wrapper}>
      <IconButton
        data-automation-id="templateEdit-structure-slotNodeToggle-button"
        aria-label="Slot group"
        className={css(styles.toggleBtn)}
        styles={{
          rootHovered: { backgroundColor: "transparent" },
          icon: {
            transition: "transform 0.1s",
            size: "12",
            fontSize: 12,
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          },
          flexContainer: {
            alignItems: "flex-start",
            marginTop: 2,
          },
        }}
        iconProps={icons.expand}
        onClick={(event) => {
          event.stopPropagation();
          if (!disable) {
            toggleNodeOpenState(node);
            setOpen(!isOpen);
          }
        }}
      />
    </div>
  );
}

export default NodeHeaderToggle;
