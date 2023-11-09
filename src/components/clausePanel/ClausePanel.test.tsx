import { RootState } from "store";
import { fireEvent } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import ClausePanel from "./ClausePanel";
import useClausePanelInfoProvider from "hooks/clause/useClausePanelInfoProvider";
import useSharedClausePanelController from "hooks/useSharedClausePanelController";
import { IPanelProps, PanelType } from "models/panel";

jest.mock("components/shared/DeleteOrphan", () => () => (
  <div data-testid="deleteOrphan">
    <p>Test</p>
  </div>
));

jest.mock("hooks/clause/useClausePanelInfoProvider", () => jest.fn());

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

    (useClausePanelInfoProvider as jest.Mock).mockReturnValue({
      clauseInfo: {
        clause: {
          name: "Test Heading",
          id: "123",
        },
        isLoading: false,
        currentRevision: {
          id: "123",
        },
        hasData: true,
      },
      clauseContentInfo: {
        hasData: true,
      },
      clausePlaceholderContent: {
        hasData: true,
      },
    });

    const props: IPanelProps = {
      panelInfo: {
        panelType: PanelType.Clause,
        agreementObjectIds: {
          clauseId: "123",
        },
        additionalInfo: "",
      },
      isBlocking: false,
      persistentInfo: {},
    };
    const { queryByTestId, getByText } = render(<ClausePanel {...props} />, {
      preloadedState: {} as RootState,
    });

    const heading = getByText("Test Heading");
    expect(heading).toBeInTheDocument();

    const sharedActionBar = queryByTestId("sharedActionBar");
    const sharedClausePivot = queryByTestId("sharedClausePivot");

    expect(sharedActionBar).toBeTruthy();
    expect(sharedClausePivot).toBeTruthy();
  });
  it("renders the broken clause error", function () {
    const mockFunction1 = jest.fn();
    (useSharedClausePanelController as jest.Mock).mockReturnValue({
      onClosePanel: mockFunction1,
    });

    (useClausePanelInfoProvider as jest.Mock).mockReturnValue({
      clauseInfo: {
        clause: {
          name: "Broken Clause",
          id: "123",
        },
        isLoading: false,
        currentRevision: {
          id: "",
        },
        hasData: true,
      },
      clauseContentInfo: {
        hasData: true,
      },
      clausePlaceholderContent: {
        hasData: true,
      },
    });

    const props: IPanelProps = {
      panelInfo: {
        panelType: PanelType.Clause,
        agreementObjectIds: {
          clauseId: "123",
        },
        additionalInfo: "",
      },
      isBlocking: false,
      persistentInfo: {},
    };
    const { queryByTestId, getByText } = render(<ClausePanel {...props} />, {
      preloadedState: {} as RootState,
    });

    const heading = getByText("Broken Clause");
    expect(heading).toBeInTheDocument();

    const deleteOrphan = queryByTestId("deleteOrphan");
    expect(deleteOrphan).toBeTruthy();
  });
  it("renders the New Clause title", function () {
    const mockFunction1 = jest.fn();
    (useSharedClausePanelController as jest.Mock).mockReturnValue({
      onClosePanel: mockFunction1,
    });

    (useClausePanelInfoProvider as jest.Mock).mockReturnValue({
      clauseInfo: {
        clause: {
          name: "Test Heading",
        },
        hasData: true,
      },
      clauseContentInfo: {
        hasData: true,
      },
      clausePlaceholderContent: {
        hasData: true,
      },
    });

    const props: IPanelProps = {
      panelInfo: {
        panelType: PanelType.Clause,
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
      <ClausePanel {...props} />,
      {
        preloadedState: {} as RootState,
      }
    );

    const heading = getByText("Create new clause");
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
