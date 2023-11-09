import { ROOT_NODE_ID } from "consts/globals";
import { INode, INodeTree } from "models/node";
import { ITemplateRevisionSlot } from "models/slot";
import { Size } from "react-virtualized-auto-sizer";
import { render, screen } from "test/customRender";
import NodeList from "./NodeList";
import { NodeSelection } from "./NodeSelection";
import { Observable } from "./Observable";

jest.mock("react-virtualized-auto-sizer", () => ({ children }: { children: (size: Size) => React.ReactNode }) => (
  children({ height: 0, width: 0 })
));

jest.mock("components/templateEdit/structure/TemplateEditEmptyStructure", () => () => (
  <div data-testid="Mock_Empty_Structure" />
));

describe("NodeList", () => {
  it("displays empty structure component if node tree is empty", async () => {
    const nodeTree: INodeTree<ITemplateRevisionSlot> = {
      nodes: {
        [ROOT_NODE_ID]: {
          id: ROOT_NODE_ID,
          content: undefined,
          depth: 0,
          globalPosition: 0,
          height: 0,
          isOpen: true,
          parentId: undefined
        }
      },
      childNodeMappings: {},
      observable: new Observable()
    };

    const nodeTreeProvider = {
      resultSlots: [],
      nodeTree,
      treeRef: { current: null },
      nodeSelection: {
        selections: new NodeSelection(),
        observable: new Observable(),
      },
      nodeDragState: { isDragging: false, observable: new Observable() },
      updateNodeInfo: () => {},
      toggleNodeOpenState: () => {},
      toggleNodeSelection: () => {},
      applyRangeSelection: () => {},
      selectIfNotSelected: () => {},
      toggleDragState: () => {},
      getSelectedNodes: () => [],
      getChildNodes: () => [],
      getNextNode: () => ({} as INode<ITemplateRevisionSlot>),
      getNextNonSubLevelNode: () => ({} as INode<ITemplateRevisionSlot>),
      getNextInsertLocationNode: () => ({} as INode<ITemplateRevisionSlot>),
    };

    render(
      <NodeList
        nodeRenderer={() => <></>}
        useNodeTreeProvider={() => nodeTreeProvider}
      />
    );

    const emptyStructureElement = await screen.findByTestId("Mock_Empty_Structure");
    expect(emptyStructureElement).toBeTruthy();
  });
});