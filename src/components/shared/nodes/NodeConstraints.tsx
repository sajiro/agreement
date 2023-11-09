import { mergeStyles, mergeStyleSets } from "@fluentui/react/lib/Styling";
import { ConstraintOperator } from "models/constraints";
import { ISlotConstraint } from "models/slot";

const NodeConstraintsClass = mergeStyleSets({
  tableContent: {
    "> td": {
      verticalAlign: "baseline",
      fontSize: "12px",
    },
  },
});

const DotClass = mergeStyles({
  position: "absolute",
  right: 15,
  height: 8,
  width: 8,
  borderRadius: "50%",
  backgroundColor: "green",
  top: 15,
});

export function ConstraintDisplay({
  show,
  constraints,
}: {
  show?: boolean;
  constraints: ISlotConstraint[];
}) {
  const dotStyle = (showDot: boolean) => ({
    transform: !showDot ? "scale(0)" : "scale(1)",
    // transition: "all .5s",
  });

  const constraintDisplayValueHelper = (
    displayValue: string | undefined,
    name: string | undefined
  ) => {
    let displayValueArray: string[] = [];
    if (displayValue) {
      displayValueArray = displayValue.split(",");
    }

    return displayValue?.length === 0
      ? name!.replace(/, ([^,]*)$/, " or $1")
      : displayValueArray
          .map((i, index) => i || name!.split(",")[index])
          .join(", ")
          .replace(/, ([^,]*)$/, " or $1");
  };
  return (
    <>
      <table>
        <tbody>
          {constraints.map((constraint, index) => (
            <tr
              key={`constraint_${index}`}
              className={NodeConstraintsClass.tableContent}
            >
              <td style={{ whiteSpace: "nowrap" }}>
                {constraint.keyDisplay === ""
                  ? constraint.key
                  : constraint.keyDisplay}
              </td>
              <td>
                {constraint.operator === ConstraintOperator.Include
                  ? "="
                  : "!="}
              </td>
              <td>
                {constraintDisplayValueHelper(
                  constraint.valueDisplay,
                  constraint.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={DotClass} style={dotStyle(show!)} />
    </>
  );
}

function NodeConstraints({
  show,
  constraints,
}: {
  show: boolean;
  constraints: ISlotConstraint[];
}) {
  return (
    <div
      style={{
        display: "flex",
        transition: "max-height .3s",
        lineHeight: "20px",
      }}
    >
      <ConstraintDisplay show={show} constraints={constraints} />
    </div>
  );
}

export default NodeConstraints;
