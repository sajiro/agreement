import { ConstraintOperator } from "models/constraints";
import { RootState } from "store";
import { render, screen, fireEvent } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import CustomComboBox, { ICustomComboBox } from "./index";

// this test uses the mock api https://template.int.l2o.microsoft.com/v1/ui/constraint/21ba8270-d5a2-4965-b41f-9c600ce89716/values in \src\test\server\serverHandlers.ts

const props: ICustomComboBox = {
  item: {
    valueDisplay: "",
    key: "",
    keyDisplay: "",
    value: "",
    operator: ConstraintOperator.Include,
    keyId: "",
  },
  clear: true,
  label: "Applicable Law",
  className: "",
  styles: {},
  options: [],
  selectedKey: "",
  placeholder: "select an option",
  onOptionSelected: () => {},
  id: "AppLawTest555",
  idQuery: "21ba8270-d5a2-4965-b41f-9c600ce89716",
  triggerNoValues: () => {},
};

describe("previewPanel customComboBox", () => {
  it("has the ability to remove a selection", async function () {
    render(<CustomComboBox {...props} />, {
      preloadedState: {} as RootState,
    });

    const label = await screen.findByText(props.label!);
    expect(label).toBeInTheDocument();

    const placeholder = await screen.getByPlaceholderText(props.placeholder!);
    expect(placeholder).toBeInTheDocument();

    fireEvent.click(placeholder);
    const option1 = screen.getByText("test 1");
    expect(option1).toBeInTheDocument();
    expect(screen.getByText("test 2")).toBeInTheDocument();
    expect(screen.getByText("test 3")).toBeInTheDocument();
    expect(screen.getByText("Blah 4")).toBeInTheDocument();

    fireEvent.click(option1);
    const clearButton = screen.getByLabelText("clear");
    expect(clearButton).toBeInTheDocument();
    const inputValue = screen.getByDisplayValue("test 1");
    expect(inputValue).toBeInTheDocument();
    expect(screen.queryByText("test 2")).toBeNull();
    fireEvent.click(clearButton);
    const emptyValue = screen.getByDisplayValue("");
    expect(emptyValue).toBeInTheDocument();
    expect(clearButton).not.toBeInTheDocument();
  });
});
