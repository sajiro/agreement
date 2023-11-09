import { ROOT_NODE_ID } from "consts/globals";
import _ from "lodash";
import { ConstraintOperator } from "models/constraints";
import { RelativeNodePosition } from "models/node";
import { ISlotConstraint, ISlotPositioningTarget } from "models/slot";
import { getTestConstraint, getTestNode, getTestNodeTree, getTestSlot } from "test/nodeTreeUtils";
import { v1 as uuidv1 } from 'uuid';
import { getAppliedRepositionSlotGroup, getCommonConstraints, getNextInsertLocationInfo, isSlotConstraintEqual, removeConstraints } from "./slot";

const assertConstraintsEqual = (constraints1: ISlotConstraint[], constraints2: ISlotConstraint[]) => {
  constraints1.sort((a, b) => a.key.localeCompare(b.key));
  constraints2.sort((a, b) => a.key.localeCompare(b.key));
  expect(constraints1).toEqual(constraints2);
};

describe("getAppliedRepositionSlotGroup function", () => {

  test("reposition slots into empty template revision", () => {
    const slotsToMove = [
      getTestSlot(698, ROOT_NODE_ID),
      getTestSlot(238, uuidv1()),
      getTestSlot(53, uuidv1())
    ];
    const target: ISlotPositioningTarget = {
      parentSlotId: ROOT_NODE_ID,
      targetSlotGroup: []
    };
    const repositionedSlots = getAppliedRepositionSlotGroup(slotsToMove, target);

    expect(repositionedSlots.length).toEqual(slotsToMove.length);
    expect(repositionedSlots.map(s => s.id)).toEqual(slotsToMove.map(s => s.id));
  });

  test("reposition slots at same level", () => {
    const rootLevelSlots = [
      getTestSlot(1, ROOT_NODE_ID),
      getTestSlot(25, ROOT_NODE_ID), // targeting above this slot
      getTestSlot(26, ROOT_NODE_ID), // slot to move
      getTestSlot(58, ROOT_NODE_ID), // slot to move
      getTestSlot(83, ROOT_NODE_ID), 
      getTestSlot(164, ROOT_NODE_ID) // slot to move
    ];
    const slotsToMove = [rootLevelSlots[2], rootLevelSlots[3], rootLevelSlots[5]];    
    const target: ISlotPositioningTarget = {
      parentSlotId: ROOT_NODE_ID,
      targetSlotGroup: rootLevelSlots,
      targetLocation: { slotId: rootLevelSlots[1].id, position: RelativeNodePosition.Above }
    };

    const repositionedSlots = getAppliedRepositionSlotGroup(slotsToMove, target);

    expect(repositionedSlots.length).toEqual(rootLevelSlots.length);
    expect(repositionedSlots.map(s => s.id)).toEqual([
      rootLevelSlots[0].id,
      ...slotsToMove.map(s => s.id),
      rootLevelSlots[1].id,
      rootLevelSlots[4].id
    ]);
  });

  test("reposition slots all from different parents/slot groups", () => {
    const slotsToMove = [
      getTestSlot(567, uuidv1()),
      getTestSlot(982, uuidv1()),
      getTestSlot(354, uuidv1())
    ];

    const targetSlotGroupId = uuidv1();
    const targetSlotGroup = [
      getTestSlot(20, targetSlotGroupId),
      getTestSlot(75, targetSlotGroupId),
      getTestSlot(98, targetSlotGroupId),
      getTestSlot(134, targetSlotGroupId),
      getTestSlot(368, targetSlotGroupId)
    ];
    const target: ISlotPositioningTarget = {
      parentSlotId: targetSlotGroupId,
      targetSlotGroup,
      targetLocation: { slotId: targetSlotGroup[3].id, position: RelativeNodePosition.Below }
    };

    const repositionedSlots = getAppliedRepositionSlotGroup(slotsToMove, target);

    expect(repositionedSlots.length).toEqual(targetSlotGroup.length + slotsToMove.length);
    expect(repositionedSlots.map(s => s.id)).toEqual([
      targetSlotGroup[0].id,
      targetSlotGroup[1].id,
      targetSlotGroup[2].id,
      targetSlotGroup[3].id,
      ...slotsToMove.map(s => s.id),
      targetSlotGroup[4].id
    ]);
  });

  test("reposition slots with mix of different and same parents", () => {
    const targetSlotGroupId = uuidv1();
    const slotsToMove = [
      getTestSlot(567, uuidv1()),
      getTestSlot(34, targetSlotGroupId),
      getTestSlot(123, targetSlotGroupId),
      getTestSlot(123, uuidv1()),
    ];
    const targetSlotGroup = [
      getTestSlot(9, targetSlotGroupId),
      getTestSlot(19, targetSlotGroupId),
      slotsToMove[1],
      getTestSlot(66, targetSlotGroupId),
      getTestSlot(98, targetSlotGroupId),
      slotsToMove[2],
      getTestSlot(999, targetSlotGroupId)
    ];
    const target: ISlotPositioningTarget = {
      parentSlotId: targetSlotGroupId,
      targetSlotGroup,
      targetLocation: { slotId: targetSlotGroup[4].id, position: RelativeNodePosition.Above }
    };

    const repositionedSlots = getAppliedRepositionSlotGroup(slotsToMove, target);

    expect(repositionedSlots.length).toEqual(2 + targetSlotGroup.length);
    expect(repositionedSlots.map(s => s.id)).toEqual([
      targetSlotGroup[0].id,
      targetSlotGroup[1].id,
      targetSlotGroup[3].id,
      ...slotsToMove.map(s => s.id),
      targetSlotGroup[4].id,
      targetSlotGroup[6].id
    ]);
  });

});

describe("getNextInsertLocationInfo function", () => {

  test("next location at same level" , () => {
    const nodes = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      getTestNode(getTestSlot(2, ROOT_NODE_ID), 1, 2),
      getTestNode(getTestSlot(3, ROOT_NODE_ID), 1, 3),
      getTestNode(getTestSlot(4, ROOT_NODE_ID), 1, 4),
    ];
    const childNodeMappings = {
      [ROOT_NODE_ID]: nodes.map(n => n.id)
    };
    const nodeTree = getTestNodeTree(nodes, childNodeMappings);
    const nodeToInsert = nodes[1];
    const nextNode = nodes[2];

    const insertLocationInfo = getNextInsertLocationInfo(nodeToInsert, nextNode, RelativeNodePosition.Below, nodeTree);
    const { parentSlotId, targetSlotGroup, targetLocation } = insertLocationInfo!;

    expect(parentSlotId).toEqual(ROOT_NODE_ID);
    expect(targetSlotGroup.map(s => s.id)).toEqual(childNodeMappings[ROOT_NODE_ID]);
    expect(targetLocation!.slotId).toEqual(nextNode.id);
    expect(targetLocation!.position).toEqual(RelativeNodePosition.Below);
  });

  test("next location outside/above parent (with node above parent)", () => {
    const slotGroupNode = getTestNode(getTestSlot(2, ROOT_NODE_ID), 1, 2);
    const nodes = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      slotGroupNode,
      getTestNode(getTestSlot(3, slotGroupNode.id), 2, 3)
    ];
    const childNodeMappings = {
      [ROOT_NODE_ID]: [nodes[0].id, nodes[1].id],
      [slotGroupNode.id]: [nodes[2].id]
    };
    const nodeTree = getTestNodeTree(nodes, childNodeMappings);
    const nodeToInsert = nodes[2];
    const nextNode = nodes[1];

    const insertLocationInfo = getNextInsertLocationInfo(nodeToInsert, nextNode, RelativeNodePosition.Above, nodeTree);
    const { parentSlotId, targetSlotGroup, targetLocation } = insertLocationInfo!;

    expect(parentSlotId).toEqual(ROOT_NODE_ID);
    expect(targetSlotGroup.map(s => s.id)).toEqual(childNodeMappings[ROOT_NODE_ID]);
    expect(targetLocation!.slotId).toEqual(nextNode.id);
    expect(targetLocation!.position).toEqual(RelativeNodePosition.Above);
  });

  test("next location outside/below parent (with node below parent)", () => {
    const slotGroupNode = getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1);
    const nodes = [
      slotGroupNode,
      getTestNode(getTestSlot(2, slotGroupNode.id), 2, 2),
      getTestNode(getTestSlot(3, ROOT_NODE_ID), 1, 3),
    ];
    const childNodeMappings = {
      [ROOT_NODE_ID]: [nodes[0].id, nodes[2].id],
      [slotGroupNode.id]: [nodes[1].id]
    };
    const nodeTree = getTestNodeTree(nodes, childNodeMappings);
    const nodeToInsert = nodes[1];
    const nextNode = nodes[2];

    const insertLocationInfo = getNextInsertLocationInfo(nodeToInsert, nextNode, RelativeNodePosition.Below, nodeTree);
    const { parentSlotId, targetSlotGroup, targetLocation } = insertLocationInfo!;

    expect(parentSlotId).toEqual(ROOT_NODE_ID);
    expect(targetSlotGroup.map(s => s.id)).toEqual(childNodeMappings[ROOT_NODE_ID]);
    expect(targetLocation!.slotId).toEqual(slotGroupNode.id); // When moving out/below group, next node will be below the the slot group (NOT below the the next node)
    expect(targetLocation!.position).toEqual(RelativeNodePosition.Below);
  });

  test("next location outside/above parent (parent is first node)", () => {
    const slotGroupNode = getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1);
    const nodes = [
      slotGroupNode,
      getTestNode(getTestSlot(2, slotGroupNode.id), 2, 2)
    ];
    const childNodeMappings = {
      [ROOT_NODE_ID]: [nodes[0].id],
      [slotGroupNode.id]: [nodes[1].id]
    };
    const nodeTree = getTestNodeTree(nodes, childNodeMappings);
    const nodeToInsert = nodes[1];
    const nextNode = nodes[0];

    const insertLocationInfo = getNextInsertLocationInfo(nodeToInsert, nextNode, RelativeNodePosition.Above, nodeTree);
    const { parentSlotId, targetSlotGroup, targetLocation } = insertLocationInfo!;

    expect(parentSlotId).toEqual(ROOT_NODE_ID);
    expect(targetSlotGroup.map(s => s.id)).toEqual(childNodeMappings[ROOT_NODE_ID]);
    expect(targetLocation!.slotId).toEqual(nextNode.id);
    expect(targetLocation!.position).toEqual(RelativeNodePosition.Above);
  });

  test("next location outside/below parent (parent is last node)", () => {
    const slotGroupNode = getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1);
    const nodes = [
      slotGroupNode,
      getTestNode(getTestSlot(2, slotGroupNode.id), 2, 2)
    ];
    const childNodeMappings = {
      [ROOT_NODE_ID]: [nodes[0].id],
      [slotGroupNode.id]: [nodes[1].id]
    };
    const nodeTree = getTestNodeTree(nodes, childNodeMappings);
    const nodeToInsert = nodes[1];
    const nextNode = undefined;

    const insertLocationInfo = getNextInsertLocationInfo(nodeToInsert, nextNode, RelativeNodePosition.Below, nodeTree);
    const { parentSlotId, targetSlotGroup, targetLocation } = insertLocationInfo!;

    expect(parentSlotId).toEqual(ROOT_NODE_ID);
    expect(targetSlotGroup.map(s => s.id)).toEqual(childNodeMappings[ROOT_NODE_ID]);
    expect(targetLocation!.slotId).toEqual(slotGroupNode.id); // When moving out/below group, next node will be below the the slot group
    expect(targetLocation!.position).toEqual(RelativeNodePosition.Below);
  });

  test("no next location above", () => {
    const nodes = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      getTestNode(getTestSlot(2, ROOT_NODE_ID), 1, 2),
      getTestNode(getTestSlot(3, ROOT_NODE_ID), 1, 3)
    ];
    const childNodeMappings = {
      [ROOT_NODE_ID]: nodes.map(n => n.id)
    };
    const nodeTree = getTestNodeTree(nodes, childNodeMappings);
    const nodeToInsert = nodes[0];
    const nextNode = undefined;

    const insertLocationInfo = getNextInsertLocationInfo(nodeToInsert, nextNode, RelativeNodePosition.Above, nodeTree);

    expect(insertLocationInfo).toEqual(undefined);
  });

  test("no next location below", () => {
    const nodes = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      getTestNode(getTestSlot(2, ROOT_NODE_ID), 1, 2),
      getTestNode(getTestSlot(3, ROOT_NODE_ID), 1, 3)
    ];
    const childNodeMappings = {
      [ROOT_NODE_ID]: nodes.map(n => n.id)
    };
    const nodeTree = getTestNodeTree(nodes, childNodeMappings);
    const nodeToInsert = nodes[2];
    const nextNode = undefined;

    const insertLocationInfo = getNextInsertLocationInfo(nodeToInsert, nextNode, RelativeNodePosition.Below, nodeTree);

    expect(insertLocationInfo).toEqual(undefined);
  });

});

describe("isSlotConstraintEqual function", () => {
  
  test("constraints exactly the same", () => {
    const constraint: ISlotConstraint = getTestConstraint("test", ConstraintOperator.Exclude, "test1,test2");

    const isEqual = isSlotConstraintEqual(constraint, constraint);

    expect(isEqual).toBe(true);
  });

  test("constraints the same (value ordering different)", () => {
    const constraintKey = "test";
    const constraintOperator = ConstraintOperator.Exclude;
    const constraint1 = getTestConstraint(constraintKey, constraintOperator, "test1,test2,test3");
    const constraint2 = getTestConstraint(constraintKey, constraintOperator, "test2,test1,test3");

    const isEqual = isSlotConstraintEqual(constraint1, constraint2);

    expect(isEqual).toBe(true);
  });

  test("constraints the same (extra spaces after separator)", () => {
    const constraintKey = "test";
    const constraintOperator = ConstraintOperator.Exclude;
    const constraint1 = getTestConstraint(constraintKey, constraintOperator, "test1,test2,test3");
    const constraint2 = getTestConstraint(constraintKey, constraintOperator, "test1, test2, test3");

    const isEqual = isSlotConstraintEqual(constraint1, constraint2);

    expect(isEqual).toBe(true);
  });

  test("constraints different (keys different)", () => {
    const constraintOperator = ConstraintOperator.Exclude;
    const constraintValue = "test1,test2,test3";
    const constraint1 = getTestConstraint("key1", constraintOperator, constraintValue);
    const constraint2 = getTestConstraint("test", constraintOperator, constraintValue);

    const isEqual = isSlotConstraintEqual(constraint1, constraint2);

    expect(isEqual).toBe(false);
  });

  test("constraints different (operator different)", () => {
    const constraintKey = "test";
    const constraintValue = "test1,test2,test3";
    const constraint1 = getTestConstraint(constraintKey, ConstraintOperator.Include, constraintValue);
    const constraint2 = getTestConstraint(constraintKey, ConstraintOperator.Exclude, constraintValue);

    const isEqual = isSlotConstraintEqual(constraint1, constraint2);

    expect(isEqual).toBe(false);
  });

  test("constraints different (values different)", () => {
    const constraintKey = "test";
    const constraintOperator = ConstraintOperator.Exclude;
    const constraint1 = getTestConstraint(constraintKey, constraintOperator, "va1,val2,val3");
    const constraint2 = getTestConstraint(constraintKey, constraintOperator, "test1,test2,test3,test4");

    const isEqual = isSlotConstraintEqual(constraint1, constraint2);

    expect(isEqual).toBe(false);
  });

});

// Specific constraint equality check test cases are handled by unit tests for isSlotConstraintEqual()
describe("getCommonConstraints function", () => {

  test("common constraints", () => {
    const commonConstraints: ISlotConstraint[] = [
      getTestConstraint("Constraint 1", ConstraintOperator.Include, "value1,value2"),
      getTestConstraint("Constraint 2", ConstraintOperator.Include, "true"),
      getTestConstraint("Constraint 3", ConstraintOperator.Exclude, "val_1,val_2,val_3")
    ];
    const slots = [
      getTestSlot(1, ROOT_NODE_ID, commonConstraints),
      getTestSlot(2, ROOT_NODE_ID, [...commonConstraints, getTestConstraint("test", ConstraintOperator.Exclude, "false")]),
      getTestSlot(2, ROOT_NODE_ID, [getTestConstraint("test2", ConstraintOperator.Exclude, "test1, test2, test5"), ...commonConstraints])
    ];

    const extractedCommonConstraints = getCommonConstraints(slots);

    assertConstraintsEqual(commonConstraints, extractedCommonConstraints);
  });

  test("common constraints (single slot with constraints)", () => {
    const commonConstraints: ISlotConstraint[] = [
      getTestConstraint("Constraint 1", ConstraintOperator.Include, "value1,value2"),
      getTestConstraint("Constraint 2", ConstraintOperator.Include, "true"),
      getTestConstraint("Constraint 3", ConstraintOperator.Exclude, "val_1,val_2,val_3")
    ];
    const slots = [
      getTestSlot(1, ROOT_NODE_ID, commonConstraints)
    ];

    const extractedCommonConstraints = getCommonConstraints(slots);

    assertConstraintsEqual(commonConstraints, extractedCommonConstraints);
  });

  test("no common constraints", () => {
    const slots = [
      getTestSlot(1, ROOT_NODE_ID, [
        getTestConstraint("key1", ConstraintOperator.Include, "test1,test2"),
        getTestConstraint("key2", ConstraintOperator.Include, "val1,val2"),
      ]),
      getTestSlot(2, ROOT_NODE_ID, [
        getTestConstraint("test1", ConstraintOperator.Include, "true,false"),
        getTestConstraint("test2", ConstraintOperator.Include, "none"),
      ]),
      getTestSlot(2, ROOT_NODE_ID, [
        getTestConstraint("constraint1", ConstraintOperator.Include, "56,89"),
        getTestConstraint("constraint2", ConstraintOperator.Include, "val,value,test,1,654"),
      ])
    ];

    const extractedCommonConstraints = getCommonConstraints(slots);

    assertConstraintsEqual([], extractedCommonConstraints);
  });

  test("no common constraints (mix of empty constraints and multiple constraints)", () => {
    const commonConstraints: ISlotConstraint[] = [
      getTestConstraint("Constraint 1", ConstraintOperator.Include, "value1,value2"),
      getTestConstraint("Constraint 2", ConstraintOperator.Include, "true"),
      getTestConstraint("Constraint 3", ConstraintOperator.Exclude, "val_1,val_2,val_3")
    ];
    const slots = [
      getTestSlot(1, ROOT_NODE_ID, commonConstraints),
      getTestSlot(2, ROOT_NODE_ID, commonConstraints),
      getTestSlot(2, ROOT_NODE_ID, [])
    ];

    const extractedCommonConstraints = getCommonConstraints(slots);

    assertConstraintsEqual([], extractedCommonConstraints);
  });

});

// Specific constraint equality check test cases are handled by unit tests for isSlotConstraintEqual()
describe("removeConstraints function", () => {
  
  test("remove sub-set of constraints", () => {
    const commonConstraints = [
      getTestConstraint("Constraint 1", ConstraintOperator.Include, "value1,value2"),
      getTestConstraint("Constraint 2", ConstraintOperator.Include, "true"),
      getTestConstraint("Constraint 3", ConstraintOperator.Exclude, "val_1,val_2,val_3")
    ];
    const nonCommonConstraints = [
      getTestConstraint("key1", ConstraintOperator.Include, "test1,test2"),
      getTestConstraint("key2", ConstraintOperator.Include, "val1,val2"),
    ];
    const allConstraints = [
      ...commonConstraints,
      ...nonCommonConstraints
    ];

    removeConstraints(allConstraints, commonConstraints);

    expect(allConstraints.length).toEqual(2);
    assertConstraintsEqual(nonCommonConstraints, allConstraints);
  });

  test("remove all constraints", () => {
    const commonConstraints = [
      getTestConstraint("Constraint 1", ConstraintOperator.Include, "value1,value2"),
      getTestConstraint("Constraint 2", ConstraintOperator.Include, "true"),
      getTestConstraint("Constraint 3", ConstraintOperator.Exclude, "val_1,val_2,val_3")
    ];
    const allConstraints = [...commonConstraints];

    removeConstraints(allConstraints, commonConstraints);

    expect(allConstraints.length).toEqual(0);
    assertConstraintsEqual([], allConstraints);
  });

  test("remove no constraints", () => {
    const allConstraints = [
      getTestConstraint("Constraint 1", ConstraintOperator.Include, "value1,value2"),
      getTestConstraint("Constraint 2", ConstraintOperator.Include, "true"),
      getTestConstraint("Constraint 3", ConstraintOperator.Exclude, "val_1,val_2,val_3")
    ];
    const allConstraintsClone = [...allConstraints];

    removeConstraints(allConstraints, []);

    expect(allConstraints.length).toEqual(3);
    assertConstraintsEqual(allConstraintsClone, allConstraints);
  });

});