import { MaybeDrafted } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { EMPTY_GUID, ROOT_NODE_ID } from "consts/globals";
import _ from "lodash";
import { IPublishedClause } from "models/clauses";
import { IConstraintTemplateEditPanel } from "models/constraints";
import { RelativeNodePosition, INode, INodeTree } from "models/node";
import {
  ISlotConstraint,
  ISlotPositioningTarget,
  ISlotTree,
  ITemplateRevisionSlot,
  ITemplateRevisionSlotItem,
} from "models/slot";
import { v1 as uuidv1 } from "uuid";
import { calculateSlotPositions } from "./slotPositionCalculator";

export const isSlotGroup = (slot: ITemplateRevisionSlot) =>
  slot.partId === EMPTY_GUID && slot.partName === "";

const getUnmovedSlotSiblingId = (
  target: ISlotPositioningTarget,
  slotsToMove: ITemplateRevisionSlot[]
) => {
  const { targetSlotGroup, targetLocation } = target;
  const positionAbove = targetLocation!.position === RelativeNodePosition.Above;
  let currentIndex = targetSlotGroup.findIndex(
    (s) => s.id === targetLocation!.slotId
  );
  while (currentIndex > 0 && currentIndex < targetSlotGroup.length) {
    const currentSlotId = targetSlotGroup[currentIndex].id;
    if (!slotsToMove.find((s) => s.id === currentSlotId)) return currentSlotId;
    currentIndex = positionAbove ? currentIndex - 1 : currentIndex + 1;
  }

  return targetSlotGroup[positionAbove ? 0 : targetSlotGroup.length - 1];
};

const getInsertIndex = (
  target: ISlotPositioningTarget,
  baseSlots: ITemplateRevisionSlot[],
  slotsToMove: ITemplateRevisionSlot[]
) => {
  const { targetLocation } = target;
  if (!targetLocation) {
    return 0;
  }

  const targetSlotIndex = baseSlots.findIndex(
    (s) => s.id === targetLocation.slotId
  );
  if (targetSlotIndex !== -1) {
    return targetLocation.position === RelativeNodePosition.Below
      ? targetSlotIndex + 1
      : targetSlotIndex;
  }

  const unMovedSlotSiblingId = getUnmovedSlotSiblingId(target, slotsToMove);
  const unMovedSlotSiblingIndex = baseSlots.findIndex(
    (s) => s.id === unMovedSlotSiblingId
  );
  return targetLocation.position === RelativeNodePosition.Above
    ? unMovedSlotSiblingIndex + 1
    : unMovedSlotSiblingIndex;
};

export const getAppliedRepositionSlotGroup = (
  slotsToMove: ITemplateRevisionSlot[],
  target: ISlotPositioningTarget
): ITemplateRevisionSlot[] => {
  const { targetSlotGroup } = target;
  const clonedSlotGroup = _.cloneDeep(targetSlotGroup);
  const slotsToMoveIds = slotsToMove.map((s) => s.id);
  const baseSlots = clonedSlotGroup.filter(
    (s) => !slotsToMoveIds.includes(s.id)
  ); // remove slots that are being moved already present
  const clonedSlotsToMove = _.cloneDeep(slotsToMove);

  // If no target location is provided, just assume we are inserting at the first slot (handle cases where insertion point has no slots)
  const insertIndex = getInsertIndex(target, baseSlots, slotsToMove);
  return calculateSlotPositions(baseSlots, clonedSlotsToMove, insertIndex);
};

export const getSlotsFromClauses = (
  clauses: IPublishedClause[],
  parentSlotId: string
): ITemplateRevisionSlot[] =>
  clauses.map((c) => ({
    position: 0,
    id: c.key,
    partId: c.key,
    partName: c.name,
    category: c.category,
    constraints: [],
    etag: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    parentSlotId,
    length: 0,
    name: "", // Not a slot group so this will be empty string
  }));

export const getDefaultSlotGroup = (
  parentSlotId: string,
  constraints: ISlotConstraint[]
): ITemplateRevisionSlot => ({
  length: 0,
  position: 0,
  id: uuidv1(),
  partId: EMPTY_GUID, // API requires it to be empty GUID if its not a clause/part slot
  partName: "",
  category: "",
  name: "", // User will provide name after slot group has been created
  etag: "",
  createdBy: "",
  createdDate: "",
  modifiedBy: "",
  modifiedDate: "",
  constraints,
  parentSlotId,
});

export const getNextInsertLocationInfo = (
  nodeToInsert: INode<ITemplateRevisionSlot>,
  nextNode: INode<ITemplateRevisionSlot> | undefined,
  direction: RelativeNodePosition,
  nodeTree: INodeTree<ITemplateRevisionSlot>
): ISlotPositioningTarget | undefined => {
  if (nextNode?.id === ROOT_NODE_ID) return undefined;

  // Last node in group and move out of group
  const isInGroup =
    nodeToInsert.parentId && nodeToInsert.parentId !== ROOT_NODE_ID;
  const siblingNodes = nodeTree.childNodeMappings[nodeToInsert.parentId!];
  const lastNodeInGroupId = siblingNodes[siblingNodes.length - 1];
  if (
    direction === RelativeNodePosition.Below &&
    isInGroup &&
    lastNodeInGroupId === nodeToInsert.id
  ) {
    const parentNode = nodeTree.nodes[nodeToInsert.parentId!];
    const targetSlotGroupIds =
      nodeTree.childNodeMappings[parentNode.parentId!] || [];
    const targetSlotGroup = targetSlotGroupIds.map(
      (id) => nodeTree.nodes[id].content!
    );
    return {
      parentSlotId: parentNode.parentId!,
      targetSlotGroup,
      targetLocation: { slotId: parentNode.id, position: direction },
    };
  }

  // Next Node is slot group and not under the group already
  if (
    nextNode &&
    isSlotGroup(nextNode.content!) &&
    nodeToInsert.parentId !== nextNode.id
  ) {
    const childNodeIds = nodeTree.childNodeMappings[nextNode.id];
    const relativePosition =
      direction === RelativeNodePosition.Above
        ? RelativeNodePosition.Below
        : RelativeNodePosition.Above;
    const targetSlotIndex =
      direction === RelativeNodePosition.Above && childNodeIds
        ? childNodeIds.length - 1
        : 0;
    const targetLocation = !childNodeIds
      ? undefined
      : { slotId: childNodeIds[targetSlotIndex], position: relativePosition };
    const targetSlotGroup =
      childNodeIds?.map((id) => nodeTree.nodes[id].content!) || [];
    return { parentSlotId: nextNode.id, targetSlotGroup, targetLocation };
  }

  // Next Node is node under a different parent (direction must be up)
  if (
    nextNode &&
    nextNode.parentId !== nodeToInsert.parentId &&
    nodeToInsert.parentId !== nextNode.id
  ) {
    const childNodeIds = nodeTree.childNodeMappings[nextNode.parentId!];
    const targetSlotGroup = childNodeIds.map(
      (id) => nodeTree.nodes[id].content!
    );
    return {
      parentSlotId: nextNode.parentId!,
      targetSlotGroup,
      targetLocation: {
        slotId: nextNode.id,
        position: RelativeNodePosition.Below,
      },
    };
  }

  const childNodeIds = nextNode
    ? nodeTree.childNodeMappings[nextNode.parentId!]
    : [];
  const targetSlotGroup = childNodeIds.map((id) => nodeTree.nodes[id].content!);
  return !nextNode
    ? undefined
    : {
        parentSlotId: nextNode.parentId!,
        targetSlotGroup,
        targetLocation: { slotId: nextNode.id, position: direction },
      };
};

export const isSlotConstraintEqual = (
  constraint1: ISlotConstraint,
  constraint2: ISlotConstraint
) => {
  const constraint1Clone = _.cloneDeep(constraint1);
  const constraint2Clone = _.cloneDeep(constraint2);

  // Comma separated constraint values could come in different orders
  constraint1Clone.value = constraint1.value
    .split(",")
    .map((s) => s.trim())
    .sort()
    .join(",");
  constraint2Clone.value = constraint2.value
    .split(",")
    .map((s) => s.trim())
    .sort()
    .join(",");

  // Only need to check the the following properties as the rest of the properties are for display purposes only
  const keysEqual = constraint1Clone.key === constraint2Clone.key;
  const operationEqual =
    constraint1Clone.operator === constraint2Clone.operator;
  const valueEqual = constraint1Clone.value === constraint2Clone.value;

  return keysEqual && operationEqual && valueEqual;
};

export const getCommonConstraints = (
  slots: ITemplateRevisionSlot[]
): ISlotConstraint[] => {
  if (slots.length === 1) return slots[0].constraints;

  const commonConstraints: ISlotConstraint[] = [];
  const clonedSlots = _.cloneDeep(slots);
  const baseSlot = clonedSlots.shift();
  baseSlot!.constraints.forEach((constraint) => {
    const isCommonConstraint = clonedSlots.every(
      (slot) =>
        !!slot.constraints.find((c) => isSlotConstraintEqual(c, constraint))
    );
    if (isCommonConstraint) commonConstraints.push(constraint);
  });

  return commonConstraints;
};

export const removeConstraints = (
  constraints: ISlotConstraint[],
  constraintsToRemove: ISlotConstraint[]
) => {
  constraintsToRemove.forEach((constraintToRemove) => {
    const index = constraints.findIndex((c) =>
      isSlotConstraintEqual(c, constraintToRemove)
    );
    constraints.splice(index, 1);
  });
};

export const deleteSlotTree = (slotTree: MaybeDrafted<ISlotTree>, slotId: string) => {
  const childNodes = slotTree.childNodeMappings[slotId] || [];
  childNodes.forEach(nodeId => { deleteSlotTree(slotTree, nodeId); });
  // eslint-disable-next-line no-param-reassign
  delete slotTree.nodes[slotId];
};

export const setSlotLevels = (obj: ITemplateRevisionSlotItem[]) => {
  const tmpSlots = [...obj];

  const setSlots = (item: ITemplateRevisionSlotItem[], level: number) => {
    const slots = [...item];

    slots.forEach((element: ITemplateRevisionSlotItem) => {
      const tmpEl = element;
      tmpEl.level = level;
      tmpEl.isCollapsed = true;
      if (tmpEl.slots.length > 0) {
        setSlots(tmpEl.slots as ITemplateRevisionSlotItem[], level + 1);
      }
    });
  };

  setSlots(tmpSlots, 0);

  return tmpSlots;
};

export const setCollapsed = (
  obj: ITemplateRevisionSlot[],
  collapseChildren: boolean
) => {
  const slotObj = [...obj];
  const setCollapse = (
    item: ITemplateRevisionSlotItem[],
    _collapseChildren: boolean
  ) => {
    const SlotList = [...item];
    SlotList.forEach((element: ITemplateRevisionSlotItem) => {
      const tmpEl = element;
      tmpEl.isCollapsed = collapseChildren;
      if (tmpEl.slots.length > 0) {
        setCollapse(
          tmpEl.slots as ITemplateRevisionSlotItem[],
          _collapseChildren
        );
      }
    });
  };

  setCollapse(slotObj as ITemplateRevisionSlotItem[], collapseChildren);
  return slotObj;
};

export const getFlatlist = (nested: ITemplateRevisionSlot[], what?: String) => {
  // const flat: (string | ITemplateRevisionSlotItem)[] = [];
  const flat: any[] = [];
  const handleFlat = (array: ITemplateRevisionSlotItem[]) => {
    let counter = 0;
    while (counter < array.length) {
      const val = array[counter];
      if (val.slots.length > 0) {
        flat.push(what === "full" ? val : val.id);
        handleFlat(val.slots as ITemplateRevisionSlotItem[]);
      } else {
        flat.push(what === "full" ? val : val.id);
      }
      counter += 1;
    }
  };
  handleFlat(nested as ITemplateRevisionSlotItem[]);
  return flat;
};

export const getAllNonPublishedClauses = (slots: ITemplateRevisionSlot[], publishedClauses: IPublishedClause[]) => {
  const clauseSlots = slots.filter(s => !isSlotGroup(s));
  const publishedClauseIds = new Set<string>(publishedClauses.map(c => c.key))
  const nonPublishedClauses = clauseSlots.filter(cs => !publishedClauseIds.has(cs.partId));

  return nonPublishedClauses;
};

export const getAllNonExistingConstraints = (slots: ITemplateRevisionSlot[], existingConstraints: IConstraintTemplateEditPanel[]) => {
  const allConstraints: ISlotConstraint[] = [];
  slots.forEach(s => { allConstraints.push(...s.constraints) });
  const existingConstraintNames = new Set<string>(existingConstraints.map(c => c.name));
  const nonExistingConstraintNames = allConstraints.filter(sc => !existingConstraintNames.has(sc.key));

  return nonExistingConstraintNames;
};