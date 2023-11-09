import React from "react";
import { render } from "@testing-library/react";
import withLoading from "./WithLoading";

describe("withLoading tests", () => {
  const MockWithLoadingComponent = withLoading(() => (
    <div>Loaded Component</div>
  ));

  it("renders component if loaded", () => {
    const props = {
      isLoading: false,
      LoadingSubstitute: jest.fn(),
    };
    const { getByText } = render(<MockWithLoadingComponent {...props} />);
    expect(getByText("Loaded Component")).toBeInTheDocument();
  });

  it("renders substitute if not loaded", () => {
    const props = {
      isLoading: true,
      LoadingSubstitute: () => <div>Loading Substitute</div>,
    };
    const { getByText } = render(<MockWithLoadingComponent {...props} />);
    expect(getByText("Loading Substitute")).toBeInTheDocument();
  });
});
