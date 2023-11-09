import { render, screen, waitFor } from "test/customRender";
import { ConstraintOperator } from "models/constraints";
import ConstraintEditList, {
  IConstraintEditListProps,
} from "./ConstraintEditList";
import { server } from "test/server";
import { getConstraintMockApi, getConstraintValuesMockApi } from "test/server/serverHandlers";

const props: IConstraintEditListProps = {
  constraints: [
    {
      key: "Test",
      operator: ConstraintOperator.Include,
      value: "true",
      valueDisplay: "",
      keyId: "1ab1442a-f470-4c16-a96b-db6cfedda47b",
    },
  ],
  constraintsList: [
    { key: "Test", name: "Test", display: "" }
  ],
  usedConstraints: ["Test"],
  onConstraintUpdated: jest.fn(),
  onConstraintNoValues: jest.fn(),
};

describe("ConstraintEditList component", function () {
  beforeEach(() => {
    server.use(
      getConstraintMockApi(),
      getConstraintValuesMockApi([
        {
          createdBy: "v-ayrastogi@microsoft.com",
          createdDate: "2022-04-29T22:20:04Z",
          display: "true",
          id: "0820eaf8-449c-43a3-b3bb-b10c186afce8",
          modifiedBy: "v-ayrastogi@microsoft.com",
          modifiedDate: "2022-04-29T22:20:04Z",
          name: "true",
          inUse: false,
        },        
      ])
    );
  });

  it("renders the correct items as include", async () => {
    render(<ConstraintEditList {...props} />);

    const item = screen.getByDisplayValue("Test");
    expect(item).toBeInTheDocument();
    const includes = screen.getByDisplayValue("=");
    expect(includes).toBeInTheDocument();

    // Constraint Values are fetched via API call, so it requires a wait
    const itemValue = await waitFor(() => screen.getByText("true"));
    expect(itemValue).toBeInTheDocument();
  });

  it("renders an exclude", async () => {
    const newProps = {
      ...props,
      constraints: [
        {
          key: "Test",
          operator: ConstraintOperator.Exclude,
          value: "true",
          valueDisplay: "",
          keyId: "1ab1442a-f470-4c16-a96b-db6cfedda47b",
        },
      ],
      usedConstraints: ["Test"],
    };
    render(<ConstraintEditList {...newProps} />);

    const item = screen.getByDisplayValue("Test");
    expect(item).toBeInTheDocument();
    const excludes = screen.getByDisplayValue("!=");
    expect(excludes).toBeInTheDocument();

    // Constraint Values are fetched via API call, so it requires a wait
    const itemValue = await waitFor(() => screen.getByText("true"));
    expect(itemValue).toBeInTheDocument();
  });
});
