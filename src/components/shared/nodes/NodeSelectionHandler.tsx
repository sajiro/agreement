import { mergeStyles } from "@fluentui/react";
import { CSSProperties, useEffect, useRef } from "react";
import {
  RelativeNodePosition,
  INode,
  INodeSelectionTracker,
  NodeSelectionMode,
  NodeSelectionType,
} from "models/node";
import { useNodeSelectionManager } from "components/templateEdit/structure/TemplateEditStructureSelectionManager";
import useObserver from "hooks/useObserver";
import { useTemplateEditStructureNodeManager } from "components/templateEdit/structure/TemplateEditStructureNodeManager";
import { ITemplateRevisionSlot } from "models/slot";
import { keyCodes } from "consts/keycode";
import { DEFAULT_NODE_HEIGHT } from "consts/globals";
import customTheme from "helpers/customTheme";

const styles = mergeStyles({
  display: "flex",
  position: "relative",
  minHeight: DEFAULT_NODE_HEIGHT,
  "&:hover": {
    background: customTheme.menuItemBgHovered,
    borderLeftColor: `${customTheme.focusColor} !important`,
  },
  "&:focus:hover": {
    background: `${customTheme.listItemBackgroundCheckedHovered} !important`,
  },
});

const getSelectionStyle = (
  currentNodeId: string,
  nodeSelection: INodeSelectionTracker,
  isDragging: boolean
): CSSProperties => {
  const selectionType =
    nodeSelection.selections.getSelectionType(currentNodeId);
  const selectionBackgroundColor =
    selectionType === NodeSelectionType.Main
      ? customTheme.menuItemBgPressed
      : customTheme.actionsBackgroundColor;
  const backgroundColor =
    selectionType !== undefined ? selectionBackgroundColor : undefined;
  const borderColor =
    selectionType === NodeSelectionType.Main
      ? customTheme.focusColor
      : "transparent";
  const opacity = isDragging && selectionType !== undefined ? 0.4 : 1.0;

  return {
    background: backgroundColor,
    borderLeft: `3px solid ${borderColor}`,
    opacity,
  };
};

const getSelectionMode = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (event.ctrlKey) return NodeSelectionMode.Multiple;
  if (event.shiftKey) return NodeSelectionMode.Range;
  return NodeSelectionMode.Single;
};

type NodeSelectionHandlerProps = {
  children?: React.ReactNode;
  node: INode<ITemplateRevisionSlot>;
};
function NodeSelectionHandler({ children, node }: NodeSelectionHandlerProps) {
  const selectionHandlerRef = useRef<HTMLDivElement>(null);
  const {
    nodeSelection,
    nodeDragState,
    getNextNode,
    getNextNonSubLevelNode,
    toggleNodeSelection,
    selectIfNotSelected,
    applyRangeSelection,
  } = useTemplateEditStructureNodeManager();
  const {
    focusedNodeIdRef,
    rangeStartNodeIdRef,
    indexableNodeIdRef,
    focusNode,
    blurNode,
    setRangeStartNodeId,
    setIndexableNode,
  } = useNodeSelectionManager();
  useObserver(nodeSelection.observable);
  useObserver(nodeDragState.observable);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isFocusedElement =
      document.activeElement === selectionHandlerRef.current;
    if (event.key !== keyCodes.TAB && isFocusedElement) event.preventDefault();

    const currentSelectionMode = getSelectionMode(event);
    if (
      currentSelectionMode === NodeSelectionMode.Range &&
      event.key !== keyCodes.SHIFT
    )
      setRangeStartNodeId(node.id);

    if (event.key === keyCodes.DOWN || event.key === keyCodes.UP) {
      const relativePosition =
        event.key === keyCodes.DOWN
          ? RelativeNodePosition.Below
          : RelativeNodePosition.Above;
      const skipSubLevelNodes =
        currentSelectionMode === NodeSelectionMode.Range; // Range selection will select the whole group, so no need to navigate to sub-nodes
      const nextNode = skipSubLevelNodes
        ? getNextNonSubLevelNode(node, relativePosition)
        : getNextNode(node, relativePosition);
      if (nextNode) {
        focusNode(nextNode.id);

        if (currentSelectionMode === NodeSelectionMode.Multiple) {
          setRangeStartNodeId(undefined);
        }

        if (currentSelectionMode === NodeSelectionMode.Range) {
          if (node.id === rangeStartNodeIdRef.current)
            nodeSelection.selections.clear();
          const isCurrentNodeSelected =
            nodeSelection.selections.isMainSelection(nextNode.id);
          const nodeToToggle = isCurrentNodeSelected ? node.id : nextNode.id;
          selectIfNotSelected(node.id, true);
          toggleNodeSelection(nodeToToggle, true);
        }

        if (currentSelectionMode === NodeSelectionMode.Single) {
          nodeSelection.selections.clear();
          toggleNodeSelection(nextNode.id, false);
        }
      }
    }

    if (
      event.key === keyCodes.SPACE &&
      currentSelectionMode === NodeSelectionMode.Multiple
    ) {
      setRangeStartNodeId(undefined);
      toggleNodeSelection(node.id, true);
    }

    if (event.key === keyCodes.ESCAPE) {
      nodeSelection.selections.clear();
      nodeSelection.observable.update();
      blurNode(node.id);
      setTimeout(() => {
        selectionHandlerRef.current?.blur();
      }, 0);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClicked = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.shiftKey) {
      const rangeStartId = rangeStartNodeIdRef.current || node.id;
      applyRangeSelection(rangeStartId, node.id);
    } else {
      toggleNodeSelection(node.id, event.ctrlKey);
      focusNode(node.id);
      setRangeStartNodeId(node.id, true);
    }
  };

  useEffect(() => {
    setIndexableNode(node.id);
    if (node.id === focusedNodeIdRef.current) {
      setTimeout(() => {
        selectionHandlerRef.current?.focus();
      }, 0);
    }
  });

  useEffect(() => {
    selectionHandlerRef.current!.onfocus = () => {
      focusNode(node.id);
    };
    selectionHandlerRef.current!.onblur = () => {
      blurNode(node.id);
    };
    return () => {
      setIndexableNode(node.id, true);
    };
  }, []);

  const style = getSelectionStyle(
    node.id,
    nodeSelection,
    nodeDragState.isDragging
  );
  const tabIndex = indexableNodeIdRef.current === node.id ? 0 : -1;
  return (
    <div
      role="gridcell"
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      ref={selectionHandlerRef}
      style={style}
      className={styles}
      onClick={onClicked}
    >
      {children}
    </div>
  );
}

export default NodeSelectionHandler;
