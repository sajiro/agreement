import TemplatePropertiesView, {
  TemplatePropertiesViewProps,
} from "./TemplatePropertiesView";
import { screen } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import stringsConst from "consts/strings";
import { getInfoItems } from "components/shared/SharedPropertiesView";
import { RootState } from "store";
import { RevisionStatus } from "models/revisions";

jest.mock("components/shared/SharedPropertiesView", () => ({
  getInfoItems: () => [{ key: "Status", value: "Draft" }],
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const props: TemplatePropertiesViewProps = {
  templateInfo: {
    template: {
      category: "",
      constraints: [],
      createdBy: "",
      createdDate: "",
      description: "test description",
      etag: "",
      id: "",
      modifiedBy: "",
      modifiedDate: "",
      name: "",
      revisionsUri: "",
      status: "Draft",
    },
    revisions: [],
    currentRevision: {
      id: "",
      effectiveDate: "",
      status: RevisionStatus.Unpublished,
      createdBy: "",
      createdDate: "",
      modifiedBy: "",
      modifiedDate: "",
      etag: "",
      number: 123,
    },
    isLoading: false,
    hasData: true,
  },
};

describe("Template Properties View", function () {
  it("renders the InfoCard component", function () {
    const { getByText } = render(<TemplatePropertiesView {...props} />, {
      preloadedState: {} as RootState,
    });
    const status = getByText(/Draft/i);
    expect(status).toBeInTheDocument();
  });
  it("renders the TemplateDescription component", function () {
    render(<TemplatePropertiesView {...props} />, {
      preloadedState: {} as RootState,
    });
    const heading = screen.getByText(
      stringsConst.template.TemplatePropertiesView.descriptionHeading
    );
    expect(heading).toBeInTheDocument();
  });
});
