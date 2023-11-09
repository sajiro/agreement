import { RootState } from "store";
import ClausePropertiesView from "./ClausePropertiesView";
import { screen } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { getInfoItems } from "components/shared/SharedPropertiesView";

jest.mock("components/shared/SharedPropertiesView", () => ({
  getInfoItems: () => [{ key: "Status", value: "Draft" }],
  getClauseTranslationViewProps: () => ({
    values: [],
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

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
    const { getByText } = render(<ClausePropertiesView {...props} />, {
      preloadedState: {} as RootState,
    });
    const status = getByText(/Draft/i);
    expect(status).toBeInTheDocument();
  });
  it("renders the GroupedList component", function () {
    render(<ClausePropertiesView {...props} />, {
      preloadedState: {} as RootState,
    });
    const heading = screen.getByText(/Used in template/i);
    expect(heading).toBeInTheDocument();
  });
});
