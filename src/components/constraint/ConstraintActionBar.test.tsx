import ConstraintActionBar from "./ConstraintActionBar";
import { fireEvent } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import useConstraintPanel from "hooks/constraint/useConstraintPanel";
import useConstraintDialog from "hooks/constraint/useConstraintDialog";

let mockFunction1 = jest.fn();
let mockFunction2 = jest.fn();

jest.mock("hooks/constraint/useConstraintPanel", () => () => ({
  openPanel: mockFunction1,
}));

jest.mock("hooks/constraint/useConstraintDialog", () => () => ({
  openDeletionDialog: mockFunction2,
}));

const props = {
  constraintId: "1234",
  constraintValues: [
    {
      inUse: false,
      createdBy: "",
      createdDate: "",
      modifiedBy: "Test Name",
      modifiedDate: "2021-10-22T20:55:24.0361323Z",
      valuesUri: "",
      id: "123",
      name: "Test Constraint Value",
      display: "Test Constraint Value",
    },
  ],
};

describe("Constraint Action Bar", function () {
  it("renders the Delete button if a value is not in use", function () {
    const { getByText } = render(<ConstraintActionBar {...props} />, {
      preloadedState: {} as RootState,
    });
    const heading = getByText(/Edit/i);
    const valueName = getByText(/Delete/i);
    expect(heading).toBeInTheDocument();
    expect(valueName).toBeInTheDocument();
  });
  it("calls the openConstraintPanel and openDeletionDialog fns if a value is not in use", function () {
    const { getByText } = render(<ConstraintActionBar {...props} />, {
      preloadedState: {} as RootState,
    });
    const editButton = getByText(/Edit/i);
    const deleteButton = getByText(/Delete/i);
    fireEvent.click(editButton);
    expect(mockFunction1).toHaveBeenCalledWith("1234", "Edit");
    fireEvent.click(deleteButton);
    expect(mockFunction2).toHaveBeenCalledWith({
      constraintId: props.constraintId,
      existingConstraintValues: props.constraintValues,
    });
  });
  it("does not render the Delete button if a constraint value is in use", function () {
    const newProps = {
      constraintId: "1234",
      constraintValues: [
        {
          createdBy: "",
          createdDate: "",
          modifiedBy: "Test Name",
          modifiedDate: "2021-10-22T20:55:24.0361323Z",
          valuesUri: "",
          id: "123",
          name: "Test Constraint Value",
          display: "Test Constraint Value",
          inUse: true,
        },
      ],
    };

    const { getByText, queryByText } = render(
      <ConstraintActionBar {...newProps} />,
      {
        preloadedState: {} as RootState,
      }
    );
    const heading = getByText(/Edit/i);
    const valueName = queryByText(/Delete/i);
    expect(heading).toBeInTheDocument();
    expect(valueName).not.toBeInTheDocument();
  });
});
