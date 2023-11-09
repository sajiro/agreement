import { screen, render, fireEvent } from "@testing-library/react";
import stringsConst from "consts/strings";
import { IConstraintInfoEditor } from "models/constraintMutation";
import ConstraintCreator from "./ConstraintCreator";

const props: {
  constraintInfoEditor: IConstraintInfoEditor;
  isSubmitting: boolean;
} = {
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
  isSubmitting: false,
};

describe("Constraint Creator", function () {
  it("onchange works", function () {
    render(<ConstraintCreator {...props} />);

    const keyValueLabel = screen.getByLabelText(
      stringsConst.constraintPanel.ConstraintCreator.constraintNameLabel
    );
    expect(keyValueLabel).toHaveValue("");
    fireEvent.change(keyValueLabel, { target: { value: "test" } });
    expect(props.constraintInfoEditor.setConstraintName).toHaveBeenCalledTimes(
      1
    );
    expect(props.constraintInfoEditor.setConstraintName).toHaveBeenCalledWith(
      "test",
      "name"
    );
  });
  it("renders the input value from constraint info prop", function () {
    const props: {
      constraintInfoEditor: IConstraintInfoEditor;
      isSubmitting: boolean;
    } = {
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
          name: "test",
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
      isSubmitting: false,
    };

    render(<ConstraintCreator {...props} />);

    const keyValueLabel = screen.getByLabelText(
      stringsConst.constraintPanel.ConstraintCreator.constraintNameLabel
    );

    expect(keyValueLabel).toHaveValue("test");
  });
});
