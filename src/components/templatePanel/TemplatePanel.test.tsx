import { fireEvent } from "@testing-library/react";
import { RootState } from "store";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import stringsConst from "consts/strings";
import TemplatePanel from "./TemplatePanel";
import TemplatePropertiesForm from "components/template/TemplatePropertiesForm";
import SharedClausePanelActions from "components/shared/SharedClausePanelActions";
import useNewTemplateInfoProvider from "hooks/template/useNewTemplateInfoProvider";
import useNewTemplateInitializer from "hooks/template/useNewTemplateInitializer";
import { IPanelProps, PanelType } from "models/panel";

jest.mock("hooks/template/useNewTemplateInfoProvider", () => jest.fn());

jest.mock("hooks/template/useNewTemplateInitializer", () => jest.fn());

jest.mock("components/template/TemplatePropertiesForm", () => () => (
  <div data-testid="templatePropertiesForm">
    <p>Test</p>
  </div>
));

describe("TemplateInfo", function () {
  it("renders the inner panel component TemplatePropertiesForm", function () {
    const mockFunction1 = jest.fn();
    (useNewTemplateInitializer as jest.Mock).mockReturnValue({
      onClosePanel: mockFunction1,
    });

    (useNewTemplateInfoProvider as jest.Mock).mockReturnValue({
      templateInfo: {
        template: {
          name: "",
          id: "",
        },
        isLoading: false,
        currentRevision: {
          id: "",
        },
        hasData: true,
      },
    });

    const props: IPanelProps = {
      panelInfo: {
        panelType: PanelType.Template,
        agreementObjectIds: {},
        additionalInfo: "",
      },
      isBlocking: false,
      persistentInfo: {},
    };
    const { queryByTestId, getByText, getByRole } = render(
      <TemplatePanel {...props} />,
      {
        preloadedState: {} as RootState,
      }
    );

    const heading = getByText(
      stringsConst.templatePanel.TemplatePanel.createNewTemplate
    );
    expect(heading).toBeInTheDocument();

    const templatePropertiesForm = queryByTestId("templatePropertiesForm");

    expect(templatePropertiesForm).toBeTruthy();

    const closeButton = getByRole("button", {
      name: /Close Panel/i,
    });

    fireEvent.click(closeButton);

    expect(mockFunction1).toBeCalled();
  });
});
