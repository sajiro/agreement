import { screen, render, fireEvent } from "@testing-library/react";
import ConstraintValueTextField, {
  ConstraintValueTextFieldProps,
} from "./ConstraintValueTextField";

const props: ConstraintValueTextFieldProps = {
  disabled: false,
  disableTextInput: false,
  constraintValue: {
    isDeleted: false,
    inUse: false,
    id: "123",
    name: "test",
    display: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    errorMessage: "",
    originalContent: {
      name: "",
      display: "",
    },
    isModified: false,
    isValid: false,
  },
  onValueUpdated: jest.fn(),
  toggleValueDeletion: jest.fn(),
};

describe("ConstraintValueTextField", function () {
  it("renders the text value", function () {
    render(<ConstraintValueTextField {...props} />);
    const input = screen.getByDisplayValue("test");
    expect(input).toBeInTheDocument();
  });
  it("calls the right function on change", function () {
    render(<ConstraintValueTextField {...props} />);
    const input = screen.getByDisplayValue("test");
    fireEvent.change(input, {
      target: { value: "" },
    });
    expect(props.onValueUpdated).toBeCalled();
  });
  it("calls the right function on delete", function () {
    render(<ConstraintValueTextField {...props} />);
    const button = screen.getByLabelText("toggle deletion for test");
    fireEvent.click(button);
    expect(props.toggleValueDeletion).toBeCalled();
  });
});
