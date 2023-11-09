import { RootState } from "store";
import { MessageBarType } from "@fluentui/react";
import { render, screen, fireEvent } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import SharedNotification from "components/shared/SharedNotification";

describe("SharedNotification", () => {
  it("renders the message bar if we have a message", async () => {
    render(<SharedNotification />, {
      preloadedState: {
        templateEdit: {
          isLoading: false,
          messageInfo: {
            message: "Message goes here",
            type: MessageBarType.success,
          },
        },
      } as RootState,
    });

    const message = await screen.findByText("Message goes here");
    expect(message).toBeInTheDocument();

    const closeButton = await screen.findByLabelText("Close");
    fireEvent.click(closeButton);
    const messageBar = await screen.queryByRole("region");
    expect(messageBar).toBeNull();
  });
  it("doesn't render if we have no message", async () => {
    render(<SharedNotification />, {
      preloadedState: {
        templateEdit: {
          isLoading: false,
          messageInfo: {
            message: "",
            type: MessageBarType.success,
          },
        },
      } as RootState,
    });

    const message = await screen.queryByText("Message goes here");
    expect(message).toBeNull();
  });
});
