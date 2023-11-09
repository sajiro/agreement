import { LayerHost } from "@fluentui/react";
import { RootState } from "store";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import ConstraintEditPanel from "./ConstraintEditPanel";
import { ITemplateRevisionSlot } from "models/slot";
import { ROOT_NODE_ID } from "consts/globals";
import { ConstraintOperator } from "models/constraints";

import { getTestNode, getTestNodeTree, getTestSlot } from "test/nodeTreeUtils";
import { INode, INodeTree } from "models/node";
import { IAgreementObjectId } from "models/agreements";

// this test uses the mock api https://template.int.l2o.microsoft.com/v1/constraints in \src\test\server\serverHandlers.ts

let mockRouteObjectInfo: IAgreementObjectId;
let mockNodeTree: INodeTree<ITemplateRevisionSlot>;
let mockGetSelectedNodes: () => INode<ITemplateRevisionSlot>[];

jest.mock(
  "components/templateEdit/structure/TemplateEditStructureNodeManager",
  () => ({
    useTemplateEditStructureNodeManager: () => ({
      nodeTree: mockNodeTree,
      getSelectedNodes: mockGetSelectedNodes,
    }),
  })
);
jest.mock("hooks/useRouter", () => () => ({
  getRouteInfo: () => ({
    objectIdInfo: mockRouteObjectInfo,
  }),
}));
jest.mock("./ConstraintAdder", () => () => (
  <div data-testid="constraintAdder">
    <p>Test</p>
  </div>
));

jest.mock("./ConstraintEditList", () => () => (
  <div data-testid="constraintEditList">
    <p>Test</p>
  </div>
));

const props = {
  closePanel: jest.fn(),
};

describe("Constraint Edit Panel", () => {
  beforeAll(() => {
    mockRouteObjectInfo = { templateId: "", revisionId: "" };
    const mockNodes = [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
      getTestNode(getTestSlot(2, ROOT_NODE_ID), 1, 2),
    ];
    const mockNodeMappings = {
      [ROOT_NODE_ID]: mockNodes.map((n) => n.id),
    };
    mockNodeTree = getTestNodeTree(mockNodes, mockNodeMappings);
    const mockSelected = [
      {
        id: "305cda00-e53d-11ec-8ce2-3d553ef4af74",
        parentId: "00000000-0000-0000-0000-000000000000",
        height: 0,
        isOpen: true,
        contentHash: "",
        content: {
          length: 0,
          createdBy: "",
          createdDate: "",
          modifiedBy: "",
          modifiedDate: "",
          etag: "",
          name: "",
          id: "305d0110-e53d-11ec-8ce2-3d553ef4af74",
          position: 2,
          parentSlotId: "00000000-0000-0000-0000-000000000000",
          category: "Content",
          constraints: [
            {
              key: "test_key",
              keyDisplay: "Test Key",
              keyId: "5d166ac3-f90f-49a8-b2e9-39292d66d701",
              operator: ConstraintOperator.Include,
              value: "testValue",
              valueDisplay: "Test Value",
            },
          ],
          partId: "896abca8-7380-40d8-91be-4a88e14b1eea",
          partName: "Test Clause Name",
        },
        depth: 1,
        globalPosition: 1,
      },
    ];
    mockGetSelectedNodes = () => mockSelected;
  });

  it("renders a list of constraints", () => {
    const { getByText, queryByTestId } = render(
      <LayerHost id="TemplateEditStructureLayer">
        <ConstraintEditPanel {...props} />
      </LayerHost>,
      {
        preloadedState: {
          templateEdit: {
            isLoading: false,
          },
        } as RootState,
      }
    );
    const heading = getByText("Test Clause Name");
    expect(heading).toBeInTheDocument();
    const constraintEditList = queryByTestId("constraintEditList");
    expect(constraintEditList).toBeTruthy();
  });
  it("does not render the constraint edit list if no selected node has no constraints", () => {
    // this returns a selected node with no constraint
    mockGetSelectedNodes = () => [
      getTestNode(getTestSlot(1, ROOT_NODE_ID), 1, 1),
    ];

    const { queryByTestId } = render(
      <LayerHost id="TemplateEditStructureLayer">
        <ConstraintEditPanel {...props} />
      </LayerHost>,
      {
        preloadedState: {
          templateEdit: {
            isLoading: false,
          },
        } as RootState,
      }
    );

    const constraintEditList = queryByTestId("constraintEditList");
    expect(constraintEditList).toBeFalsy();
  });
});
