import { render } from "@testing-library/react";
import CustomTextField from "./CustomTextField";
import { FormFieldType } from "models/properties";

const props = {
  type: FormFieldType.textField,
  propertyName: "name",
  propertyType: "properties",
  defaultValue: "test",
  value: "test",
  label: "Clause name",
  required: true,
  disabled: false,
  placeholder: "placeholder",
  onPropertyChangedHandler: jest.fn(),
  onPropertyBlurHandler: jest.fn(),
};

describe("Custom Textfield", function () {
  it("renders the correct label", function () {
    const { getByText } = render(<CustomTextField {...props} />);

    expect(getByText(props.label)).toBeInTheDocument();
  });
});
