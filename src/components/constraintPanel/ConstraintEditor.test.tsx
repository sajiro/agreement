import { screen, render, fireEvent } from "@testing-library/react";
import ConstraintEditor, { ConstraintEditorProps } from "./ConstraintEditor";
import ConstraintCreator from "./ConstraintCreator";
import ConstraintValuesCreator from "./ConstraintValuesCreator";
import ConstraintValuesRemover from "./ConstraintValuesRemover";
import LockedConstraintValuesDisplay from "./LockedConstraintValuesDisplay";

jest.mock("./ConstraintCreator", () => () => (
  <div data-testid="constraintCreator">
    <p>Test</p>
  </div>
));

jest.mock("./ConstraintValuesCreator", () => () => (
  <div data-testid="constraintValuesCreator">
    <p>Test</p>
  </div>
));

jest.mock("./ConstraintValuesRemover", () => () => (
  <div data-testid="constraintValuesRemover">
    <p>Test</p>
  </div>
));

jest.mock("./LockedConstraintValuesDisplay", () => () => (
  <div data-testid="lockedConstraintValuesDisplay">
    <p>Test</p>
  </div>
));

const props: ConstraintEditorProps = {
  constraintInfoEditor: {
    constraintInfo: {
      originalContent: {
        name: "",
        display: "",
      },
      errorMessage: "",
      isModified: false,
      isValid: false,
      id: "",
      name: "",
      display: "",
      createdBy: "",
      createdDate: "",
      modifiedBy: "",
      modifiedDate: "",
      valuesUri: "",
    },
    setConstraintName: jest.fn(),
    clear: jest.fn(),
  },
  constraintValuesEditor: {
    newConstraintValues: [],
    removableConstraintValues: [],
    lockedConstraintValues: [],
    updateNewConstraintValue: jest.fn(),
    addConstraintValues: jest.fn(),
    removeNewConstraintValue: jest.fn(),
    toggleConstraintValueDeletion: jest.fn(),
    clear: jest.fn(),
  },
  isNewConstraint: true,
  isSubmitting: false,
};

describe("Constraint Editor", function () {
  it("if is a new constraint", function () {
    render(<ConstraintEditor {...props} />);

    const constraintCreator = screen.queryByTestId("constraintCreator");
    const constraintValuesCreator = screen.queryByTestId(
      "constraintValuesCreator"
    );
    const constraintValuesRemover = screen.queryByTestId(
      "constraintValuesRemover"
    );
    const lockedConstraintValuesDisplay = screen.queryByTestId(
      "lockedConstraintValuesDisplay"
    );

    expect(constraintCreator).toBeTruthy();
    expect(constraintValuesCreator).toBeTruthy();
    expect(constraintValuesRemover).toBeFalsy();
    expect(lockedConstraintValuesDisplay).toBeFalsy();
  });
  it("if is not a new constraint", function () {
    const newProps = {
      ...props,
      isNewConstraint: false,
    };
    render(<ConstraintEditor {...newProps} />);

    const constraintCreator = screen.queryByTestId("constraintCreator");
    const constraintValuesCreator = screen.queryByTestId(
      "constraintValuesCreator"
    );
    const constraintValuesRemover = screen.queryByTestId(
      "constraintValuesRemover"
    );
    const lockedConstraintValuesDisplay = screen.queryByTestId(
      "lockedConstraintValuesDisplay"
    );

    expect(constraintCreator).toBeFalsy();
    expect(constraintValuesCreator).toBeTruthy();
    expect(constraintValuesRemover).toBeTruthy();
    expect(lockedConstraintValuesDisplay).toBeTruthy();
  });
});
