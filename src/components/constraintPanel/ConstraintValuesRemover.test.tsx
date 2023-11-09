import { screen, render, fireEvent } from "@testing-library/react";
import { IConstraintValuesEditor } from "models/constraintMutation";
import ConstraintValuesRemover from "./ConstraintValuesRemover";
import stringsConst from "consts/strings";

const props: {
  constraintValuesEditor: IConstraintValuesEditor;
  isSubmitting: boolean;
} = {
  isSubmitting: false,
  constraintValuesEditor: {
    newConstraintValues: [
      {
        errorMessage: "",
        isDeleted: false,
        originalContent: {
          name: "",
          display: "",
        },
        isModified: false,
        isValid: false,
        createdBy: "",
        createdDate: "",
        modifiedBy: "",
        modifiedDate: "",
        inUse: false,
        name: "test",
        display: "",
        id: "",
      },
    ],
    removableConstraintValues: [
      {
        errorMessage: "",
        isDeleted: false,
        originalContent: {
          name: "",
          display: "",
        },
        isModified: false,
        isValid: false,
        createdBy: "",
        createdDate: "",
        modifiedBy: "",
        modifiedDate: "",
        inUse: false,
        name: "test",
        display: "Test",
        id: "",
      },
    ],
    lockedConstraintValues: [
      {
        inUse: false,
        id: "123",
        name: "test",
        display: "Test",
        createdBy: "",
        createdDate: "",
        modifiedBy: "",
        modifiedDate: "",
      },
    ],
    updateNewConstraintValue: jest.fn(),
    addConstraintValues: jest.fn(),
    removeNewConstraintValue: jest.fn(),
    toggleConstraintValueDeletion: jest.fn(),
    clear: jest.fn(),
  },
};

describe("ConstraintValuesRemover", function () {
  it("shows a message if no removable constraint values", function () {
    const newProps = {
      ...props,
      constraintValuesEditor: {
        ...props.constraintValuesEditor,
        removableConstraintValues: [],
      },
    };
    render(<ConstraintValuesRemover {...newProps} />);
    const label = screen.getByText(
      stringsConst.constraintPanel.ConstraintValuesRemover.deletableValues
    );
    expect(label).toBeInTheDocument();
  });
  it("renders a textfield with value", function () {
    render(<ConstraintValuesRemover {...props} />);
    const input = screen.getByDisplayValue("Test (test)");
    expect(input).toBeInTheDocument();
  });
});
