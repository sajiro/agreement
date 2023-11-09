import { render, screen } from "test/customRender";
import DeleteOrphan from "components/shared/DeleteOrphan";
import TemplateEditDeleteOrphan from "./TemplateEditDeleteOrphan";

// jest.mock("components/shared/DeleteOrphan", () => () => (
//   <div data-testid="deleteOrphan">
//     <p>Test</p>
//   </div>
// ));

const mockChildComponent = jest.fn();
jest.mock("components/shared/DeleteOrphan", () => (props: any) => {
  mockChildComponent(props);
  return (
    <div data-testid="deleteOrphan">
      <p>Test</p>
    </div>
  );
});

const props = {
  id: "123",
  name: "Broken Template",
};

describe("TemplateEditDeleteOrphan component", function () {
  it("renders the template name", function () {
    render(<TemplateEditDeleteOrphan {...props} />);
    const name = screen.getByText(/Broken Template/i);
    expect(name).toBeInTheDocument();
  });
  it("renders the Delete Orphan Component", function () {
    render(<TemplateEditDeleteOrphan {...props} />);
    const deleteOrphan = screen.queryByTestId("deleteOrphan");

    expect(deleteOrphan).toBeTruthy();
    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "123",
      })
    );
  });
});
