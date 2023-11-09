import { screen, render, fireEvent } from "@testing-library/react";
import React from "react";
import ConstraintCustomTextfield, {
  ConstraintCustomTextfieldProps,
} from "./ConstraintCustomTextfield";

const props: ConstraintCustomTextfieldProps = {
  disabled: false,
  constraintValue: {
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
  toggleValueDeletion: jest.fn(),
  onValueUpdated: jest.fn(),
  isFocused: false,
  index:1
};

describe("Constraint Custom Text Field", function () {
  it("doesn't render the error message", function () {
    const setStateMock = jest.fn();
    const useStateMock: any = (useState: any) => [useState, setStateMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    const { getByLabelText } = render(<ConstraintCustomTextfield {...props} />);
    const input = getByLabelText("name");
    fireEvent.change(input, {
      target: { value: "" },
    });
    expect(setStateMock).toBeCalledWith(false);
  });
  it("render the error message", function () {
    const newProps: ConstraintCustomTextfieldProps = {
      ...props,
      constraintValue: {
        errorMessage: "ERROR",
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
        name: "",
        display: "",
        id: "",
      },
    };
    const setStateMock = jest.fn();
    const useStateMock: any = () => [true, setStateMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    render(<ConstraintCustomTextfield {...newProps} />);
    const error = screen.getByText(/ERROR/i);
    expect(error).toBeInTheDocument();
  });
});
