import { INodeSelectionManager } from "models/node";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { useTemplateEditStructureNodeManager } from "./TemplateEditStructureNodeManager";

const Context = createContext<INodeSelectionManager>({
  blurNode: () => {},
  focusNode: () => {},
  setRangeStartNodeId: () => {},
  setIndexableNode: () => {},
  focusedNodeIdRef: { current: undefined },
  rangeStartNodeIdRef: { current: undefined },
  indexableNodeIdRef: { current: undefined }
});

export function TemplateEditStructureSelectionManager({ children }: { children?: React.ReactNode; }) {
  const focusedNodeIdRef = useRef<string>();
  const rangeStartNodeIdRef = useRef<string>();
  const indexableNodeIdRef = useRef<string>();
  const { treeRef, nodeSelection } = useTemplateEditStructureNodeManager();

  const focusNode = useCallback((nodeId: string) => {
    if (focusedNodeIdRef.current !== nodeId) {
      focusedNodeIdRef.current = nodeId;
      nodeSelection.observable.update();
      treeRef.current?.scrollToItem(nodeId);
    }
  }, [treeRef]);

  const blurNode = useCallback((nodeId: string) => {
    if (focusedNodeIdRef.current === nodeId) {
      focusedNodeIdRef.current = undefined;
      nodeSelection.observable.update();
    }
  }, []);

  const setRangeStartNodeId = useCallback((nodeId: string|undefined, override?: boolean) => {
    const isUnset = !nodeId && rangeStartNodeIdRef.current !== undefined
    const isSet = nodeId && !rangeStartNodeIdRef.current;
    rangeStartNodeIdRef.current = isUnset || isSet || override ? nodeId : rangeStartNodeIdRef.current;
  } ,[]);

  const setIndexableNode = useCallback((nodeId: string, unset?: boolean) => {
    if (!indexableNodeIdRef.current || (indexableNodeIdRef.current === nodeId && unset)) {
      indexableNodeIdRef.current = unset ? undefined : nodeId;
      nodeSelection.observable.update();
    }
  }, []);

  const contextValue = useMemo(() => ({
    focusNode,
    blurNode,
    setRangeStartNodeId,
    setIndexableNode,
    focusedNodeIdRef,
    rangeStartNodeIdRef,
    indexableNodeIdRef
  }), [focusNode, blurNode, focusedNodeIdRef]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
}

export const useNodeSelectionManager = () => useContext(Context);