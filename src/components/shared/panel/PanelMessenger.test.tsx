import { RootState } from "store";
import PanelMessenger from "./PanelMessenger";
import { render, screen } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { IPanelMessage, PanelMessageType } from "models/panelMessage";
import PanelMessageCallout from "./PanelMessageCallout";

jest.mock("./PanelMessageCallout", () => () => (
  <div data-testid="panelMessageCallout">
    <p>Test</p>
  </div>
));

const props = {
  isSubmitting: false,
};

describe("PanelMessenger component", function () {
  it("renders a message", function () {
    render(<PanelMessenger {...props} />, {
      preloadedState: {
        panelMessages: {
          message: "Test Success",
          type: PanelMessageType.Success,
        },
      } as RootState,
    });
    const message = screen.getByText(/Test Success/i);
    expect(message).toBeInTheDocument();
  });
  it("doesn't render success message when loading", function () {
    const props = {
      isSubmitting: true,
    };
    render(<PanelMessenger {...props} />, {
      preloadedState: {
        panelMessages: {
          message: "Test Success",
          type: PanelMessageType.Success,
        },
      } as RootState,
    });
    const message = screen.queryByText(/Test Success/i);
    expect(message).not.toBeInTheDocument();
  });
  it("renders a callout", function () {
    render(<PanelMessenger {...props} />, {
      preloadedState: {
        panelMessages: {
          message: "Test Success",
          type: PanelMessageType.Success,
          callout: {
            subMessages: [] as IPanelMessage[],
            infoText: "test message",
          },
        },
      } as RootState,
    });
    const panelMessageCallout = screen.queryByTestId("panelMessageCallout");

    expect(panelMessageCallout).toBeTruthy();
  });
});
