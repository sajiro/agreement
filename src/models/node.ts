import { NodeSelection } from "components/shared/nodes/NodeSelection";
import { Observable } from "components/shared/nodes/Observable";
import { MutableRefObject } from "react";
import {
  VariableSizeNodeData,
  VariableSizeNodePublicState,
  VariableSizeTree,
} from "react-vtree";
import { NodeComponentProps } from "react-vtree/dist/es/Tree";
import { ITree } from "./general";

export enum NodeType {
  Slot,
  SlotGroup,
}

export enum RelativeNodePosition {
  Above,
  Below,
}

export enum NodeSelectionType {
  Main,
  Descendent,
}

export enum NodeSelectionMode {
  Single,
  Multiple,
  Range,
}

export enum NodeDragDropObjectType {
  Node = "Node",
  Clause = "Clause",
}

export interface INode<T> {
  id: string;
  parentId: string | undefined;
  isOpen: boolean;
  height: number;
  content: T | undefined;
  contentHash?: string;
  globalPosition: number;
  depth: number;
}

export interface INodeTree<T> extends ITree<INode<T>> {
  observable: Observable;
}

export interface INodeSelectionTracker {
  selections: NodeSelection;
  observable: Observable;
}

export interface INodeDragState {
  isDragging: boolean;
  observable: Observable;
}

export interface IDragDropItem {
  item: any;
  type: NodeDragDropObjectType;
}

export interface IInsertLocation<T> {
  node: INode<T>;
  position: RelativeNodePosition;
}

export interface INodeTreeProvider<T> {
  resultSlots: any;
  nodeTree: INodeTree<T>;
  treeRef: MutableRefObject<VariableSizeTree<ExtendedNodeData<T>> | null>;
  nodeSelection: INodeSelectionTracker;
  nodeDragState: INodeDragState;
  updateNodeInfo: (
    node: INode<T>,
    height: number,
    contentHash: string,
    isVisible?: boolean
  ) => void;
  toggleNodeOpenState: (node: INode<T>) => void;
  selectIfNotSelected: (nodeId: string, isMultiSelect: boolean) => void;
  toggleNodeSelection: (nodeId: string, isMultiSelect: boolean) => void;
  applyRangeSelection: (startId: string, endId: string) => void;
  toggleDragState: (isDragging: boolean) => void;
  getSelectedNodes: () => INode<T>[];
  getChildNodes: (nodeId: string) => INode<T>[];
  getNextNode: (
    node: INode<T>,
    direction: RelativeNodePosition
  ) => INode<T> | undefined;
  getNextNonSubLevelNode: (
    node: INode<T>,
    direction: RelativeNodePosition
  ) => INode<T> | undefined;
  getNextInsertLocationNode: (
    node: INode<T>,
    direction: RelativeNodePosition
  ) => INode<T> | undefined;
}

export type NodeMeta<T> = Readonly<{
  nestingLevel: number;
  node: INode<T>;
}>;

export type ExtendedNodeData<T> = VariableSizeNodeData &
  Readonly<{
    nestingLevel: number;
    node: INode<T>;
  }>;

export type NodeRendererProps<T> = NodeComponentProps<
  ExtendedNodeData<T>,
  VariableSizeNodePublicState<ExtendedNodeData<T>>
>;

export interface INodeSelectionManager {
  focusNode: (nodeId: string) => void;
  blurNode: (nodeId: string) => void;
  setRangeStartNodeId: (nodeId: string | undefined, override?: boolean) => void;
  setIndexableNode: (nodeId: string, unset?: boolean) => void;
  focusedNodeIdRef: MutableRefObject<string | undefined>;
  rangeStartNodeIdRef: MutableRefObject<string | undefined>;
  indexableNodeIdRef: MutableRefObject<string | undefined>;
}
