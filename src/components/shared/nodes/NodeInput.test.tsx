import { INode, INodeSelectionTracker } from "models/node";
import { ITemplateRevisionSlot } from "models/slot";
import { fireEvent, render, screen } from "test/customRender";
import { getTestNode, getTestSlot } from "test/nodeTreeUtils";
import NodeInput from "./NodeInput";
import { NodeSelection } from "./NodeSelection";
import { Observable } from "./Observable";

let mockNodeSelection: INodeSelectionTracker;
let mockSelectedNodes: INode<ITemplateRevisionSlot>[];
let mockSlot: ITemplateRevisionSlot;
let mockSetSlotGroupName = jest.fn();

jest.mock("components/templateEdit/structure/TemplateEditStructureNodeManager", () => ({
  useTemplateEditStructureNodeManager: () => ({
    nodeSelection: mockNodeSelection,
    getSelectedNodes: () => mockSelectedNodes
  })
}));

jest.mock("hooks/template/mutation/useTemplateStructureEditor", () => ({
  useTemplateStructureEditor: () => ({
    setSlotGroupName: mockSetSlotGroupName
  })
}));

jest.mock("hooks/useObserver", () => () => jest.fn());

describe("NodeInput", () => {
  beforeAll(() => {
    mockNodeSelection = { selections: new NodeSelection(), observable: new Observable() };
    mockSlot = getTestSlot(1, "");
    mockSelectedNodes = [getTestNode(mockSlot, 1, 1)];
  });

  it("displays node name when not editing", async () => {
    const nodeName = "Test";
    render(
      <NodeInput
        nodeDepth={1}
        value={nodeName}
        enableEditing={false}
        isSlotGroup={false}
        setEditMode={() => {}}
        slot={mockSlot}
      />
    );

    const nodeNameElement = await screen.findByText(nodeName);
    expect(nodeNameElement).toBeTruthy();
  });

  it("displays node group edit button if selected and setEditMode function called when clicked", async () => {
    const setEditMode = jest.fn();
    render(
      <NodeInput
        nodeDepth={1}
        value={"Test"}
        isSlotGroup={true}
        enableEditing={false}
        slot={mockSlot}
        setEditMode={setEditMode}
      />
    );

    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeTruthy();
    fireEvent.click(buttonElement);
    expect(setEditMode.mock.calls.length).toBe(1);
  });

  it("displays input field for edit mode", async () => {
    render(
      <NodeInput
        nodeDepth={1}
        value={"Test"}
        isSlotGroup={true}
        enableEditing={true}
        slot={mockSlot}
        setEditMode={() => {}}
      />
    );

    const textField = screen.getByRole("textbox");
    expect(textField).toBeTruthy();
    textField.focus();
    fireEvent.change(textField, { target: { value: "Test" }});
    fireEvent.keyDown(textField, { key: "Enter", keyCode: 13 });
    expect(mockSetSlotGroupName.mock.calls.length).toBe(1);
  });
});