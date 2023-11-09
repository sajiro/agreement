import { fireEvent } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import CustomClausePanel from "./CustomClausePanel";
import useCustomClausePanelInfoProvider from "hooks/customClause/useCustomClausePanelInfoProvider";
import useSharedClausePanelController from "hooks/useSharedClausePanelController";
import { IPanelProps, PanelType } from "models/panel";

jest.mock("components/shared/DeleteOrphan", () => () => (
  <div data-testid="deleteOrphan">
    <p>Test</p>
  </div>
));

jest.mock("hooks/customClause/useCustomClausePanelInfoProvider", () =>
  jest.fn()
);

jest.mock("hooks/useSharedClausePanelController", () => jest.fn());

jest.mock("components/shared/SharedClausePanelActions", () => () => (
  <div data-testid="sharedClausePanelActions">
    <p>Test</p>
  </div>
));

jest.mock("components/shared/SharedActionBar", () => ({
  SharedActionBarWithLoading: () => (
    <div data-testid="sharedActionBar">
      <p>Test</p>
    </div>
  ),
}));

jest.mock("components/shared/SharedClausePivot", () => ({
  SharedClausePivotWithLoading: () => (
    <div data-testid="sharedClausePivot">
      <p>Test</p>
    </div>
  ),
}));

describe("ClauseInfo", function () {
  it("renders the inner panel components -SharedActionBarWithLoading and SharedClausePivotWithLoading", function () {
    const mockFunction1 = jest.fn();
    (useSharedClausePanelController as jest.Mock).mockReturnValue({
      onClosePanel: mockFunction1,
    });

    (useCustomClausePanelInfoProvider as jest.Mock).mockReturnValue({
      clauseInfo: {
        clause: {
          name: "Test Heading",
        },
        hasData: true,
        isLoading: false,
        currentRevision: {
          id: "123",
        },
      },
      clauseContentInfo: {
        hasData: true,
      },
    });

    const props: IPanelProps = {
      panelInfo: {
        panelType: PanelType.CustomClause,
        agreementObjectIds: {
          clauseId: "123",
          templateId: "abc",
        },
        additionalInfo: "",
      },
      isBlocking: false,
      persistentInfo: {},
    };
    const { queryByTestId, getByText } = render(
      <CustomClausePanel {...props} />,
      {
        preloadedState: {} as RootState,
      }
    );

    const heading = getByText("Test Heading");
    expect(heading).toBeInTheDocument();

    const sharedActionBar = queryByTestId("sharedActionBar");
    const sharedClausePivot = queryByTestId("sharedClausePivot");

    expect(sharedActionBar).toBeTruthy();
    expect(sharedClausePivot).toBeTruthy();
  });
  it("renders the broken clause component", function () {
    const mockFunction1 = jest.fn();
    (useSharedClausePanelController as jest.Mock).mockReturnValue({
      onClosePanel: mockFunction1,
    });

    (useCustomClausePanelInfoProvider as jest.Mock).mockReturnValue({
      clauseInfo: {
        clause: {
          name: "Broken Clause",
        },
        hasData: true,
        isLoading: false,
        currentRevision: {
          id: "",
        },
      },
      clauseContentInfo: {
        hasData: true,
      },
    });

    const props: IPanelProps = {
      panelInfo: {
        panelType: PanelType.CustomClause,
        agreementObjectIds: {
          clauseId: "123",
          templateId: "abc",
        },
        additionalInfo: "",
      },
      isBlocking: false,
      persistentInfo: {},
    };
    const { getByText, queryByTestId } = render(
      <CustomClausePanel {...props} />,
      {
        preloadedState: {} as RootState,
      }
    );

    const heading = getByText("Broken Clause");
    expect(heading).toBeInTheDocument();

    const deleteOrphan = queryByTestId("deleteOrphan");
    expect(deleteOrphan).toBeTruthy();
  });
  it("renders the New Custom Clause title", function () {
    const mockFunction1 = jest.fn();
    (useSharedClausePanelController as jest.Mock).mockReturnValue({
      onClosePanel: mockFunction1,
    });

    (useCustomClausePanelInfoProvider as jest.Mock).mockReturnValue({
      clauseInfo: {
        clause: {
          name: "Test Heading",
        },
        hasData: true,
      },
      clauseContentInfo: {
        hasData: true,
      },
    });

    const props: IPanelProps = {
      panelInfo: {
        panelType: PanelType.CustomClause,
        agreementObjectIds: {
          clauseId: "123",
        },
        additionalInfo: {
          clauseEditState: "NewClause",
        },
      },
      isBlocking: false,
      persistentInfo: {},
    };
    const { getByText, queryByTestId, getByRole } = render(
      <CustomClausePanel {...props} />,
      {
        preloadedState: {} as RootState,
      }
    );

    const heading = getByText("Create new custom clause");
    expect(heading).toBeInTheDocument();

    const sharedClausePanelActions = queryByTestId("sharedClausePanelActions");

    expect(sharedClausePanelActions).toBeTruthy();

    const closeButton = getByRole("button", {
      name: /Close Panel/i,
    });

    fireEvent.click(closeButton);

    expect(mockFunction1).toBeCalled();
  });
});
