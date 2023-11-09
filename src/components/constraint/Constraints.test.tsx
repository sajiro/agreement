import { render, screen, fireEvent } from "test/customRender";
import { RootState } from "store";
import { AppRouter } from "components/AppRouter";
import useBusinessUnit from "hooks/useBusinessUnit";

jest.mock("hooks/useBusinessUnit", () => jest.fn());

describe("Constraints", function () {
  describe("New Constraint Button", function () {
    it("opens new constraint panel", function () {
      (useBusinessUnit as jest.Mock).mockReturnValue({
        businessUnits: ["New Commerce", "OEM", "Professional Services"],
        businessUnitName: "New Commerce",
        isProfessionalServices: function () {
          return false;
        },
      });

      render(<AppRouter />, {
        preloadedState: {} as RootState,
      });
      const tabText = screen.getByText("Constraints");
      fireEvent.click(tabText);
      const buttonText = screen.getAllByText("New constraint");
      const buttonElement = buttonText[0].closest("button");
      expect(buttonElement).toBeInTheDocument();
      fireEvent.click(buttonText[0]);
      expect(screen.getByText("Before you begin")).toBeInTheDocument();
    });
  });
});
