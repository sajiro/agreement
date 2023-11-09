import { useState, useEffect } from "react";
import { DetailsList, IDetailsListProps, Selection, IColumn, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { ScrollablePane, IScrollablePaneStyles } from "@fluentui/react/lib/ScrollablePane";
import { IPublishedClause } from "models/clauses"
import ClauseRow from "./ClauseRow";

const listingColumns: IColumn[] = [
  {
    key: "name",
    name: "name",
    fieldName: "name",
    minWidth: 80,
    maxWidth: 120,
  },
];
const scrollablePaneStyles: Partial<IScrollablePaneStyles> = {
  root: {
    overflowX: "hidden",
  },
  stickyAbove: {
    paddingRight: 32,
  },
  contentContainer: {
    paddingRight: 32,
  },
};
const onRenderRow: IDetailsListProps["onRenderRow"] = (props) => {
  const { onClausesAdded, getSelectedClauses, toggleDragState, ...clauseInfo } = props!.item
  return (
    <ClauseRow
      clause={clauseInfo}
      onClausesAdded={onClausesAdded}
      getSelectedClauses={getSelectedClauses}
      toggleDragState={toggleDragState}
      customProps={props}
    />
  );
};

type ClauseListProps = { 
  clauses: IPublishedClause[];
  selection: Selection;
  onClausesAdded: () => void;
  getSelectedClauses: () => IPublishedClause[];
  toggleDragState: (isDragging: boolean) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ClauseList({ clauses, selection, onClausesAdded, getSelectedClauses, toggleDragState }: ClauseListProps) {
  const [draggableClauses, setDraggableClauses] = useState<IPublishedClause[]>([]);
  
  useEffect(() => {
    setDraggableClauses(clauses.map(clause => ({
      ...clause,
      onClausesAdded,
      getSelectedClauses,
      toggleDragState
    })));
  }, [clauses, toggleDragState, getSelectedClauses, onClausesAdded]);

  const onRenderDetailsHeader = () => null;

  return (
    <div
      style={{
        position: "relative",
        height: "Calc(100vh - 266px)",
        marginTop: "20px",
      }}
    >
      <ScrollablePane
        scrollContainerFocus
        scrollContainerAriaLabel="Sticky component example"
        styles={scrollablePaneStyles}
      >
        <DetailsList
          items={draggableClauses}
          setKey="set"
          getKey={(item: IPublishedClause) => item.key}
          checkboxVisibility={1}
          columns={listingColumns}
          selection={selection}
          selectionMode={SelectionMode.multiple}
          onRenderDetailsHeader={onRenderDetailsHeader}
          onRenderRow={onRenderRow}
          checkButtonAriaLabel="select row"
        />
      </ScrollablePane>
    </div>
  );
}
export default ClauseList;
