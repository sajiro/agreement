import { render, screen, waitFor } from "test/customRender";
import { ConstraintOperator } from "models/constraints";
import ConstraintEditListItem, {
  IConstraintEditListProps,
} from "./ConstraintEditListItem";
import { server } from "test/server";
import { getConstraintMockApi, getConstraintValuesMockApi } from "test/server/serverHandlers";

const props: IConstraintEditListProps = {
  constraint: {
    key: "Test",
    keyDisplay: "test",
    keyId: "1ab1442a-f470-4c16-a96b-db6cfedda47b",
    operator: ConstraintOperator.Include,
    value: "true",
    valueDisplay: "",
  },
  constraintsList: [
    { key: "Test", name: "Test", display: "" }
  ],
  constraintIndex: 0,
  usedConstraints: ["Test"],
  onConstraintUpdated: jest.fn(),
  onConstraintNoValues: jest.fn(),
};

describe("ConstraintEditList component", function () {
  it("renders one constraint value as text", async () => {
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

    const { container } = render(<ConstraintEditListItem {...props} />);

    const item = screen.getByDisplayValue("Test");
    expect(item).toBeInTheDocument();
    const includes = screen.getByDisplayValue("=");
    expect(includes).toBeInTheDocument();

    // Constraint Values are fetched via API call, so it requires a wait
    const itemValue = await waitFor(() => screen.getByText("true"));
    expect(itemValue).toBeInTheDocument();
    expect(container.getElementsByClassName("onlyOne").length).toBe(1);
  });

  it("renders multiple constraint value as a combobox", async () => {
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
        {
          createdBy: "v-ayrastogi@microsoft.com",
          createdDate: "2022-04-29T22:20:04Z",
          display: "false",
          id: "0820eaf8-449c-43a3-b3bb-b10c186afce8",
          modifiedBy: "v-ayrastogi@microsoft.com",
          modifiedDate: "2022-04-29T22:20:04Z",
          name: "false",
          inUse: false,
        },
      ])      
    );

    const { container } = render(<ConstraintEditListItem {...props} />);
    const item = screen.getByDisplayValue("Test");
    expect(item).toBeInTheDocument();
    const includes = screen.getByDisplayValue("=");
    expect(includes).toBeInTheDocument();

    // Constraint Values are fetched via API call, so it requires a wait
    const itemValue = await waitFor(() => screen.getByDisplayValue("true"));
    expect(itemValue).toBeInTheDocument();
    expect(container.getElementsByClassName("onlyOne").length).toBe(0);
  });
});
