import { css, FontWeights, mergeStyleSets } from "@fluentui/react";
import { useTemplateEditStructureNodeManager } from "components/templateEdit/structure/TemplateEditStructureNodeManager";
import customTheme from "helpers/customTheme";
import { INode } from "models/node";
import { ITemplateRevisionSlot } from "models/slot";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import hash from "object-hash";
import { previewResultActions } from "store/PreviewResultSlice";
import { getFlatlist } from "helpers/slot";
import NodeConstraints from "./NodeConstraints";
import NodeHeaderGap from "./NodeHeaderGap";
import NodeHeaderToggle from "./NodeHeaderToggle";
import NodeInput from "./NodeInput";
import NodeRow from "./NodeRow";
import NodeSelectionHandler from "./NodeSelectionHandler";

const styles = mergeStyleSets({
  input: {
    outline: "none",
    border: "none",
    padding: 0,
    background: "transparent",
    fontWeight: FontWeights.semibold,
    fontFamily: "unset",
    fontSize: "unset",
    width: "100%",
  },
  cell: customTheme.nodeCellCss,
  node: customTheme.nodeCell1Css,
  constraints: customTheme.nodeCell2Css,
  tr: customTheme.listRowCss,
  expandBtn: {
    marginLeft: "-10px",
  },
});

type ConstraintSlotNodeProps = {
  node: INode<ITemplateRevisionSlot>;
  isOpen: boolean;
  depth: number;
  isSlotGroup: boolean;
  setOpen: (state: boolean) => void;
  resize: (height: number, shouldForceUpdate?: boolean) => void;
  positionStyle: CSSProperties;
};

function ConstraintSlotNode({
  node,
  isOpen,
  depth,
  isSlotGroup,
  resize,
  setOpen,
  positionStyle,
}: ConstraintSlotNodeProps) {
  const dispatch = useDispatch();

  const { isLoading, isLocked } = useSelector(
    (state: RootState) => state.templateEdit
  );
  const { updateNodeInfo, toggleNodeOpenState } =
    useTemplateEditStructureNodeManager();
  const nodeRef = useRef<HTMLDivElement>(null);

  const [nameEditingEnabled, setNameEditingEnabled] = useState<boolean>(false);
  const nameEditingToggledRef = useRef<boolean>(false); // Prevent auto focus on empty slot name input field, once user has already provided it

  const contentHash = hash(node.content!);
  const isHeightValid = contentHash === node.contentHash; // Height calculated based on the content
  const slotPosition = isHeightValid ? positionStyle : undefined;
  const elementVisibility: CSSProperties = {
    visibility: isHeightValid ? undefined : "hidden",
  };
  const slotName = isSlotGroup ? node.content!.name : node.content!.partName;

  const [showDot, setShowDot] = useState(false);
  const results = useSelector((state: RootState) => state.resultSlotSlice);

  useEffect(() => {
    const filteredSlots = getFlatlist(
      results.previewSlots as ITemplateRevisionSlot[],
      "full"
    );
    const tmpSLots = filteredSlots.some((arr) => node.content!.id === arr.id);

    setShowDot(tmpSLots);
  }, [results]);

  const setNameEditingMode = useCallback(
    (edit: boolean) => {
      if (isSlotGroup) {
        setNameEditingEnabled(edit);
        nameEditingToggledRef.current = true;
      }
    },
    [isSlotGroup, setNameEditingEnabled]
  );

  useEffect(() => {
    const currentHeight = nodeRef.current!.clientHeight;
    const currentWidth = nodeRef.current!.clientWidth;

    dispatch(
      previewResultActions.setPositionXState({
        nodeWidth: currentWidth,
        isInit: true,
      })
    );

    if (!isHeightValid) {
      updateNodeInfo(node, currentHeight, contentHash);
      resize(currentHeight, true);
    }

    if (!node.content!.name && !nameEditingToggledRef.current) {
      setNameEditingMode(true);
    }
  });

  return (
    <div
      data-automation-id="templateEdit-structure-nodeRow"
      data-node-position={node.globalPosition}
      data-node-id={node.id}
      data-node-parent-id={node.parentId}
      role="row"
      ref={nodeRef}
      style={{ ...slotPosition, ...elementVisibility }}
    >
      <NodeRow
        node={node}
        depth={depth}
        isNodeGroup={isSlotGroup}
        disableActions={isLoading || isLocked}
      >
        <NodeSelectionHandler node={node}>
          <div className={css(styles.cell, styles.node)}>
            <NodeHeaderGap depth={depth} />
            {isSlotGroup && (
              <NodeHeaderToggle
                node={node}
                toggleNodeOpenState={toggleNodeOpenState}
                isOpen={isOpen}
                setOpen={setOpen}
                disable={isLoading}
              />
            )}
            <NodeInput
              nodeDepth={depth}
              isSlotGroup={isSlotGroup}
              value={slotName}
              slot={node.content!}
              enableEditing={nameEditingEnabled}
              setEditMode={setNameEditingMode}
            />
          </div>
          <div className={css(styles.constraints)}>
            <NodeConstraints
              show={showDot}
              constraints={node.content!.constraints}
            />
          </div>
        </NodeSelectionHandler>
      </NodeRow>
    </div>
  );
}

export default ConstraintSlotNode;
