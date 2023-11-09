import { screen, render, fireEvent } from "@testing-library/react";
import { IConstraintValuesEditor } from "models/constraintMutation";
import ConstraintValuesCreator from "./ConstraintValuesCreator";
import stringsConst from "consts/strings";

const props: {
  constraintValuesEditor: IConstraintValuesEditor;
  isSubmitting: boolean;
  isNewConstraint: boolean;
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
        display: "Test",
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
  isNewConstraint: true,
};

describe("ConstraintValuesCreator", function () {
  it("renders correct heading if new constraint", function () {
    render(<ConstraintValuesCreator {...props} />);
    const label = screen.getByText(
      stringsConst.constraint.ConstraintGroupedList.headingValues
    );
    expect(label).toBeInTheDocument();
  });
  it("renders correct heading if not a new constraint", function () {
    const newProps = { ...props, isNewConstraint: false };
    render(<ConstraintValuesCreator {...newProps} />);
    const label = screen.getByText(
      stringsConst.constraintPanel.ConstraintValuesCreator.newValues
    );
    expect(label).toBeInTheDocument();
  });
  it("calls the right function on delete", function () {
    render(<ConstraintValuesCreator {...props} />);

    const button = screen.getByText(
      stringsConst.constraintPanel.ConstraintValuesCreator.addSingleValueBtn
    );
    fireEvent.click(button);
    expect(props.constraintValuesEditor.addConstraintValues).toBeCalled();
  });
  it("renders new constraints", function () {
    render(<ConstraintValuesCreator {...props} />);

    const label1 = screen.getByText(stringsConst.common.listings.nameValue);
    const label2 = screen.getByText(stringsConst.common.infoItems.friendlyName);
    expect(label1).toBeInTheDocument();
    expect(label2).toBeInTheDocument();
  });
  it("renders new constraints input", function () {
    render(<ConstraintValuesCreator {...props} />);

    const input = screen.getByDisplayValue("test");
    expect(input).toBeInTheDocument();
  });
});
