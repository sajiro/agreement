import ColumnDisplay, { IColumnDisplayProps } from "./ColumnDisplay";
import { render, screen, fireEvent } from "@testing-library/react";

const props: IColumnDisplayProps = {
  values: ["test", "test two", "test three"],
  maxColumnCount: 3,
  minValuesPerColumn: 1,
  noValuesMessage: "No Values",
  isSmallSection: false,
  minWidth: 160,
  styled: {},
};

describe("ColumnDisplay component", function () {
  it("renders in 3 columns", function () {
    const { container } = render(
      <ColumnDisplay {...props} values={["test", "test two", "test three"]} />
    );
    const column = container!.firstChild!.firstChild!.childNodes;
    column.forEach((item, index) => {
      expect(item!.firstChild!.firstChild!.nodeValue).toStrictEqual(
        props.values[index]
      );
    });
  });
  it("shows message when no values", function () {
    const newProps = {
      ...props,
      values: [],
    };
    render(<ColumnDisplay {...newProps} />);

    const message = screen.getByText(/No Values/i);
    expect(message).toBeInTheDocument();
  });
});
