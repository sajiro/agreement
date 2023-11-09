import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Panel,
  PanelType,
  SearchBox,
  StackItem,
  Separator,
  CommandBarButton,
} from "@fluentui/react";
import { Selection, SelectionMode } from "@fluentui/react/lib/DetailsList";
import { Text } from "@fluentui/react/lib/Text";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import { IPublishedClause } from "models/clauses";
import useObserver from "hooks/useObserver";
import { useGetPublishedClausesQuery } from "services/clause";
import { RelativeNodePosition } from "models/node";
import { useSelector } from "react-redux";
import { RootState } from "store";
import _ from "lodash";
import { useRefresh } from "hooks/useRefresh";
import { ROOT_NODE_ID } from "consts/globals";
import stringsConst from "consts/strings";
import { useTrackingContext } from "components/shared/TrackingContext";
import icons from "../../shared/Icons";
import ClauseList from "./ClauseList";
import { useTemplateEditStructureNodeManager } from "../structure/TemplateEditStructureNodeManager";
import { useTemplateStructureEditor } from "../../../hooks/template/mutation/useTemplateStructureEditor";

const addClausePanelClass = mergeStyleSets({
  clauseContent: {
    height: "calc(100vh - 265px)",
    overflow: "auto",
    marginTop: "20px",
  },
  commandBarContainer: {
    paddingTop: "20px",
  },
  addButtons: {
    fontSize: "12px",
    padding: "12px",
  },
  addClauseText: {
    fontSize: "12px",
  },
  clausePanel: {
    height: "100%",
    zIndex: 1,
  },
});

function AddClausePanel({ closePanel }: { closePanel: () => void }) {
  const { isLoading } = useSelector((state: RootState) => state.templateEdit);
  const { currentData } = useGetPublishedClausesQuery();
  const {
    nodeTree,
    nodeSelection,
    toggleDragState,
    getSelectedNodes,
    getChildNodes,
  } = useTemplateEditStructureNodeManager();
  const { createClauseSlots } = useTemplateStructureEditor();
  useObserver(nodeSelection.observable);
  const nodeTreeRefreshToken = useObserver(nodeTree.observable); // Need to update unused clauses if node tree was refreshed
  const { trackEvent } = useTrackingContext();

  const unUsedClausesRef = useRef<IPublishedClause[]>([]);
  const filterTextRef = useRef<string>("");
  const [filterUpdatedToken, triggerFilterUpdate] = useRefresh();
  const [filteredClauses, setFilteredClauses] = useState<
    IPublishedClause[] | undefined
  >();
  const [clausesSelected, setClausesSelected] = useState<boolean>(false);
  const selectedNodes = getSelectedNodes();

  const selection = useMemo(
    () =>
      new Selection({
        selectionMode: SelectionMode.multiple,
        onSelectionChanged: () => {
          setClausesSelected(selection.count > 0);
        },
      }),
    [setClausesSelected]
  );

  const getSelectedClauses = useCallback(() => {
    const clauses = selection.getSelection() as IPublishedClause[];
    return _.cloneDeep(clauses);
  }, [selection]);

  const onClausesAdded = useCallback(() => {
    const selectedClauseIds = getSelectedClauses().map((c) => c.key);
    selection.setAllSelected(false);
    unUsedClausesRef.current = unUsedClausesRef.current.filter(
      (c) => !selectedClauseIds.includes(c.key)
    );
    triggerFilterUpdate(); // Force filtered list refresh as unused clause list has updated
  }, [getSelectedClauses, selection]);

  const addClauses = useCallback(
    (position: RelativeNodePosition) => {
      const rootLevelNodes = getChildNodes(ROOT_NODE_ID);
      const noSelectionTargetNode =
        position === RelativeNodePosition.Above
          ? rootLevelNodes[0]
          : rootLevelNodes[rootLevelNodes.length - 1];
      const targetNode =
        selectedNodes.length === 0 ? noSelectionTargetNode : selectedNodes[0];
      const parentSlotId = targetNode?.parentId || ROOT_NODE_ID;
      const clauses = getSelectedClauses();
      const targetSlotGroup = getChildNodes(parentSlotId).map(
        (n) => n.content!
      );
      const targetLocation = targetNode
        ? { slotId: targetNode.id, position }
        : undefined;
      createClauseSlots(clauses, {
        parentSlotId,
        targetSlotGroup,
        targetLocation,
      });
      onClausesAdded();
    },
    [
      selectedNodes,
      getChildNodes,
      createClauseSlots,
      getSelectedClauses,
      onClausesAdded,
    ]
  );

  useEffect(() => {
    const selectedClauseIds = getSelectedClauses().map((c) => c.key);
    let clauses = filterTextRef.current
      ? unUsedClausesRef.current.filter(
          (i) =>
            i.name
              .toLowerCase()
              .indexOf(filterTextRef.current.toLocaleLowerCase()) > -1
        )
      : unUsedClausesRef.current;
    clauses = clauses.filter((c) => !selectedClauseIds.includes(c.key));
    clauses = [...getSelectedClauses(), ...clauses];
    setFilteredClauses(clauses);
  }, [filterUpdatedToken, getSelectedClauses, setFilteredClauses]);

  useEffect(() => {
    if (currentData) {
      // Slot Groups will not have clauses attached (will not have part id)
      const usedClauseIds = Object.values(nodeTree.nodes)
        .filter((n) => n.content && n.content.partId)
        .map((n) => n.content!.partId);
      const usedClauseIdSet = new Set<string>(usedClauseIds);
      const unUsedClauses = currentData.filter(
        (c) => !usedClauseIdSet.has(c.key)
      );
      unUsedClausesRef.current = unUsedClauses;
      triggerFilterUpdate(); // Force filtered list refresh as unused clause list has updated
    }
  }, [currentData, nodeTreeRefreshToken, triggerFilterUpdate]);

  return (
    <Panel
      isOpen
      isBlocking={false}
      type={PanelType.custom}
      customWidth="500px"
      className={addClausePanelClass.clausePanel}
      headerText="Add Clauses"
      onDismiss={closePanel}
      data-automation-id="templateEdit-structure-addClause-panel"
      layerProps={{
        hostId: "TemplateEditStructureLayer",
        insertFirst: true,
        eventBubblingEnabled: true,
        onLayerWillUnmount: () => {
          document.body.style.removeProperty("overflow");
        },
        onLayerDidMount: () => {
          document.body.style.overflow = "hidden";
        },
      }}
      closeButtonAriaLabel="Add clause panel close button"
    >
      <Text className={addClausePanelClass.addClauseText}>
        {stringsConst.templateEdit.AddClausePanel.desc}
      </Text>

      <div className={addClausePanelClass.commandBarContainer}>
        <CommandBarButton
          data-automation-id="templateEdit-structure-addClausePanel-addTopButton"
          className={addClausePanelClass.addButtons}
          disabled={!clausesSelected || isLoading}
          iconProps={icons.addToTop}
          text={selectedNodes.length > 0 ? "Add above" : "Add to top"}
          onClick={() => {
            addClauses(RelativeNodePosition.Above);
            trackEvent("Add to top button clicked");
          }}
        />
        <CommandBarButton
          data-automation-id="templateEdit-structure-addClausePanel-addBottomButton"
          className={addClausePanelClass.addButtons}
          disabled={!clausesSelected || isLoading}
          iconProps={icons.addToBottom}
          text={selectedNodes.length > 0 ? "Add below" : "Add to bottom"}
          onClick={() => {
            addClauses(RelativeNodePosition.Below);
            trackEvent("Add to bottom button clicked");
          }}
        />
      </div>
      <Separator />
      <StackItem style={{ padding: "0px", width: "300px" }}>
        <SearchBox
          data-automation-id="addclausesearchbox"
          placeholder="Filter by name"
          width="300px"
          onChange={(event) => {
            const text = event?.currentTarget.value as string;
            filterTextRef.current = text;
            triggerFilterUpdate();
          }}
        />
      </StackItem>

      <ClauseList
        clauses={filteredClauses || []}
        selection={selection}
        onClausesAdded={onClausesAdded}
        getSelectedClauses={getSelectedClauses}
        toggleDragState={toggleDragState}
      />
    </Panel>
  );
}
export default AddClausePanel;
