import { IButtonProps } from "@fluentui/react";
import { render, screen } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { NodeSelection } from "components/shared/nodes/NodeSelection";
import { Observable } from "components/shared/nodes/Observable";
import { ROOT_NODE_ID } from "consts/globals";
import { RevisionStatus } from "models/revisions";
import { getTestNode, getTestNodeTree, getTestSlot } from "test/nodeTreeUtils";
import TemplateEditStructureHeader from "./TemplateEditStructureHeader";
import { INodeSelectionTracker, INodeTree } from "models/node";
import { ITemplateRevisionSlot } from "models/slot";
import { IAgreementObjectId } from "models/agreements";
import { RootState } from "store";

let mockRouteObjectInfo: IAgreementObjectId;
let mockNodeTree: INodeTree<ITemplateRevisionSlot>;
let mockNodeSelection: INodeSelectionTracker;

jest.mock("hooks/useRouter", () => () => ({
  getRouteInfo: () => ({
    objectIdInfo: mockRouteObjectInfo
  })
}));

jest.mock("./TemplateEditStructureNodeManager", () => ({
  useTemplateEditStructureNodeManager: () => ({
    nodeTree: mockNodeTree,
    nodeSelection: mockNodeSelection,
    getSelectedNodes: jest.fn(() => []),
    getNextInsertLocationNode: jest.fn(),
    getChildNodes: jest.fn()
  })
}));

jest.mock("components/shared/HeaderButton", () => (props: IButtonProps) => (
  <div data-testid="Mock_Header_Button">
    { /* use aria-label for buttons that don't have text labels */ }
    <p>{`${props.text || props.ariaLabel} button`}</p>
  </div>
));

const ensureExpectedButtonsPresent = async (expectedButtonTexts: string[]) => {
  for (let i = 0; i < expectedButtonTexts.length; i += 1) {
    const buttonElement = await screen.findByText(`${expectedButtonTexts[i]} button`);
    expect(buttonElement).toBeTruthy();
  }

  const headerButtons = await screen.findAllByTestId("Mock_Header_Button");
  expect(headerButtons.length).toEqual(expectedButtonTexts.length);
};

const getMockStoreState = (): { preloadedState: RootState } => ({
  preloadedState: { previewResultSlice: { isInit: false, nodeWidth: 0 } } as RootState
});

describe("TemplateEditStructureHeader", () => {
  beforeAll(() => {
    mockRouteObjectInfo = { templateId: "", revisionId: "" };
    mockNodeSelection = { selections: new NodeSelection(), observable: new Observable() };
    const mockNodes = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      getTestNode(getTestSlot(2, ROOT_NODE_ID), 1, 2),
      getTestNode(getTestSlot(3, ROOT_NODE_ID), 1, 3)
    ];
    const mockNodeMappings = {
      [ROOT_NODE_ID]: mockNodes.map(n => n.id)
    };
    mockNodeTree = getTestNodeTree(mockNodes, mockNodeMappings);
  });

  // No need to test UnPublished State as its just a backend state, that get's converted to an UI equivalent one
  it("renders the correct action buttons for Draft revision", async () => {
    render(<TemplateEditStructureHeader revisionStatus={RevisionStatus.Draft} />, getMockStoreState());
    
    await ensureExpectedButtonsPresent([
      "Add clause",
      "Edit constraints",
      "Add Group",
      "Move up",
      "Move down",
      "Open clause",
      "Delete"
    ]);
  });

  it.each([
    [RevisionStatus.Live],
    [RevisionStatus.Old],
    [RevisionStatus.Pending],
    [RevisionStatus.Published],
    [RevisionStatus.Test],
  ])("renders the correct action buttons for %s revision", async (revisionStatus: RevisionStatus) => {
    render(<TemplateEditStructureHeader revisionStatus={revisionStatus} />, getMockStoreState());
    
    await ensureExpectedButtonsPresent([
      "Open clause"
    ]);
  });
});