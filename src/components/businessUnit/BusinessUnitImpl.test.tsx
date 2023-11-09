import { RootState } from "store";
import { render, screen, fireEvent } from "test/customRender";
import useBusinessUnit from "hooks/useBusinessUnit";
import BusinessUnitImpl from "./BusinessUnitImpl";

jest.mock("hooks/useBusinessUnit", () => jest.fn());

const props = {
  setPadding: jest.fn(),
};

describe("Business Unit", function () {
  describe("Business Group Validation", function () {
    it("Validates Business Unit", function () {
      (useBusinessUnit as jest.Mock).mockReturnValue({
        businessUnits: ["New Commerce", "OEM", "Professional Services"],
        businessUnitName: "New Commerce",
        isProfessionalServices: function () {
          return false;
        },
      });

      render(<BusinessUnitImpl {...props} />, {
        preloadedState: {} as RootState,
      });

      const newComText = screen.getByText("New Commerce");
      const buttonElement = newComText.closest("button");
      expect(buttonElement).toBeInTheDocument();
      fireEvent.click(buttonElement!);
      const oemText = screen.getByText("OEM");
      const psText = screen.getByText("Professional Services");

      const newComText2 = screen.getAllByText("New Commerce");
      expect(newComText2[1]).toBeInTheDocument();

      expect(oemText).toBeInTheDocument();

      expect(psText).toBeInTheDocument();
    });
  });
});
