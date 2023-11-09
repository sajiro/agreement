import { useTemplateEditStructureNodeManager } from "components/templateEdit/structure/TemplateEditStructureNodeManager";
import { useTemplateStructureEditor } from "hooks/template/mutation/useTemplateStructureEditor";
import { IPublishedClause } from "models/clauses";
import { RelativeNodePosition, IDragDropItem, INode, NodeDragDropObjectType } from "models/node";
import { ISlotPositioningTarget, ITemplateRevisionSlot } from "models/slot";
import { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

const useNodeDropLocation = (
  node: INode<ITemplateRevisionSlot>,
  position: RelativeNodePosition,
  isNodeGroup: boolean,
  getSelectedNodes: () => INode<ITemplateRevisionSlot>[],
  getChildNodes: (nodeId: string) => INode<ITemplateRevisionSlot>[],
  repositionSlots: (slotsToMove: ITemplateRevisionSlot[], target: ISlotPositioningTarget) => void,
  createClauseSlots: (clauses: IPublishedClause[], target: ISlotPositioningTarget) => void
) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [NodeDragDropObjectType.Node.toString(), NodeDragDropObjectType.Clause.toString()],
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    drop: (item: IDragDropItem) => {
      const insertInNodeGroup = position === RelativeNodePosition.Below && isNodeGroup;
      const parentSlotId = insertInNodeGroup ? node.id : node.parentId!;
      const targetSlotGroup = getChildNodes(parentSlotId).map(n => n.content!);
      const targetLocation = insertInNodeGroup ? undefined : { slotId: node.id, position }; // Force repositionSlots() function to insert as node group's 1st child 
      const positionTarget: ISlotPositioningTarget = { parentSlotId, targetLocation, targetSlotGroup };

      if (item.type === NodeDragDropObjectType.Node) {
        const slotsToMove = getSelectedNodes().map(n => n.content!);
        repositionSlots(slotsToMove, positionTarget);
      } else {
        const clauses = item.item as IPublishedClause[];
        createClauseSlots(clauses, positionTarget);
      }
    }
  }), [node, position, repositionSlots, createClauseSlots, getChildNodes, getSelectedNodes]);

  return { isOver, drop };
};

const useNodeDrag = (
  node: INode<ITemplateRevisionSlot>,
  selectIfNotSelected: (nodeId: string, isMultiSelect: boolean) => void,
  toggleDragState: (isDragging: boolean) => void,
  canDrag: boolean
) => {
  const [{ isDragging }, drag, preview] = useDrag<IDragDropItem, IDragDropItem, { isDragging: boolean; }>(() => ({
    type: NodeDragDropObjectType.Node.toString(),
    item: { type: NodeDragDropObjectType.Node, item: node },
    canDrag: () => canDrag,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    end: () => { toggleDragState(false); }
  }), [node, canDrag, toggleDragState]);

  useEffect(() => {
    if (isDragging) {
      selectIfNotSelected(node.id, false);
      toggleDragState(isDragging);
    }
  }, [isDragging, selectIfNotSelected, toggleDragState]);

  return { drag, preview };
};

const useNodePositioner = (node: INode<ITemplateRevisionSlot>, isNodeGroup: boolean, disable: boolean) => {
  const { repositionSlots, createClauseSlots } = useTemplateStructureEditor();
  const { toggleDragState, selectIfNotSelected, getSelectedNodes, getChildNodes } = useTemplateEditStructureNodeManager();
  const dragInfo = useNodeDrag(node, selectIfNotSelected, toggleDragState, !disable);
  const dropTopInfo = useNodeDropLocation(node, RelativeNodePosition.Above, isNodeGroup, getSelectedNodes, getChildNodes, repositionSlots, createClauseSlots);
  const dropBottomInfo = useNodeDropLocation(node, RelativeNodePosition.Below, isNodeGroup, getSelectedNodes, getChildNodes, repositionSlots, createClauseSlots);

  useEffect(() => {
    dragInfo.preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return { dragInfo, dropTopInfo, dropBottomInfo };
};

export default useNodePositioner;