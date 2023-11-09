import { NodeSelection } from "components/shared/nodes/NodeSelection";
import { ROOT_NODE_ID } from "consts/globals";
import { getTestNode, getTestNodeTree, getTestSlot } from "test/nodeTreeUtils";
import { getSubTreeNodeIds, isNodeListContiguous, isParentCollapsed, reApplyNodeSelections } from "./node";
import { v1 as uuidv1 } from 'uuid';

const getSingleLevelNodeTreeInfo = () => {
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
  
  return { nodes, nodeTree };
};

const getTwoLevelNodeTree = () => {
  const slotGroupNode = getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1);
  const slotGroupNodes = [
    getTestNode(getTestSlot(2, slotGroupNode.id), 2, 2),
    getTestNode(getTestSlot(3, slotGroupNode.id), 2, 3),
    getTestNode(getTestSlot(4, slotGroupNode.id), 2, 4),
  ];
  const nodes = [slotGroupNode, ...slotGroupNodes];
  const childNodeMappings = {
    [ROOT_NODE_ID]: nodes.map(n => n.id),
    [slotGroupNode.id]: nodes.slice(1).map(n => n.id)
  };
  const nodeTree = getTestNodeTree(nodes, childNodeMappings);

  return { nodeTree, nodes, slotGroupNode, slotGroupNodes };
};

const getThreeLevelNodeTree = () => {
  const slotGroupNode = getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1);
  const subSlotGroupNode = getTestNode(getTestSlot(3, slotGroupNode.id), 2, 3);
  const slotGroupNodes = [
    getTestNode(getTestSlot(2, slotGroupNode.id), 2, 2),
    subSlotGroupNode
  ];
  const subSlotGroupNodes = [
    getTestNode(getTestSlot(4, slotGroupNode.id), 3, 4),
    getTestNode(getTestSlot(5, slotGroupNode.id), 3, 5),
    getTestNode(getTestSlot(6, slotGroupNode.id), 3, 6),
  ];
  const nodes = [slotGroupNode, ...slotGroupNodes, ...subSlotGroupNodes];
  const childNodeMappings = {
    [ROOT_NODE_ID]: [slotGroupNode.id],
    [slotGroupNode.id]: slotGroupNodes.map(n => n.id),
    [subSlotGroupNode.id]: subSlotGroupNodes.map(n => n.id)
  };
  const nodeTree = getTestNodeTree(nodes, childNodeMappings);

  return { nodeTree, nodes, slotGroupNode, slotGroupNodes, subSlotGroupNode, subSlotGroupNodes };
};

describe("getSubTreeNodeIds function", () => {
  test("standard slot", () => {
    const { nodeTree, nodes } = getSingleLevelNodeTreeInfo();

    const subTreeNodeIds = getSubTreeNodeIds(nodes[1].id, nodeTree);

    expect(subTreeNodeIds.size).toEqual(0);
  });

  test("empty slot group", () => {
    const nodes = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
    ];
    const childNodeMappings = {
      [ROOT_NODE_ID]: nodes.map(n => n.id)
    };
    const nodeTree = getTestNodeTree(nodes, childNodeMappings);

    const subTreeNodeIds = getSubTreeNodeIds(nodes[0].id, nodeTree);

    expect(subTreeNodeIds.size).toEqual(0);
  });

  test("single level slot group", () => {
    const { nodeTree, slotGroupNode, slotGroupNodes } = getTwoLevelNodeTree();

    const subTreeNodeIds = getSubTreeNodeIds(slotGroupNode.id, nodeTree);

    expect(subTreeNodeIds.size).toEqual(slotGroupNodes.length);
    expect(Array.from(subTreeNodeIds.values()).sort()).toEqual(slotGroupNodes.map(n => n.id).sort());
  });

  test("multi-level slot group", () => {
    const { nodeTree, slotGroupNode, slotGroupNodes, subSlotGroupNodes } = getThreeLevelNodeTree();

    const subTreeNodeIds = getSubTreeNodeIds(slotGroupNode.id, nodeTree);

    expect(subTreeNodeIds.size).toEqual(slotGroupNodes.length + subSlotGroupNodes.length);
    expect(Array.from(subTreeNodeIds.values()).sort()).toEqual([
      ...slotGroupNodes,
      ...subSlotGroupNodes
    ].map(n => n.id).sort());
  });
});

describe("reApplyNodeSelections function", () => {
  test("empty selection", () => {
    const { nodeTree } = getThreeLevelNodeTree();
    const nodeSelection = new NodeSelection();

    reApplyNodeSelections(nodeTree, nodeSelection);

    expect(nodeSelection.getMainSelections().length).toEqual(0);
  });

  test("selections all present (single level node tree)", () => {
    const { nodeTree, nodes } = getSingleLevelNodeTreeInfo();
    const nodeSelection = new NodeSelection();
    const selectedNodeIds = [nodes[0].id, nodes[1].id];
    selectedNodeIds.forEach(id => { nodeSelection.addSelection(id, new Set<string>()); });

    reApplyNodeSelections(nodeTree, nodeSelection);

    const mainSelections = nodeSelection.getMainSelections();
    expect(mainSelections.length).toEqual(selectedNodeIds.length);
    expect(mainSelections.sort()).toEqual(selectedNodeIds.sort());
  });

  test("selections all present (multi-level node tree)", () => {
    const { nodeTree, slotGroupNodes, subSlotGroupNodes } = getThreeLevelNodeTree();
    const nodeSelection = new NodeSelection();
    const selectedNodeIds = [
      slotGroupNodes[0].id,
      subSlotGroupNodes[0].id,
      subSlotGroupNodes[1].id
    ];
    selectedNodeIds.forEach(id => { nodeSelection.addSelection(id, new Set<string>()); });

    reApplyNodeSelections(nodeTree, nodeSelection);

    const mainSelections = nodeSelection.getMainSelections();
    expect(mainSelections.length).toEqual(selectedNodeIds.length);
    expect(mainSelections.sort()).toEqual(selectedNodeIds.sort());
  });

  test("some selections not present (single level node tree)", () => {
    const { nodeTree, nodes } = getSingleLevelNodeTreeInfo();
    const nodeSelection = new NodeSelection();
    nodeSelection.addSelection(nodes[0].id, new Set<string>());
    nodeSelection.addSelection(uuidv1(), new Set<string>()); // non-existing node
    
    reApplyNodeSelections(nodeTree, nodeSelection);

    const mainSelections = nodeSelection.getMainSelections();
    expect(mainSelections.length).toEqual(1);
    expect(mainSelections.sort()).toEqual([nodes[0].id]);
  });

  test("some selections not present (multi-level node tree)", () => {
    const { nodeTree, slotGroupNode, slotGroupNodes, subSlotGroupNode, subSlotGroupNodes } = getThreeLevelNodeTree();
    const nodeSelection = new NodeSelection();
    const nonExistingNodeId = uuidv1();
    const descendentIds = new Set<string>([
      nonExistingNodeId,
      ...slotGroupNodes.map(n => n.id),
      subSlotGroupNode.id,
      ...subSlotGroupNodes.map(n => n.id),
    ]);
    nodeSelection.addSelection(slotGroupNode.id, descendentIds);

    reApplyNodeSelections(nodeTree, nodeSelection);

    const mainSelections = nodeSelection.getMainSelections();
    expect(mainSelections.length).toEqual(1);
    expect(mainSelections.sort()).toEqual([slotGroupNode.id]);
    expect(nodeSelection.isDescendentSelection(nonExistingNodeId)).toEqual(false);    
  });
});

describe("isParentCollapsed function", () => {
  test("root level node", () => {
    const { nodeTree, nodes } = getSingleLevelNodeTreeInfo();

    const parentCollapsed = isParentCollapsed(nodeTree, nodes[2]);

    expect(parentCollapsed).toEqual(false);
  });

  test("single level slot group (parent slot collapsed)", () => {
    const { nodeTree, slotGroupNode, slotGroupNodes } = getTwoLevelNodeTree();

    slotGroupNode.isOpen = false;
    const parentCollapsed = isParentCollapsed(nodeTree, slotGroupNodes[0]);

    expect(parentCollapsed).toEqual(true);    
  });

  test("multi-level slot group (top level parent collapsed)", () => {
    const { nodeTree, slotGroupNode, subSlotGroupNodes } = getThreeLevelNodeTree();

    slotGroupNode.isOpen = false;
    const parentCollapsed = isParentCollapsed(nodeTree, subSlotGroupNodes[0]);

    expect(parentCollapsed).toEqual(true);    
  });

  test("multi-level slot group (slot group chain open)", () => {
    const { nodeTree, subSlotGroupNodes } = getThreeLevelNodeTree();

    const parentCollapsed = isParentCollapsed(nodeTree, subSlotGroupNodes[0]);

    expect(parentCollapsed).toEqual(false);    
  });
});

describe("isNodeListContiguous function", () => {
  test("empty node list", () => {
    const isContiguous = isNodeListContiguous([]);

    expect(isContiguous).toEqual(true);
  });

  test("single node list", () => {
    const nodeList = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1)
    ];
    const isContiguous = isNodeListContiguous(nodeList);

    expect(isContiguous).toEqual(true);
  });

  test("contiguous nodes", () => {
    const nodeList = [
      getTestNode(getTestSlot(3, ROOT_NODE_ID), 1, 3),
      getTestNode(getTestSlot(4, ROOT_NODE_ID), 1, 4),
    ];
    const isContiguous = isNodeListContiguous(nodeList);

    expect(isContiguous).toEqual(true);
  });

  test("non-contiguous nodes (all root level)", () => {
    const nodeList = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      getTestNode(getTestSlot(4, ROOT_NODE_ID), 1, 4),
    ];

    const isContiguous = isNodeListContiguous(nodeList);

    expect(isContiguous).toEqual(false);
  });

  test("non-contiguous nodes (different levels)", () => {
    const slotGroupNode = getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1);
    const nodeList = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      getTestNode(getTestSlot(3, slotGroupNode.id), 2, 3),
      getTestNode(getTestSlot(4, slotGroupNode.id), 2, 4),
    ];

    const isContiguous = isNodeListContiguous(nodeList);

    expect(isContiguous).toEqual(false);
  });
});