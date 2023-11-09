import { render, screen, fireEvent, within } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import AddClausePanel from "./AddClausePanel";
import useRouter from "hooks/useRouter";
import { IAgreementObjectId } from "models/agreements";
import { RootState } from "store";
import stringsConst from "consts/strings";
import { LayerHost } from "@fluentui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ITemplateRevisionSlot } from "models/slot";
import { NodeSelection } from "components/shared/nodes/NodeSelection";
import { Observable } from "components/shared/nodes/Observable";
import { ROOT_NODE_ID } from "consts/globals";

import { getTestNode, getTestNodeTree, getTestSlot } from "test/nodeTreeUtils";
import { INode, INodeSelectionTracker, INodeTree } from "models/node";

// this test uses the mock api https://template.int.l2o.microsoft.com/v1/ui/publishedparts in \src\test\server\serverHandlers.ts

let mockRouteObjectInfo: IAgreementObjectId;
let mockNodeTree: INodeTree<ITemplateRevisionSlot>;
let mockNodeSelection: INodeSelectionTracker;
let mockGetSelectedNodes: () => INode<ITemplateRevisionSlot>[];

jest.mock("hooks/useRouter", () => jest.fn());

jest.mock(
  "components/templateEdit/structure/TemplateEditStructureNodeManager",
  () => ({
    useTemplateEditStructureNodeManager: () => ({
      nodeTree: mockNodeTree,
      nodeSelection: mockNodeSelection,
      getSelectedNodes: mockGetSelectedNodes,
      toggleDragState: jest.fn(),
      getChildNodes: jest.fn(),
    }),
  })
);

const props = {
  closePanel: jest.fn(),
};

describe("AddClausePanel", function () {
  beforeAll(() => {
    mockRouteObjectInfo = { templateId: "", revisionId: "" };
    mockNodeSelection = {
      selections: new NodeSelection(),
      observable: new Observable(),
    };

    const mockNodes = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      getTestNode(getTestSlot(2, ROOT_NODE_ID), 1, 2),
      getTestNode(getTestSlot(3, ROOT_NODE_ID), 1, 3),
    ];
    const mockNodeMappings = {
      [ROOT_NODE_ID]: mockNodes.map((n) => n.id),
    };
    mockNodeTree = getTestNodeTree(mockNodes, mockNodeMappings);
    mockGetSelectedNodes = () => mockNodes;
  });

  beforeEach(() => {
    const mockFunction1 = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      getRouteInfo: mockFunction1,
    });

    mockFunction1.mockReturnValue({
      objectIdInfo: {},
    });
  });
  it("renders the correct title", async function () {
    const { getByText } = render(
      <DndProvider backend={HTML5Backend}>
        <LayerHost id="TemplateEditStructureLayer">
          <AddClausePanel {...props} />
        </LayerHost>
      </DndProvider>,
      {
        preloadedState: {
          templateEdit: {
            isLoading: false,
          },
        } as RootState,
      }
    );

    const heading = getByText(stringsConst.templateEdit.AddClausePanel.desc);
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct clauses", async function () {
    render(
      <DndProvider backend={HTML5Backend}>
        <LayerHost id="TemplateEditStructureLayer">
          <AddClausePanel {...props} />
        </LayerHost>
      </DndProvider>,
      {
        preloadedState: {
          templateEdit: {
            isLoading: false,
          },
        } as RootState,
      }
    );
    const clause1 = await screen.findByText("MPSA Amendment Header");
    expect(clause1).toBeInTheDocument();
    const clause2 = await screen.findByText(
      "Mandatory_Amendment_Opening_MPSA_AMEND_2016May"
    );
    expect(clause2).toBeInTheDocument();
  });
  it("renders the correct Add To text when clauses have been selected", async function () {
    const { getByText } = render(
      <DndProvider backend={HTML5Backend}>
        <LayerHost id="TemplateEditStructureLayer">
          <AddClausePanel {...props} />
        </LayerHost>
      </DndProvider>,
      {
        preloadedState: {
          templateEdit: {
            isLoading: false,
          },
        } as RootState,
      }
    );

    const addAboveText = await getByText("Add above");
    expect(addAboveText).toBeInTheDocument();
    const topButton = addAboveText.closest("button");
    expect(topButton).toBeDisabled();
    const addBelowText = await getByText("Add below");
    expect(addBelowText).toBeInTheDocument();
    const bottomButton = addAboveText.closest("button");
    expect(bottomButton).toBeDisabled();
  });
  it("renders the correct Add To text when no selections", async function () {
    mockGetSelectedNodes = () => [];
    const { getByText } = render(
      <DndProvider backend={HTML5Backend}>
        <LayerHost id="TemplateEditStructureLayer">
          <AddClausePanel {...props} />
        </LayerHost>
      </DndProvider>,
      {
        preloadedState: {
          templateEdit: {
            isLoading: false,
          },
        } as RootState,
      }
    );
    const addAboveText = getByText("Add to top");
    expect(addAboveText).toBeInTheDocument();
    const topButton = addAboveText.closest("button");
    expect(topButton).toBeDisabled();
    const addBelowText = getByText("Add to bottom");
    expect(addBelowText).toBeInTheDocument();
    const bottomButton = addAboveText.closest("button");
    expect(bottomButton).toBeDisabled();
  });
  it("makes Add buttons enabled on clause selection", async function () {
    mockGetSelectedNodes = () => [];
    const { getByText } = render(
      <DndProvider backend={HTML5Backend}>
        <LayerHost id="TemplateEditStructureLayer">
          <AddClausePanel {...props} />
        </LayerHost>
      </DndProvider>,
      {
        preloadedState: {
          templateEdit: {
            isLoading: false,
          },
        } as RootState,
      }
    );

    const clause1 = await screen.findByText("MPSA Amendment Header");
    expect(clause1).toBeInTheDocument();
    fireEvent.click(clause1);
    const addAboveText = getByText("Add to top");
    expect(addAboveText).toBeInTheDocument();
    const topButton = addAboveText.closest("button");
    expect(topButton).toBeEnabled();
    const addBelowText = getByText("Add to bottom");
    expect(addBelowText).toBeInTheDocument();
    const bottomButton = addAboveText.closest("button");
    expect(bottomButton).toBeEnabled();
    const clause2 = await screen.findByText(
      "Mandatory_Amendment_Opening_MPSA_AMEND_2016May"
    );
    expect(clause2).toBeInTheDocument();
    fireEvent.click(clause1);
    expect(topButton).toBeEnabled();
    expect(bottomButton).toBeEnabled();
  });
  it("makes Add buttons disabled on clause de-selection", async function () {
    mockGetSelectedNodes = () => [];
    const { getByText, queryAllByRole } = render(
      <DndProvider backend={HTML5Backend}>
        <LayerHost id="TemplateEditStructureLayer">
          <AddClausePanel {...props} />
        </LayerHost>
      </DndProvider>,
      {
        preloadedState: {
          templateEdit: {
            isLoading: false,
          },
        } as RootState,
      }
    );

    const clause1 = await screen.findByText("MPSA Amendment Header");
    expect(clause1).toBeInTheDocument();
    fireEvent.click(clause1);
    const addAboveText = getByText("Add to top");
    expect(addAboveText).toBeInTheDocument();
    const topButton = addAboveText.closest("button");
    expect(topButton).toBeEnabled();
    const findFirstRow = queryAllByRole("row");
    const utils = within(findFirstRow[0]);
    const checkBox = utils.getByRole("checkbox");
    fireEvent.click(checkBox);
    expect(topButton).toBeDisabled();
  });
});
