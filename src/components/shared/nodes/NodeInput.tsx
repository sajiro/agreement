import { FontWeights, IconButton, mergeStyleSets } from "@fluentui/react";
import { useTemplateEditStructureNodeManager } from "components/templateEdit/structure/TemplateEditStructureNodeManager";
import { NODE_INDENT_BLOCK_WIDTH } from "consts/globals";
import { keyCodes } from "consts/keycode";
import { useTemplateStructureEditor } from "hooks/template/mutation/useTemplateStructureEditor";
import useObserver from "hooks/useObserver";
import { ITemplateRevisionSlot } from "models/slot";
import React, { useCallback, useRef, useState } from "react";
import icons from "../Icons";

const getGroupDisplayName = (groupName: string) => groupName || "Group Name";

type NodeInputProps = {
  nodeDepth: number;
  value: string;
  slot: ITemplateRevisionSlot;
  enableEditing: boolean;
  isSlotGroup: boolean;
  setEditMode: (edit: boolean) => void;
};
function NodeInput({
  nodeDepth,
  value,
  slot,
  enableEditing,
  isSlotGroup,
  setEditMode,
}: NodeInputProps) {
  const styles = mergeStyleSets({
    clauseText: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      maxWidth: 300 - nodeDepth * 2 * NODE_INDENT_BLOCK_WIDTH,
      fontWeight: isSlotGroup ? 600 : 400,
    },
    input: {
      outline: "none",
      border: "none",
      padding: 0,
      background: "transparent",
      fontWeight: FontWeights.semibold,
      fontFamily: "unset",
      fontSize: "unset",
      width: "100%",
      height: "fit-content",
    },
  });

  const { getSelectedNodes, nodeSelection } = useTemplateEditStructureNodeManager();
  const { setSlotGroupName } = useTemplateStructureEditor();
  const [display, setDisplay] = useState<string>(getGroupDisplayName(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useObserver(nodeSelection.observable);
  const isSelected = !!getSelectedNodes().find((n) => n.id === slot.id);

  const onInputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDisplay(event.target.value);
    },
    [setDisplay]
  );

  const updateNodeName = useCallback(
    (event?: React.KeyboardEvent<HTMLInputElement>) => {
      event?.stopPropagation();
      const isDiscardChanges = event?.key === keyCodes.ESCAPE;
      const isSaveChanges = event === undefined || event.key === keyCodes.ENTER;
      if (isDiscardChanges || isSaveChanges) {

        // If group name (value) is empty, assume it's a newly created group
        // Thus set it to the default display name if the user doesn't override it with a non-empty name
        const newGroupName = display.trim();
        const setNewGroupName = (isSaveChanges && newGroupName) || !value;
        if (setNewGroupName) {
          setSlotGroupName(slot, getGroupDisplayName(newGroupName));
        }

        // Need to call getGroupDisplayName() to account for user saving a newly created group with empty display name
        const newDisplayName = getGroupDisplayName(setNewGroupName ? display : value);
        setDisplay(newDisplayName);
        setEditMode(false);
      }
    },
    [setEditMode, setSlotGroupName, slot, display]
  );

  return (
    <>
      { !enableEditing && <div title={value} className={styles.clauseText}>{display}</div> }
      { !enableEditing && isSlotGroup && isSelected && (<IconButton 
        aria-label="edit"
        iconProps={icons.edit}
        styles={{
          rootHovered: { backgroundColor: "transparent" },
          root: { height: "fit-content", width: "fit-content", padding: "2px 0px 0px 5px" },
          flexContainer: { height: "fit-content" },
          icon: { fontSize: 13 }
        }}
        onClick={(event) => {
          event.stopPropagation();
          setEditMode(true); 
        }}
        />
      )}
      {enableEditing && (
        <input
          data-automation-id="templateEdit-structure-nodeGroupName-input"
          className={styles.input}
          ref={inputRef}
          value={display}
          onChange={onInputChanged}
          onBlur={() => {
            updateNodeName();
          }}
          onFocus={(event) => {
            event.target.select();
          }}
          onKeyDown={updateNodeName}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          aria-label="Slot group name"
        />
      )}
    </>
  );
}

export default NodeInput;
