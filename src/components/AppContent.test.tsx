import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "App";

describe("AppContent", function () {
  it("renders the title for local app", function () {
    render(<App />);
    const titleElement = screen.getByText(/Agreement Center/i);
    expect(titleElement).toBeInTheDocument();
  });
});
