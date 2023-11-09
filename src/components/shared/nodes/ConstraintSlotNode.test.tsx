import { render, screen } from "test/customRender";
import { getTestNode, getTestSlot } from "test/nodeTreeUtils";
import ConstraintSlotNode from "./ConstraintSlotNode";
import { RootState } from "store";
import hash from "object-hash";
import { act } from "react-dom/test-utils";

jest.mock(
  "components/templateEdit/structure/TemplateEditStructureNodeManager",
  () => ({
    useTemplateEditStructureNodeManager: () => ({
      updateNodeInfo: jest.fn(),
      toggleNodeOpenState: jest.fn(),
    }),
  })
);

// Need to mock these out to avoid having to mock the external dependencies the components require
jest.mock("./NodeRow", () => () => <div />);
jest.mock("./NodeSelectionHandler", () => () => <div />);

describe("ConstraintSlotNode", () => {
  it.each([
    [false, "hidden"],
    [true, ""],
  ])(
    "correctly shows/hides node row when content hash is set: %s",
    async (setContentHash: boolean, expectedVisibility: string) => {
      const testNode = getTestNode(getTestSlot(1, ""), 1, 1);
      testNode.contentHash = setContentHash ? hash(testNode.content!) : "";
      const resize = jest.fn();
      act(() => {
        render(
          <ConstraintSlotNode
            /*  constraintValuesMapping={{}} */
            depth={1}
            isOpen={true}
            isSlotGroup={false}
            node={testNode}
            positionStyle={{}}
            resize={resize}
            setOpen={() => {}}
          />,
          {
            preloadedState: {
              templateEdit: { isLoading: false, isLocked: false },
            } as RootState,
          }
        );
      });

      const nodeRow = await screen.findByRole("row", { hidden: true });
      expect(nodeRow.style.visibility).toBe(expectedVisibility);
    }
  );
});
