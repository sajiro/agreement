import AutoSizer from "react-virtualized-auto-sizer";
import TemplateEditEmptyStructure from "components/templateEdit/structure/TemplateEditEmptyStructure";
import useObserver from "hooks/useObserver";
import {
  ExtendedNodeData,
  INode,
  INodeTreeProvider,
  NodeMeta,
  NodeRendererProps,
} from "models/node";
import { useCallback } from "react";
import { TreeWalker, TreeWalkerValue, VariableSizeTree } from "react-vtree";
import { ROOT_NODE_ID, VTREE_EXPECTED_HEIGHT } from "consts/globals";
import { hasNodes } from "helpers/node";

const getNodeData = <T extends unknown>(
  node: INode<T>,
  nestingLevel: number
): TreeWalkerValue<ExtendedNodeData<T>, NodeMeta<T>> => ({
  data: {
    defaultHeight: node.height,
    id: node.id,
    isOpenByDefault: node.isOpen,
    nestingLevel,
    node,
  },
  nestingLevel,
  node,
});

type NodeListProps<T> = {
  useNodeTreeProvider: () => INodeTreeProvider<T>;
  nodeRenderer: ({
    data: { node, nestingLevel },
    isOpen,
    height,
    style,
    resize,
    setOpen,
  }: NodeRendererProps<T>) => JSX.Element;
};

function NodeList<T>({ useNodeTreeProvider, nodeRenderer }: NodeListProps<T>) {
  const { nodeTree, treeRef } = useNodeTreeProvider();
  const treeWalkerRefreshToken = useObserver(nodeTree.observable);

  const treeWalker = useCallback(
    function* treeWalker(): ReturnType<
      TreeWalker<ExtendedNodeData<T>, NodeMeta<T>>
    > {
      yield getNodeData(nodeTree.nodes[ROOT_NODE_ID], -1); // Root node will not be displayed, so setting it to -1th level
      while (true) {
        const parent: { node: INode<T>; nestingLevel: number } = yield;
        const childNodeIds = nodeTree.childNodeMappings[parent.node.id];
        for (let i = 0; childNodeIds && i < childNodeIds.length; i += 1) {
          const node = nodeTree.nodes[childNodeIds[i]];
          yield getNodeData(node, parent.nestingLevel + 1);
        }
      }
    },
    [treeWalkerRefreshToken]
  );

  const isNodeTreeInitialized = !!nodeTree.nodes[ROOT_NODE_ID];
  const containsNodes = hasNodes(nodeTree);
  if (!isNodeTreeInitialized || !containsNodes) {
    return (
      <>
        {null}{" "}
        {/* Display nothing if Node Tree hasn't been initialized yet (unknown, whether there are slots or not) */}
        {isNodeTreeInitialized && !containsNodes && (
          <div style={{ height: VTREE_EXPECTED_HEIGHT }}>
            <AutoSizer disableWidth>
              {({ height }) => <TemplateEditEmptyStructure height={height} />}
            </AutoSizer>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ height: VTREE_EXPECTED_HEIGHT }} role="grid">
      <AutoSizer disableWidth>
        {({ height }) => (
          <VariableSizeTree
            ref={treeRef}
            treeWalker={treeWalker}
            height={height}
            async
          >
            {nodeRenderer}
          </VariableSizeTree>
        )}
      </AutoSizer>
    </div>
  );
}

export default NodeList;
