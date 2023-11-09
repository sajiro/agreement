import { screen, render, fireEvent } from "@testing-library/react";
import { IConstraintValue } from "models/constraints";
import LockedConstraintValuesDisplay from "./LockedConstraintValuesDisplay";

const props: { lockedConstraintValues: IConstraintValue[] } = {
  lockedConstraintValues: [
    {
      createdBy: "",
      createdDate: "",
      modifiedBy: "",
      modifiedDate: "",
      inUse: false,
      name: "test",
      display: "test",
      id: "",
    },
    {
      createdBy: "",
      createdDate: "",
      modifiedBy: "",
      modifiedDate: "",
      inUse: false,
      name: "testTwo",
      display: "testTwo",
      id: "",
    },
  ],
};

describe("LockedConstraintValuesDisplay", function () {
  it("renders the right values", function () {
    render(<LockedConstraintValuesDisplay {...props} />);
    const value1 = screen.getByText("test");
    expect(value1).toBeInTheDocument();
    const value2 = screen.getByText("testTwo");
    expect(value2).toBeInTheDocument();
  });
});
