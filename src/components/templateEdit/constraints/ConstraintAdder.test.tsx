import { render, screen, fireEvent } from "@testing-library/react";
import stringsConst from "consts/strings";
import ConstraintAdder, { ConstraintEditAdderProps } from "./ConstraintAdder";

const props: ConstraintEditAdderProps = {
  usedConstraints: [],
  onConstraintSelected: jest.fn(),
  constraintsList: [
    { key: "Test", name: "Test", display: "" }
  ],
};

describe("ConstraintAdder component", function () {
  it("renders the combobox after clicking the action button", function () {
    render(<ConstraintAdder {...props} />);
    const button = screen.getByText(
      stringsConst.templateEdit.constraint.addConstraints
    );
    expect(button).toBeInTheDocument();
    const listbox = screen.queryByRole("listbox");
    expect(listbox).not.toBeInTheDocument();
    fireEvent.click(button);
    const listboxUpdate = screen.queryByRole("listbox");
    expect(listboxUpdate).toBeInTheDocument();
  });

  it("renders the correct items in the custom combobox", function () {
    render(<ConstraintAdder {...props} />);
    const button = screen.getByText(
      stringsConst.templateEdit.constraint.addConstraints
    );
    fireEvent.click(button);
    const listboxUpdate = screen.queryByRole("listbox");
    expect(listboxUpdate).toBeInTheDocument();
    const constraintValue = screen.getByText("Test");
    expect(constraintValue).toBeInTheDocument();
  });
});
