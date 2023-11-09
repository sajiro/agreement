import { NodeSelection } from "components/shared/nodes/NodeSelection";
import { NODE_INDENT_BLOCK_WIDTH } from "consts/globals";
import { ITree } from "models/general";
import { RelativeNodePosition, INode, INodeTree } from "models/node";

// Node Tree will always have Root Node, if its a non-empty tree it needs to have additional nodes beyond it
export const hasNodes = <T>(nodeTree: INodeTree<T>) => Object.values(nodeTree.nodes).length > 1;

export const getAdditionalNodeIndentWidth = (depth: number) => {
  const indentFactor = depth === 0 ? 1 : 2;
  return NODE_INDENT_BLOCK_WIDTH + (depth * NODE_INDENT_BLOCK_WIDTH * indentFactor);
};

export const buildNodeTree = <T>(
  vTree: INodeTree<T>,
  sourceTree: ITree<T>,
  currentNodeId: string,
  parentNodeId: string | undefined,
  depth: number
) => {
  // eslint-disable-next-line no-param-reassign
  vTree.nodes[currentNodeId] = {
    id: currentNodeId,
    parentId: parentNodeId,
    content: sourceTree.nodes[currentNodeId],
    globalPosition: Object.values(vTree.nodes).length,
    height: 0,
    isOpen: true,
    depth,
  };

  const childNodeIds = sourceTree.childNodeMappings[currentNodeId];
  if (childNodeIds) {
    // eslint-disable-next-line no-param-reassign
    vTree.childNodeMappings[currentNodeId] = childNodeIds;
    for (let i = 0; i < childNodeIds.length; i += 1) {
      buildNodeTree(
        vTree,
        sourceTree,
        childNodeIds[i],
        currentNodeId,
        depth + 1
      );
    }
  }
};

export const getSubTreeNodeIds = <T>(
  nodeId: string,
  nodeTree: INodeTree<T>
) => {
  const setSubTreeNodeIds = (
    currentNodeId: string,
    subTreeNodeIds: Set<string>
  ) => {
    const childNodeIds = nodeTree.childNodeMappings[currentNodeId];
    if (childNodeIds) {
      childNodeIds.forEach((id) => {
        subTreeNodeIds.add(id);
        setSubTreeNodeIds(id, subTreeNodeIds);
      });
    }
  };

  const subTreeNodeIds = new Set<string>();
  setSubTreeNodeIds(nodeId, subTreeNodeIds);
  return subTreeNodeIds;
};

export const reApplyNodeSelections = <T>(
  nodeTree: INodeTree<T>,
  nodeSelection: NodeSelection
) => {
  const selectedNodeIds = nodeSelection.getMainSelections();
  nodeSelection.clear();
  selectedNodeIds.forEach((id) => {
    const node = nodeTree.nodes[id];
    if (node) {
      const subTreeNodeIds = getSubTreeNodeIds(id, nodeTree);
      nodeSelection.addSelection(id, subTreeNodeIds);
    }
  });
};

export const isParentCollapsed = <T>(
  nodeTree: INodeTree<T>,
  node: INode<T> | undefined
): boolean => {
  if (node === undefined) return false;
  const parentNode = node.parentId ? nodeTree.nodes[node.parentId] : undefined;
  if (parentNode && !parentNode.isOpen) return true;
  return isParentCollapsed(nodeTree, parentNode);
};

export const isNodeListContiguous = <T>(nodes: INode<T>[]) => {
  if (nodes.length <= 1) return true;

  nodes.sort((a, b) => a.globalPosition - b.globalPosition);
  let currentPosition = nodes[0].globalPosition;
  for (let i = 1; i < nodes.length; i += 1) {
    if (nodes[i].globalPosition !== currentPosition + 1) return false;
    currentPosition += 1;
  }

  return true;
};

export const getNodeToOperateOn = <T>(
  nodes: INode<T>[],
  operationDirection: RelativeNodePosition
) => {
  if (isNodeListContiguous(nodes)) {
    return operationDirection === RelativeNodePosition.Above
      ? nodes[0]
      : nodes[nodes.length - 1];
  }

  return nodes[0];
};
