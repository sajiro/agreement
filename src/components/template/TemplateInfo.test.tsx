import { screen } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import TemplateInfo from "./TemplateInfo";
import InfoPageTitle, {
  InfoPageTitleWithLoading,
} from "components/shared/InfoPageTitle";
import { SharedActionBarWithLoading } from "components/shared/SharedActionBar";
import { TemplatePropertiesViewWithLoading } from "components/template/TemplatePropertiesView";

import NoItemSelectedDisplay from "components/shared/NoItemSelectedDisplay";
import DeleteOrphan from "components/shared/DeleteOrphan";
import useTemplateInfoProvider from "hooks/template/useTemplateInfoProvider";

jest.mock("hooks/template/useTemplateInfoProvider", () => jest.fn());

jest.mock("components/shared/DeleteOrphan", () => () => (
  <div data-testid="deleteOrphan">
    <p>Test</p>
  </div>
));

jest.mock("components/shared/NoItemSelectedDisplay", () => () => (
  <div data-testid="noItemSelectedDisplay">
    <p>Test</p>
  </div>
));

jest.mock("components/shared/SharedActionBar", () => ({
  SharedActionBarWithLoading: () => (
    <div data-testid="sharedActionBar">
      <p>Test</p>
    </div>
  ),
}));

jest.mock("components/template/TemplatePropertiesView", () => ({
  TemplatePropertiesViewWithLoading: () => (
    <div data-testid="templatePropertiesView">
      <p>Test</p>
    </div>
  ),
}));

jest.mock("components/shared/InfoPageTitle", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="infoPageTitle">
      <p>Test</p>
    </div>
  ),
  InfoPageTitleWithLoading: () => (
    <div data-testid="infoPageTitleWithLoading">
      <p>Test</p>
    </div>
  ),
}));

describe("TemplateInfo", function () {
  it("renders the noItemSelectedDisplay component only if isNothingSelected is false", function () {
    (useTemplateInfoProvider as jest.Mock).mockReturnValue({
      templateInfo: {},
    });
    const props = {
      templateId: "",
      isNothingSelected: true,
    };
    const { queryByTestId } = render(<TemplateInfo {...props} />, {
      preloadedState: {} as RootState,
    });
    const noItemSelectedDisplay = queryByTestId("noItemSelectedDisplay");
    const sharedActionBar = queryByTestId("sharedActionBar");
    const templatePropertiesView = queryByTestId("templatePropertiesView");
    const infoPageTitle = queryByTestId("infoPageTitleWithLoading");

    expect(infoPageTitle).toBeFalsy();
    expect(sharedActionBar).toBeFalsy();
    expect(templatePropertiesView).toBeFalsy();
    expect(noItemSelectedDisplay).toBeTruthy();
  });
  it("renders the template info if isNothingSelected is false", function () {
    (useTemplateInfoProvider as jest.Mock).mockReturnValue({
      templateInfo: {},
    });
    const props = {
      templateId: "",
      isNothingSelected: false,
    };
    const { queryByTestId } = render(<TemplateInfo {...props} />, {
      preloadedState: {} as RootState,
    });
    const noItemSelectedDisplay = queryByTestId("noItemSelectedDisplay");
    const sharedActionBar = queryByTestId("sharedActionBar");
    const templatePropertiesView = queryByTestId("templatePropertiesView");
    const infoPageTitle = queryByTestId("infoPageTitleWithLoading");

    expect(infoPageTitle).toBeTruthy();
    expect(sharedActionBar).toBeTruthy();
    expect(templatePropertiesView).toBeTruthy();
    expect(noItemSelectedDisplay).toBeFalsy();
  });
  it("renders deleted orphan", function () {
    (useTemplateInfoProvider as jest.Mock).mockReturnValue({
      templateInfo: {
        isLoading: false,
        currentRevision: {
          id: "",
        },
        template: {
          id: "123",
        },
      },
    });

    const props = {
      templateId: "",
      isNothingSelected: false,
    };
    const { queryByTestId } = render(<TemplateInfo {...props} />, {
      preloadedState: {} as RootState,
    });

    const noItemSelectedDisplay = queryByTestId("noItemSelectedDisplay");
    const sharedActionBar = queryByTestId("sharedActionBar");
    const templatePropertiesView = queryByTestId("templatePropertiesView");
    const infoPageTitle = queryByTestId("infoPageTitle");

    expect(sharedActionBar).toBeFalsy();
    expect(templatePropertiesView).toBeFalsy();
    expect(noItemSelectedDisplay).toBeFalsy();

    const deleteOrphan = queryByTestId("deleteOrphan");
    expect(infoPageTitle).toBeTruthy();
    expect(deleteOrphan).toBeTruthy();
  });
});
