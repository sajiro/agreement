import React from "react";
import { render, screen, fireEvent } from "test/customRender";
import { RootState } from "store";
import { AppRouter } from "components/AppRouter";
import useBusinessUnit from "hooks/useBusinessUnit";

jest.mock("hooks/useBusinessUnit", () => jest.fn());

describe("Clauses", function () {
  describe("New Clause Button", function () {
    it("opens new clause panel", function () {
      (useBusinessUnit as jest.Mock).mockReturnValue({
        businessUnits: ["New Commerce", "OEM", "Professional Services"],
        businessUnitName: "New Commerce",
        isProfessionalServices: function () {
          return false;
        },
      });

      const { getAllByText } = render(<AppRouter />, {
        preloadedState: {} as RootState,
      });

      const buttonText = getAllByText("New clause");
      const buttonElement = buttonText[0].closest("button");
      expect(buttonElement).toBeInTheDocument();
      fireEvent.click(buttonText[0]);
      expect(screen.getByText("Create new clause")).toBeInTheDocument();
    });

    it("doesn't load app body with no business unit name", function () {
      (useBusinessUnit as jest.Mock).mockReturnValue({
        businessUnits: [],
        businessUnitName: "",
        isProfessionalServices: function () {
          return false;
        },
      });

      const { queryByText } = render(<AppRouter />, {
        preloadedState: {} as RootState,
      });

      const buttonText = queryByText("New clause");
      expect(buttonText).toBeNull();
    });
  });
});
