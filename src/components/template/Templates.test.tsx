import React from "react";
import { RootState } from "store";
import { render, screen, fireEvent } from "test/customRender";
import { AppRouter } from "components/AppRouter";
import useBusinessUnit from "hooks/useBusinessUnit";

jest.mock("hooks/useBusinessUnit", () => jest.fn());

describe("Templates", function () {
  describe("New Template Button", function () {
    it("opens new template panel", function () {
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

      const tabText = screen.getByText("Templates");
      fireEvent.click(tabText);
      const buttonText = screen.getAllByText("New template");
      const buttonElement = buttonText[0].closest("button");
      expect(buttonElement).toBeInTheDocument();
      fireEvent.click(buttonText[0]);
      expect(screen.getByText("Create new template")).toBeInTheDocument();
    });
  });
});
