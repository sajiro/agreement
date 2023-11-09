import Forms, { FormProps } from "./Forms";
import { render, screen, fireEvent } from "@testing-library/react";
import { isUndefined } from "lodash";

export enum FormFieldType {
  textField,
  select,
  picker,
  clauseLabelDropDown,
}

export interface ICustomFormField {
  type: FormFieldType;
  label: string;
  defaultValue: string | undefined;
  value: string | undefined;
  propertyType: string;
  propertyName: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
  ownerObjectId?: string; // owner of the form: templateId, etc.
}

const props: FormProps = {
  onPropertyChanged: jest.fn(),
  formFields: [
    {
      type: FormFieldType.textField,
      label: "Test Textfield",
      defaultValue: undefined,
      value: undefined,
      propertyType: "properties",
      propertyName: "name",
    },
    {
      type: FormFieldType.select,
      label: "Test Select",
      defaultValue: "Default",
      value: undefined,
      propertyType: "properties",
      propertyName: "category",
      options: [
        { key: "Default", text: "Default" },
        { key: "OptionOne", text: "Option One" },
      ],
    },
  ],
  onPropertyBlur: jest.fn(),
};

describe("Forms component", function () {
  it("renders my form fields", function () {
    render(<Forms {...props} />);

    const label = screen.getByLabelText("Test Textfield", { exact: true });
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("type", "text");
    const label2 = screen.getByLabelText("Test Select", { exact: true });
    expect(label2).toBeInTheDocument();
  });
  it("renders my combobox", function () {
    render(<Forms {...props} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    fireEvent.click(select);
    const dropDownText = screen.getByText("Option One");
    expect(dropDownText).toBeInTheDocument();
  });
});
