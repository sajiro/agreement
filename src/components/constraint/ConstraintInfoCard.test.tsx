import ConstraintInfoCard from "./ConstraintInfoCard";
import { render, screen, fireEvent } from "@testing-library/react";
import stringsConst from "consts/strings";

jest.mock("consts/strings", () => ({
  common: {
    infoItems: {
      lastModifiedKey: "Last modified",
      modifiedByKey: "Modified By",
    },
  },
}));

const props = {
  constraint: {
    createdBy: "",
    createdDate: "",
    modifiedBy: "Test Name",
    modifiedDate: "2021-10-22T20:55:24.0361323Z",
    valuesUri: "",
    id: "",
    name: "",
    display: "",
  },
};

describe("Constraint Info Card", function () {
  it("renders the component", function () {
    render(<ConstraintInfoCard {...props} />);
    const name = screen.getByText(/Test Name/i);
    const modifiedDate = screen.getByText(/Oct 22, 2021/i);
    expect(name).toBeInTheDocument();
    expect(modifiedDate).toBeInTheDocument();
  });
});
