import { useCallback, useEffect } from "react";
import { DetailsRow } from '@fluentui/react/lib/DetailsList';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { IPublishedClause } from "models/clauses"
import { IDragDropItem, NodeDragDropObjectType } from "models/node";
import { RootState } from "store";
import { useSelector } from "react-redux";

interface IClauseRowProps {
  getSelectedClauses: () => IPublishedClause[];
  onClausesAdded: () => void;
  toggleDragState: (isDragging: boolean) => void;
  customProps?: any;
  clause: IPublishedClause;
}

const clauseListClass = mergeStyleSets({
  clauseRow: {
    borderBottom: "0px"
  }
});

function ClauseRow({ getSelectedClauses, toggleDragState, onClausesAdded, customProps, clause }: IClauseRowProps) {
  const { isLoading } = useSelector((state: RootState) => state.templateEdit);

  const getNodeDragDropItem = useCallback(() => {
    const selectedClauses = getSelectedClauses();
    return { type: NodeDragDropObjectType.Clause, item: selectedClauses };
  }, [getSelectedClauses, clause]);

  const [{ isDragging }, drag, dragPreview] = useDrag<IDragDropItem, IDragDropItem, { isDragging: boolean; }>(() => ({
    type: NodeDragDropObjectType.Clause.toString(),
    item: getNodeDragDropItem,
    canDrag: () => !isLoading,
    end: (_item, monitor) => {
      if (monitor.didDrop()) onClausesAdded();
      toggleDragState(false);
    },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() })
  }), [isLoading, getNodeDragDropItem, toggleDragState]);

  useEffect(() => {
    if (isDragging) {
      toggleDragState(isDragging);
    }
  }, [isDragging, toggleDragState, clause]);

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div ref={drag} title={clause.name} data-automation-id="templateEdit-structure-addClausePanel-clause">
      <DetailsRow {...customProps!} className={clauseListClass.clauseRow} />
    </div>
  );
}
export default ClauseRow