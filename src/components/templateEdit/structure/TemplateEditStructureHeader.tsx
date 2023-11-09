import {
  Callout,
  css,
  DirectionalHint,
  IButtonStyles,
  IconButton,
  mergeStyles,
  mergeStyleSets,
  ProgressIndicator,
  VerticalDivider,
} from "@fluentui/react";
import icons from "components/shared/Icons";
import customTheme from "helpers/customTheme";
import { getNodeToOperateOn, hasNodes } from "helpers/node";
import useTemplateEditPanelManager from "hooks/template/useTemplateEditPanelManager";
import { TemplateEditPanelType } from "store/templateEditPanelManagementSlice";
import { useCallback, useEffect, useState } from "react";
import useObserver from "hooks/useObserver";
import { RelativeNodePosition } from "models/node";
import { ISlotPositioningTarget } from "models/slot";
import { RevisionStatus } from "models/revisions";
import { isDraftRevisionVariant } from "helpers/revisions";
import { RootState } from "store";
import { useSelector } from "react-redux";
import {
  getCommonConstraints,
  getNextInsertLocationInfo,
  isSlotGroup,
} from "helpers/slot";
import useDialog from "hooks/useDialog";
import {
  NODE_INDENT_BLOCK_WIDTH,
  DEFAULT_NODE_HEIGHT,
  ROOT_NODE_ID,
  TEMPLATE_EDIT_TABS_CONTAINER,
} from "consts/globals";
import { useTrackingContext } from "components/shared/TrackingContext";

import { useBoolean } from "@fluentui/react-hooks";
import stringsConst from "consts/strings";
import HeaderButton from "components/shared/HeaderButton";
import { useTemplateEditStructureNodeManager } from "./TemplateEditStructureNodeManager";
import { useTemplateStructureEditor } from "../../../hooks/template/mutation/useTemplateStructureEditor";

const styles = mergeStyleSets({
  cell: customTheme.nodeCellCss,
  nodeHeader: {
    width: 365,
    paddingLeft: NODE_INDENT_BLOCK_WIDTH,
  },
  constraintsHeader: {},
  slotsHeader: {
    fontWeight: 600,
  },
});

const tipClass = mergeStyles({
  fontSize: 12,
  margin: 20,
  width: 250,
  lineHeight: "20px",
});

const iconStyles = (init: boolean, pos: number): Partial<IButtonStyles> => ({
  root: {
    position: "absolute",
    top: 3,
    right: init ? pos : 5,
  },
});

function TemplateEditStructureHeader({
  revisionStatus,
}: {
  revisionStatus: RevisionStatus;
}) {
  const { isLoading } = useSelector((state: RootState) => state.templateEdit);
  const { openSlotGroupCreationDialog } = useDialog();
  const {
    nodeTree,
    nodeSelection,
    getSelectedNodes,
    getNextInsertLocationNode,
    getChildNodes,
  } = useTemplateEditStructureNodeManager();
  const { deleteSlots, repositionSlots, createSlotGroup } =
    useTemplateStructureEditor();
  const { openPanel, openClausePanel } = useTemplateEditPanelManager();
  useObserver(nodeSelection.observable);
  const { trackEvent } = useTrackingContext();

  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);

  const resultState = useSelector(
    (state: RootState) => state.previewResultSlice
  );

  const [posX, setPosX] = useState(0);

  useEffect(() => {
    setPosX(TEMPLATE_EDIT_TABS_CONTAINER.width + 25 - resultState.nodeWidth);
  }, [resultState]);

  const selectedNodes = getSelectedNodes();
  const hasSelection = selectedNodes.length > 0;
  const nonGroupNodes = selectedNodes.filter((n) => !isSlotGroup(n.content!));
  const hasNonGroupSelection = nonGroupNodes.length > 0;

  const getRelativeInsertLocationInfo = (direction: RelativeNodePosition) => {
    const nodeToOperateOn = getNodeToOperateOn(selectedNodes, direction);
    if (nodeToOperateOn) {
      const nextInsertLocationNode = getNextInsertLocationNode(
        nodeToOperateOn,
        direction
      );
      return getNextInsertLocationInfo(
        nodeToOperateOn,
        nextInsertLocationNode,
        direction,
        nodeTree
      );
    }

    return undefined;
  };

  const insertLocationInfoAbove = getRelativeInsertLocationInfo(
    RelativeNodePosition.Above
  );
  const insertLocationInfoBelow = getRelativeInsertLocationInfo(
    RelativeNodePosition.Below
  );
  const enableEdit = isDraftRevisionVariant(revisionStatus);

  const onDeleteSlots = useCallback(() => {
    const slots = getSelectedNodes().map((n) => n.content!);
    deleteSlots(slots);
  }, [getSelectedNodes, deleteSlots]);

  const moveToNextPosition = useCallback(
    (direction: RelativeNodePosition) => {
      const insertLocationInfo =
        direction === RelativeNodePosition.Above
          ? insertLocationInfoAbove
          : insertLocationInfoBelow;
      const slots = selectedNodes.map((n) => n.content!);
      repositionSlots(slots, insertLocationInfo!);
    },
    [
      repositionSlots,
      selectedNodes,
      getChildNodes,
      insertLocationInfoAbove,
      insertLocationInfoBelow,
    ]
  );

  const addSlotGroup = useCallback(() => {
    const selectedNodeSlots = selectedNodes.map((n) => n.content!);
    const commonConstraints =
      selectedNodeSlots.length > 0
        ? getCommonConstraints(selectedNodeSlots)
        : [];
    const targetSlot = selectedNodes[0]?.content;
    const parentSlotId = targetSlot?.parentSlotId || ROOT_NODE_ID;
    const targetSlotId = targetSlot?.id || getChildNodes(ROOT_NODE_ID)[0]?.id;
    const position =
      selectedNodeSlots.length === 0
        ? RelativeNodePosition.Above
        : RelativeNodePosition.Below;
    const targetInfo: ISlotPositioningTarget = {
      parentSlotId,
      targetSlotGroup: getChildNodes(parentSlotId).map((n) => n.content!),
      targetLocation: targetSlotId
        ? { slotId: targetSlotId, position }
        : undefined,
    };

    if (commonConstraints.length > 0)
      openSlotGroupCreationDialog({
        commonConstraints,
        slotsToGroup: selectedNodeSlots,
        target: targetInfo,
      });
    else createSlotGroup(selectedNodeSlots, targetInfo, commonConstraints);
  }, [
    selectedNodes,
    getChildNodes,
    createSlotGroup,
    openSlotGroupCreationDialog,
  ]);

  return (
    <>
      <div
        style={{
          display: "flex",
          height: 45,
          background: customTheme.actionsBackgroundColor,
        }}
      >
        {enableEdit && (
          <HeaderButton
            data-automation-id="templateEdit-structure-addClause-button"
            text="Add clause"
            iconProps={icons.add}
            disabled={isLoading}
            onClick={() => {
              openPanel(TemplateEditPanelType.AddClause);
              trackEvent("Add clause button clicked");
            }}
          />
        )}
        {enableEdit && (
          <>
            <VerticalDivider />
            <HeaderButton
              data-automation-id="templateEdit-structure-editconstraint-button"
              text="Edit constraints"
              iconProps={icons.edit}
              disabled={!hasSelection || isLoading}
              onClick={() => {
                openPanel(TemplateEditPanelType.EditConstraints);
                trackEvent("Edit constraints button clicked");
              }}
            />
          </>
        )}
        {enableEdit && (
          <>
            <HeaderButton
              data-automation-id="templateEdit-structure-addGroup-button"
              text="Add Group"
              iconProps={icons.group}
              onClick={() => {
                addSlotGroup();
                trackEvent("Add group button clicked");
              }}
            />
            <HeaderButton
              data-automation-id="templateEdit-structure-moveUp-button"
              iconProps={icons.up}
              ariaLabel="Move up"
              disabled={!insertLocationInfoAbove || isLoading}
              onClick={() => {
                moveToNextPosition(RelativeNodePosition.Above);
              }}
            />
            <HeaderButton
              data-automation-id="templateEdit-structure-moveDown-button"
              iconProps={icons.down}
              ariaLabel="Move down"
              disabled={!insertLocationInfoBelow || isLoading}
              onClick={() => {
                moveToNextPosition(RelativeNodePosition.Below);
              }}
            />
            <VerticalDivider />
          </>
        )}
        <HeaderButton
          data-automation-id="templateEdit-structure-openClause-button"
          text="Open clause"
          iconProps={icons.openFile}
          disabled={!hasNonGroupSelection || isLoading}
          onClick={() => {
            openClausePanel(nonGroupNodes[0].content!.partId);
            trackEvent("Open clause button clicked");
          }}
        />
        {enableEdit && (
          <>
            <VerticalDivider />
            <HeaderButton
              data-automation-id="templateEdit-structure-delete-button"
              text="Delete"
              iconProps={icons.delete}
              disabled={!hasSelection || isLoading}
              onClick={onDeleteSlots}
            />
          </>
        )}
      </div>
      <ProgressIndicator
        ariaValueText="Progress bar"
        styles={{
          itemProgress: {
            padding: 0,
            visibility: isLoading ? undefined : "hidden",
          },
        }}
      />
      {hasNodes(nodeTree) && (
        <div
          style={{
            display: "flex",
            height: DEFAULT_NODE_HEIGHT,
            borderBottom: `1px solid ${customTheme.divBorderColor}`,
            position: "relative",
          }}
        >
          <div
            className={css(styles.cell, styles.nodeHeader, styles.slotsHeader)}
          >
            {stringsConst.templateEdit.TemplateEditStructureHeader.clause}
          </div>
          <div
            className={css(
              styles.cell,
              styles.constraintsHeader,
              styles.slotsHeader
            )}
          >
            {stringsConst.templateEdit.TemplateEditStructureHeader.include}
          </div>

          <IconButton
            styles={iconStyles(resultState.isInit, posX)}
            onClick={toggleIsCalloutVisible}
            id="assembly"
            iconProps={{ iconName: "DocumentManagement" }}
            title="Assembly results column"
            ariaLabel="Assembly results column"
          />
          {isCalloutVisible ? (
            <Callout
              role="dialog"
              target="#assembly"
              onDismiss={toggleIsCalloutVisible}
              directionalHint={DirectionalHint.rightCenter}
              setInitialFocus
            >
              <div className={tipClass}>
                <p>{stringsConst.templateEdit.resultTooltipPart1}</p>
                <p>{stringsConst.templateEdit.resultTooltipPart2}</p>
              </div>
            </Callout>
          ) : null}
        </div>
      )}
    </>
  );
}

export default TemplateEditStructureHeader;
