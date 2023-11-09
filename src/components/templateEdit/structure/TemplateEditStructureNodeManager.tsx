/* eslint-disable no-param-reassign */

import { NodeSelection } from "components/shared/nodes/NodeSelection";
import { Observable } from "components/shared/nodes/Observable";
import { ROOT_NODE_ID } from "consts/globals";
import {
  buildNodeTree,
  reApplyNodeSelections,
  isParentCollapsed,
  getSubTreeNodeIds,
} from "helpers/node";
import { isDraftRevisionVariant } from "helpers/revisions";
import {
  ExtendedNodeData,
  INode,
  INodeDragState,
  INodeSelectionTracker,
  INodeTree,
  INodeTreeProvider,
  RelativeNodePosition,
} from "models/node";
import { RevisionStatus } from "models/revisions";
import { ITemplateRevisionSlot } from "models/slot";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { VariableSizeTree } from "react-vtree";
import {
  useGetSlotTreeQuery,
  useLazyGetSlotTranslationsQuery,
} from "services/slot";
import { templateEditActions } from "store/TemplateEditSlice";
import { resultSlotActions } from "store/ResultSlotSlice";
import { json2QueryString } from "helpers/utils";
import { RootState } from "store";

const Context = createContext<INodeTreeProvider<ITemplateRevisionSlot>>({
  resultSlots: [],
  nodeTree: { nodes: {}, childNodeMappings: {}, observable: new Observable() },
  treeRef: { current: null },
  nodeSelection: {
    selections: new NodeSelection(),
    observable: new Observable(),
  },
  nodeDragState: { isDragging: false, observable: new Observable() },
  updateNodeInfo: () => {},
  toggleNodeOpenState: () => {},
  toggleNodeSelection: () => {},
  applyRangeSelection: () => {},
  selectIfNotSelected: () => {},
  toggleDragState: () => {},
  getSelectedNodes: () => [],
  getChildNodes: () => [],
  getNextNode: () => ({} as INode<ITemplateRevisionSlot>),
  getNextNonSubLevelNode: () => ({} as INode<ITemplateRevisionSlot>),
  getNextInsertLocationNode: () => ({} as INode<ITemplateRevisionSlot>),
});

type TemplateEditStructureNodeManagerProps = {
  children?: React.ReactNode;
  templateId: string;
  revisionId: string;
  revisionStatus: RevisionStatus;
};
export function TemplateEditStructureNodeManager({
  children,
  revisionStatus,
  ...templateInfo
}: TemplateEditStructureNodeManagerProps) {
  const dispatch = useDispatch();

  const {
    currentData: slotTree,
    isLoading,
    isFetching,
  } = useGetSlotTreeQuery(templateInfo);
  const currentConfig = useSelector(
    (state: RootState) => state.templateEditPreview
  );

  const [
    triggerQuery,
    { data: slotsData, isLoading: slotsLoading, isFetching: slotsFetching },
  ] = useLazyGetSlotTranslationsQuery();

  const nodeTreeRef = useRef<INodeTree<ITemplateRevisionSlot>>({
    nodes: {},
    childNodeMappings: {},
    observable: new Observable(),
  });
  const treeRef =
    useRef<VariableSizeTree<ExtendedNodeData<ITemplateRevisionSlot>>>(null);
  const nodeSelectionRef = useRef<INodeSelectionTracker>({
    selections: new NodeSelection(),
    observable: new Observable(),
  });
  const nodeDragStateRef = useRef<INodeDragState>({
    isDragging: false,
    observable: new Observable(),
  });

  const { toggle } = useSelector((state: RootState) => state.resultSlotSlice);

  useEffect(() => {
    if (!toggle) {
      triggerQuery(
        {
          ...templateInfo,
          query:
            Object.keys(currentConfig.context).length === 0
              ? "default"
              : json2QueryString(currentConfig.context),
        },
        true
      );
    }
    dispatch(resultSlotActions.setShowTestClauses({ toggle: false }));
  }, [currentConfig]);

  useEffect(() => {
    if (isLoading || isFetching) {
      dispatch(templateEditActions.setLoadingState(true));
    }
    if (!isLoading && !isFetching && !slotTree!.isLoading) {
      // Need to clear to ensure previously cached tree is not present
      nodeTreeRef.current.nodes = {};
      nodeTreeRef.current.childNodeMappings = {};

      buildNodeTree(nodeTreeRef.current, slotTree!, ROOT_NODE_ID, undefined, 0);
      reApplyNodeSelections(
        nodeTreeRef.current,
        nodeSelectionRef.current.selections
      );
      dispatch(
        templateEditActions.setLockedState(
          !isDraftRevisionVariant(revisionStatus)
        )
      );
      dispatch(templateEditActions.setLoadingState(false));
      nodeTreeRef.current.observable.update();
      nodeSelectionRef.current.observable.update();

      dispatch(
        resultSlotActions.setPreviewSlots({ previewSlots: slotsData ?? [] })
      );
    }
  }, [
    slotTree,
    isFetching,
    isLoading,
    revisionStatus,
    dispatch,
    slotsData,
    slotsFetching,
    slotsLoading,
  ]);

  const updateNodeInfo = useCallback(
    (
      node: INode<ITemplateRevisionSlot>,
      height: number,
      contentHash: string
    ) => {
      node.height = height;
      node.contentHash = contentHash;
    },
    []
  );

  const toggleNodeOpenState = useCallback(
    (node: INode<ITemplateRevisionSlot>) => {
      node.isOpen = !node.isOpen;
      treeRef.current?.resetAfterId(node.id, true);
    },
    []
  );

  const selectIfNotSelected = useCallback(
    (nodeId: string, isMultiSelect: boolean) => {
      const isMainSelection =
        nodeSelectionRef.current.selections.isMainSelection(nodeId);
      const isDescendentSelection =
        nodeSelectionRef.current.selections.isDescendentSelection(nodeId);
      if (!isMainSelection && !isDescendentSelection) {
        const subTreeNodeIds = getSubTreeNodeIds(nodeId, nodeTreeRef.current);
        if (!isMultiSelect) nodeSelectionRef.current.selections.clear();
        nodeSelectionRef.current.selections.addSelection(
          nodeId,
          subTreeNodeIds
        );
        nodeSelectionRef.current.observable.update();
      }
    },
    []
  );

  const toggleNodeSelection = useCallback(
    (nodeId: string, isMultiSelect: boolean) => {
      const subTreeNodeIds = getSubTreeNodeIds(nodeId, nodeTreeRef.current);
      if (nodeSelectionRef.current.selections.isMainSelection(nodeId)) {
        nodeSelectionRef.current.selections.removeSelection(nodeId);
      } else {
        if (!isMultiSelect) nodeSelectionRef.current.selections.clear();
        nodeSelectionRef.current.selections.addSelection(
          nodeId,
          subTreeNodeIds
        );
      }

      nodeSelectionRef.current.observable.update();
    },
    []
  );

  const applyRangeSelection = useCallback(
    (startId: string, endId: string) => {
      const nodeList = Object.values(nodeTreeRef.current.nodes);
      nodeList.sort((a, b) => a.globalPosition - b.globalPosition);
      const node1 = nodeTreeRef.current.nodes[startId];
      const node2 = nodeTreeRef.current.nodes[endId];
      const { start, end } =
        node1.globalPosition <= node2.globalPosition
          ? { start: node1, end: node2 }
          : { start: node2, end: node1 };
      const nodesToSelect = nodeList.slice(
        start.globalPosition,
        end.globalPosition + 1
      );

      nodeSelectionRef.current.selections.clear();
      nodesToSelect.forEach((node) => selectIfNotSelected(node.id, true));
      nodeSelectionRef.current.observable.update();
    },
    [selectIfNotSelected]
  );

  const toggleDragState = useCallback((isDragging: boolean) => {
    nodeDragStateRef.current.isDragging = isDragging;
    nodeDragStateRef.current.observable.update();
  }, []);

  const getSelectedNodes = useCallback(() => {
    const selectedNodeIds =
      nodeSelectionRef.current.selections.getMainSelections();
    const selectedNodes = selectedNodeIds.map(
      (id) => nodeTreeRef.current.nodes[id]
    );
    return selectedNodes.sort((a, b) => a.globalPosition - b.globalPosition);
  }, []);

  const getChildNodes = useCallback((nodeId: string) => {
    const childNodeIds = nodeTreeRef.current.childNodeMappings[nodeId];
    return childNodeIds?.map((id) => nodeTreeRef.current.nodes[id]) || []; // Handle cases where a node is childless
  }, []);

  const getNextNode = useCallback(
    (
      node: INode<ITemplateRevisionSlot>,
      direction: RelativeNodePosition
    ): INode<ITemplateRevisionSlot> | undefined => {
      // Root Node is a fake node that is not navigable
      if (node === undefined || node.id === ROOT_NODE_ID) return undefined;

      const nodeList = Object.values(nodeTreeRef.current.nodes);
      nodeList.sort((a, b) => a.globalPosition - b.globalPosition);
      const currentNodeIndex = nodeList.findIndex((n) => n.id === node.id);
      const isFirstNode = currentNodeIndex === 1; // Node Index 0 is the root node, which is fake and non-navigable
      const isLastNode = currentNodeIndex === nodeList.length - 1;

      if (
        (isFirstNode && direction === RelativeNodePosition.Above) ||
        (isLastNode && direction === RelativeNodePosition.Below)
      )
        return undefined;
      const nextNode =
        direction === RelativeNodePosition.Above
          ? nodeList[currentNodeIndex - 1]
          : nodeList[currentNodeIndex + 1];
      const parentCollapsed = isParentCollapsed(nodeTreeRef.current, nextNode);
      if (parentCollapsed) return getNextNode(nextNode, direction);
      return nextNode;
    },
    []
  );

  const getNextNonSubLevelNode = useCallback(
    (node: INode<ITemplateRevisionSlot>, direction: RelativeNodePosition) => {
      let nextNode = getNextNode(node, direction);
      while (nextNode !== undefined && node.depth < nextNode.depth) {
        nextNode = getNextNode(nextNode, direction);
      }

      return nextNode;
    },
    [getNextNode]
  );

  const getNextInsertLocationNode = useCallback(
    (node: INode<ITemplateRevisionSlot>, direction: RelativeNodePosition) => {
      // If moving down the tree, need to ensure we don't create any cycles
      if (direction === RelativeNodePosition.Below) {
        let nextNode = getNextNode(node, direction);
        const subTreeNodeIds = getSubTreeNodeIds(node.id, nodeTreeRef.current);
        while (nextNode !== undefined && subTreeNodeIds.has(nextNode.id)) {
          nextNode = getNextNode(nextNode, direction);
        }

        return nextNode;
      }

      // If moving up the tree, groups have precedent over next node that is at a lower level
      const nextNode = getNextNonSubLevelNode(node, direction);
      return nextNode;
    },
    [getNextNode, getNextNonSubLevelNode]
  );

  const contextValue = useMemo(
    () => ({
      resultSlots: slotsData,
      nodeTree: nodeTreeRef.current,
      treeRef,
      nodeSelection: nodeSelectionRef.current,
      nodeDragState: nodeDragStateRef.current,
      updateNodeInfo,
      toggleNodeOpenState,
      toggleNodeSelection,
      applyRangeSelection,
      selectIfNotSelected,
      toggleDragState,
      getSelectedNodes,
      getChildNodes,
      getNextNode,
      getNextNonSubLevelNode,
      getNextInsertLocationNode,
    }),
    [
      updateNodeInfo,
      toggleNodeOpenState,
      toggleNodeSelection,
      applyRangeSelection,
      toggleDragState,
    ]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export const useTemplateEditStructureNodeManager = () => useContext(Context);
