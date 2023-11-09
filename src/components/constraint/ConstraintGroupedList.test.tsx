import ConstraintGroupedList from "./ConstraintGroupedList";
import { render, screen, fireEvent } from "@testing-library/react";

const props = {
  constraintValues: [
    {
      inUse: true,
      createdBy: "",
      createdDate: "",
      modifiedBy: "Test Name",
      modifiedDate: "2021-10-22T20:55:24.0361323Z",
      valuesUri: "",
      id: "123",
      name: "Test Constraint Value",
      display: "Test Constraint Value",
    },
  ],
};

describe("Constraint Info Card", function () {
  it("renders the component", function () {
    render(<ConstraintGroupedList {...props} />);
    const heading = screen.getByText(/Values/i);
    const valueName = screen.getByText(/Test Constraint Value/i);
    expect(heading).toBeInTheDocument();
    expect(valueName).toBeInTheDocument();
  });
  it("renders multiple values", function () {
    const props = {
      constraintValues: [
        {
          inUse: true,
          createdBy: "",
          createdDate: "",
          modifiedBy: "Test Name",
          modifiedDate: "2021-10-22T20:55:24.0361323Z",
          valuesUri: "",
          id: "123",
          name: "true",
          display: "True",
        },
        {
          inUse: true,
          createdBy: "",
          createdDate: "",
          modifiedBy: "Test Name",
          modifiedDate: "2021-10-22T20:55:24.0361323Z",
          valuesUri: "",
          id: "1234",
          name: "false",
          display: "False",
        },
      ],
    };

    render(<ConstraintGroupedList {...props} />);
    const valueName = screen.getByText(/True/i);
    const valueName2 = screen.getByText(/False/i);

    expect(valueName).toBeInTheDocument();
    expect(valueName2).toBeInTheDocument();
  });
});
