import CustomClausePropertiesView from "./CustomClausePropertiesView";
import { render, screen, fireEvent } from "@testing-library/react";
import { getInfoItems } from "components/shared/SharedPropertiesView";

jest.mock("components/shared/SharedPropertiesView", () => ({
  getInfoItems: () => [{ key: "Status", value: "Draft" }],
  getClauseTranslationViewProps: () => ({
    values: [],
  }),
}));

const props = {
  clauseContentInfo: {
    language: "",
    length: "",
    disposition: "",
    contents: [],
    lastModified: "2021-10-22T20:55:24.0361323Z",
    status: "Draft",
    sasUri: "",
    sasExpiration: "2021-10-22T20:55:24.0361323Z",
    isLoading: false,
    hasData: true,
  },
};

describe("Clause Properties View", function () {
  it("renders the InfoCard component", function () {
    render(<CustomClausePropertiesView {...props} />);
    const status = screen.getByText(/Draft/i);
    expect(status).toBeInTheDocument();
  });
  it("renders the GroupedList component", function () {
    render(<CustomClausePropertiesView {...props} />);
    const heading = screen.getByText(/Used in template/i);
    expect(heading).toBeInTheDocument();
  });
});
