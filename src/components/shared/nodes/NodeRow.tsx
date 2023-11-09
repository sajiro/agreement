import { useTemplateEditStructureNodeManager } from "components/templateEdit/structure/TemplateEditStructureNodeManager";
import customTheme from "helpers/customTheme";
import { getAdditionalNodeIndentWidth } from "helpers/node";
import useNodePositioner from "hooks/template/edit/useNodePositioner";
import useObserver from "hooks/useObserver";
import { INode } from "models/node";
import { ITemplateRevisionSlot } from "models/slot";
import { CSSProperties, ForwardedRef, forwardRef } from "react";
import { DragPreviewImage } from "react-dnd";

const DropSection = forwardRef(
  (
    props: {
      verticalPosition: { top?: number; bottom?: number };
      isDragging: boolean;
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const position: CSSProperties = {
      position: "absolute",
      left: 0,
      right: 0,
      ...props.verticalPosition,
    };
    const sectionStyles: CSSProperties = {
      height: "50%",
      zIndex: props.isDragging ? 10 : -1,
      opacity: 0,
      ...position,
    };
    return <div ref={ref} style={sectionStyles} />;
  }
);

function DragIndicator({ depth, show }: { depth: number; show: boolean }) {
  const size: CSSProperties = {
    height: 3,
    width: `calc(100% - ${getAdditionalNodeIndentWidth(depth)}px)`,
  };
  const marginLeft = getAdditionalNodeIndentWidth(depth);
  const background = show ? customTheme.focusColor : "transparent";
  const indicatorStyles: CSSProperties = {
    zIndex: 1,
    position: "absolute",
    background,
    marginLeft,
    ...size,
  };
  return <div style={indicatorStyles} />;
}

type NodeRowBordersProps = {
  children?: React.ReactNode;
  depth: number;
  isOverTop: boolean;
  isOverBottom: boolean;
  isNodeGroup: boolean;
};
function NodeRowBorders({
  children,
  isOverTop,
  isOverBottom,
  depth,
  isNodeGroup,
}: NodeRowBordersProps) {
  // If Node is a Group, drop zone below it is to insert inside group
  const bottomIndicatorDepth = isNodeGroup ? depth + 1 : depth;

  return (
    <>
      <DragIndicator depth={depth} show={isOverTop} />
      {children}
      <div
        style={{
          height: 1,
          width: "100%",
          background: `${customTheme.divBorderColor}`,
          display: !(isOverTop || isOverBottom) ? "hidden" : undefined,
        }}
      />
      <DragIndicator depth={bottomIndicatorDepth} show={isOverBottom} />
    </>
  );
}

type NodeRowProps = {
  children?: React.ReactNode;
  depth: number;
  node: INode<ITemplateRevisionSlot>;
  isNodeGroup: boolean;
  disableActions: boolean;
};
function NodeRow({
  depth,
  node,
  isNodeGroup,
  disableActions,
  children,
}: NodeRowProps) {
  const { nodeDragState } = useTemplateEditStructureNodeManager();
  const { dragInfo, dropTopInfo, dropBottomInfo } = useNodePositioner(
    node,
    isNodeGroup,
    disableActions
  );
  useObserver(nodeDragState.observable);

  const { isDragging } = nodeDragState;
  return (
    <NodeRowBorders
      depth={depth}
      isNodeGroup={isNodeGroup}
      isOverTop={dropTopInfo.isOver}
      isOverBottom={dropBottomInfo.isOver}
    >
      <div ref={dragInfo.drag}>
        <DragPreviewImage connect={dragInfo.preview} src="" />
        <DropSection
          ref={dropTopInfo.drop}
          verticalPosition={{ top: 0 }}
          isDragging={isDragging}
        />
        {children}
        <DropSection
          ref={dropBottomInfo.drop}
          verticalPosition={{ bottom: 0 }}
          isDragging={isDragging}
        />
      </div>
    </NodeRowBorders>
  );
}

export default NodeRow;
