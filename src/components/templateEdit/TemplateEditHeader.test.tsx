import { render, screen } from "test/customRender";
import TemplateEditHeader, {
  TemplateEditHeaderProps,
} from "./TemplateEditHeader";
import customTheme from "helpers/customTheme";
import { SharedActionBarWithLoading } from "components/shared/SharedActionBar";
import SharedNotification from "components/shared/SharedNotification";

import useTemplateMutationActionTrigger from "hooks/template/mutation/useTemplateMutationActionTrigger";

jest.mock("helpers/customTheme", () => jest.fn());

jest.mock("hooks/template/mutation/useTemplateMutationActionTrigger", () =>
  jest.fn()
);

jest.mock("components/shared/SharedActionBar", () => ({
  SharedActionBarWithLoading: () => (
    <div data-testid="sharedActionBar">
      <p>Test</p>
    </div>
  ),
}));

jest.mock("components/shared/SharedNotification", () => () => (
  <div data-testid="sharedNotification">
    <p>Test</p>
  </div>
));

const props: TemplateEditHeaderProps = {
  templateInfo: {
    isLoading: false,
    hasData: true,
  },
  setCurrentRevision: jest.fn(),
  isTemplateEditable: false,
  isPublishable: false
};

describe("TemplateEditHeader component", function () {
  it("renders the progress bar name", function () {
    const mockFunction1 = jest.fn();
    (useTemplateMutationActionTrigger as jest.Mock).mockReturnValue({
      triggerMutation: mockFunction1,
    });
    render(<TemplateEditHeader {...props} />);
    const progressIndicator = screen.getByRole("progressbar");

    expect(progressIndicator).toBeTruthy();
  });
  it("does not render the progress bar name", function () {
    const newProps = {
      ...props,
      isTemplateEditable: true,
    };
    const mockFunction1 = jest.fn();
    (useTemplateMutationActionTrigger as jest.Mock).mockReturnValue({
      triggerMutation: mockFunction1,
    });
    render(<TemplateEditHeader {...newProps} />);
    const progressIndicator = screen.queryByRole("progressbar");

    expect(progressIndicator).toBeFalsy();
  });
});
