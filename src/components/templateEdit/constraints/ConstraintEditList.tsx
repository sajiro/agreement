import { mergeStyleSets } from "@fluentui/react";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";
import { IConstraintTemplateEditPanel } from "models/constraints";
import { ISlotConstraint } from "models/slot";
import ConstraintEditListItem from "./ConstraintEditListItem";

const ConstraintEditListStyles = mergeStyleSets({
  listContainer: {
    height: "calc(100vh - 250px)",
    overflow: "auto",
    borderTop: `1px solid ${customTheme.menuDividerSemanticColor}`,
    paddingTop: 21,
    paddingBottom: 21,
  },
  list: {
    fontSize: 12,
    color: customTheme.bodySubText,
    display: "flex",
    flexWrap: "wrap",
    ".title": {
      width: 180,
      color: customTheme.bodyColor,
      fontSize: 14,
    },
    ".and": {
      fontSize: 10,
      marginTop: "0 !important",
      marginLeft: 7,
      marginBottom: 20,
    },
    ".sub": {
      marginRight: 5,
      width: 56,
      textAlign: "center",
    },
  },
});

export interface IConstraintEditListProps {
  constraints: ISlotConstraint[];
  usedConstraints: string[];
  onConstraintUpdated: (
    constraint: ISlotConstraint,
    constraintIndex: number,
    isRemoved?: boolean
  ) => void;
  onConstraintNoValues: (constraintIndex: number) => void;
  constraintsList: IConstraintTemplateEditPanel[] | undefined;
}

function ConstraintEditList({
  constraints,
  usedConstraints,
  onConstraintUpdated,
  onConstraintNoValues,
  constraintsList,
}: IConstraintEditListProps) {
  return (
    <div className={ConstraintEditListStyles.listContainer}>
      {constraints.map((constraint, index) => (
        <div key={`${constraint.key}-${index}`} data-automation-id={index}>
          <ConstraintEditListItem
            constraint={constraint}
            constraintIndex={index}
            constraintsList={constraintsList}
            usedConstraints={usedConstraints}
            onConstraintUpdated={onConstraintUpdated}
            onConstraintNoValues={onConstraintNoValues}
          />
          {constraints.length !== index + 1 && (
            <div className={ConstraintEditListStyles.list}>
              <div className="title" />
              <div className="sub and">
                {stringsConst.templateEdit.constraint.and}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ConstraintEditList;
