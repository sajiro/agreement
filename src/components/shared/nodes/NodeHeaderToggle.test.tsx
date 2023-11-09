import { render, screen, fireEvent } from "test/customRender";
import { getTestNode, getTestSlot } from "test/nodeTreeUtils";
import NodeHeaderToggle from "./NodeHeaderToggle";

describe("NodeHeaderToggle", () => {
  it.each([
    [false, 2],
    [true, 0]
  ])("calls toggleNodeOpenState and setOpen functions correct number of times when disabled: %s", async (
    isDisabled: boolean,
    expectedCallCount: number
  ) => {
    const toggleNodeOpenState = jest.fn();
    const setOpen = jest.fn();
    render(
      <NodeHeaderToggle
        disable={isDisabled}
        isOpen={true}
        node={getTestNode(getTestSlot(1, ""), 1, 1)}
        toggleNodeOpenState={toggleNodeOpenState}
        setOpen={setOpen}
      />
    );

    const toggleButton = await screen.findByRole("button");
    expect(toggleButton).toBeTruthy();
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    
    expect(toggleNodeOpenState.mock.calls.length).toBe(expectedCallCount);
    expect(setOpen.mock.calls.length).toBe(expectedCallCount);
  });
});