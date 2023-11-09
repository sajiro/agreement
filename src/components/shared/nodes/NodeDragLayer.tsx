import { useTemplateEditStructureNodeManager } from "components/templateEdit/structure/TemplateEditStructureNodeManager";
import customTheme from "helpers/customTheme";
import useObserver from "hooks/useObserver";
import { IPublishedClause } from "models/clauses";
import { INode, NodeDragDropObjectType } from "models/node";
import { ITemplateRevisionSlot } from "models/slot";
import { useDragLayer } from "react-dnd";

const PREVIEW_IMAGE_OFFSET_ADJUSTMENT = 30; // Add additional gap between preview image and cursor

const getDisplayTitle = (
  dragItemType: NodeDragDropObjectType,
  items: any[]
) => {
  if (dragItemType === null || items?.length === 0) return null;

  if (dragItemType === NodeDragDropObjectType.Clause) {
    const clauses = items as IPublishedClause[];
    const title =
      clauses.length > 1 ? `${clauses.length} Items` : clauses[0].name;
    return title;
  }

  const nodes = items as INode<ITemplateRevisionSlot>[];
  const firstNodeName = nodes[0].content!.partName || nodes[0].content!.name;
  const title = nodes.length > 1 ? `${nodes.length} Items` : firstNodeName;
  return title;
};

function NodeDragLayer() {
  const { isDragging, clientOffset, item, itemType } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      clientOffset: monitor.getClientOffset(),
    })
  );

  const { nodeSelection, getSelectedNodes } =
    useTemplateEditStructureNodeManager();
  useObserver(nodeSelection.observable);

  const selectedNodes = getSelectedNodes();
  const dragItemType = itemType as NodeDragDropObjectType;
  const dragItems =
    dragItemType === NodeDragDropObjectType.Clause ? item?.item : selectedNodes;
  const displayTitle = getDisplayTitle(dragItemType, dragItems);

  const xPosition = (clientOffset?.x || 0) + PREVIEW_IMAGE_OFFSET_ADJUSTMENT;
  const yPosition = (clientOffset?.y || 0) + PREVIEW_IMAGE_OFFSET_ADJUSTMENT;
  const transform = `translate(${xPosition}px, ${yPosition}px)`;

  return (
    <>
      {null}
      {isDragging && clientOffset && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            zIndex: 100,
            left: 0,
            top: 0,
            height: "100%",
          }}
        >
          <div
            style={{
              transform,
              WebkitTransform: transform,
              background: customTheme.focusColor,
              color: customTheme.white,
              padding: 8,
              zIndex: 10,
              position: "relative",
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayTitle}
          </div>
        </div>
      )}
    </>
  );
}

export default NodeDragLayer;
