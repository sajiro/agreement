import { render, screen } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import TemplateEdit from "./TemplateEdit";
import useTemplateInfoProvider from "hooks/template/useTemplateInfoProvider";
import TemplateEditPivot from "./TemplateEditPivot";
import TemplateEditHeader from "./TemplateEditHeader";
import TemplateEditDeleteOrphan from "./TemplateEditDeleteOrphan";
import { RootState } from "store";

jest.mock("hooks/template/useTemplateInfoProvider", () => jest.fn());

jest.mock("./TemplateEditHeader", () => () => (
  <div data-testid="templateEditHeader">
    <p>Test</p>
  </div>
));

jest.mock("./TemplateEditPivot", () => () => (
  <div data-testid="templateEditPivot">
    <p>Test</p>
  </div>
));

jest.mock("./TemplateEditDeleteOrphan", () => () => (
  <div data-testid="templateEditDeleteOrphan">
    <p>Test</p>
  </div>
));

const props = {
  templateId: "",
  revisionId: "",
};

describe("Template Edit", function () {
  it("renders an orphan if no revision id", function () {
    (useTemplateInfoProvider as jest.Mock).mockReturnValue({
      templateInfo: {
        isLoading: false,
        currentRevision: {
          id: "",
        },
        template: {},
      },
    });
    render(<TemplateEdit {...props} />, {
      preloadedState: {} as RootState,
    });

    const templateEditDeleteOrphan = screen.queryByTestId(
      "templateEditDeleteOrphan"
    );
    const templateEditHeader = screen.queryByTestId("templateEditHeader");

    expect(templateEditDeleteOrphan).toBeTruthy();
    expect(templateEditHeader).toBeFalsy();
  });
  it("if is not a new constraint", function () {
    (useTemplateInfoProvider as jest.Mock).mockReturnValue({
      templateInfo: {
        isLoading: false,
        currentRevision: {
          id: "123",
        },
        template: {},
      },
    });
    render(<TemplateEdit {...props} />, {
      preloadedState: {} as RootState,
    });

    const templateEditDeleteOrphan = screen.queryByTestId(
      "templateEditDeleteOrphan"
    );
    const templateEditHeader = screen.queryByTestId("templateEditHeader");

    expect(templateEditDeleteOrphan).toBeFalsy();
    expect(templateEditHeader).toBeTruthy();
  });
});
