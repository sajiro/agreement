import React from "react";
import { render } from "@testing-library/react";
import InfoPageTitle from "./InfoPageTitle";

describe("InfoPageTitle tests", () => {
  it("renders Text and Action Button for pop out", () => {
    const props = {
      title: "Title",
      onInfoPagePopOut: jest.fn(),
    };
    const { getByText, getByTitle } = render(<InfoPageTitle {...props} />);
    const actionButton = getByTitle("Pop out panel");
    expect(getByText("Title")).toBeInTheDocument();
    expect(actionButton).toBeInTheDocument();
  });
  it("doesn't render the pop out button", () => {
    const props = {
      title: "Title",
    };
    const { queryByTitle } = render(<InfoPageTitle {...props} />);
    const actionButton = queryByTitle("Pop out panel");
    expect(actionButton).toBeFalsy();
  });
});
