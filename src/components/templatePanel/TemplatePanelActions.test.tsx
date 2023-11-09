import { RootState } from "store";
import { fireEvent, screen } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import TemplatePanelActions, {
  TemplatePanelActionsProps,
} from "./TemplatePanelActions";
import useTemplateMutationActionTrigger from "hooks/template/mutation/useTemplateMutationActionTrigger";
import { RevisionStatus } from "models/revisions";
import { TemplateEditState } from "models/templatePanel";

jest.mock("hooks/template/mutation/useTemplateMutationActionTrigger", () =>
  jest.fn()
);

const props: TemplatePanelActionsProps = {
  templateInfo: {
    template: {
      name: "",
      id: "",
      category: "",
      constraints: [],
      createdBy: "",
      createdDate: "",
      description: "",
      etag: "",
      modifiedBy: "",
      modifiedDate: "",
      revisionsUri: "",
      status: "",
    },
    isLoading: false,
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
    hasData: true,
  },
  editState: TemplateEditState.NewTemplate,
  onClosePanel: jest.fn(),
};

describe("TemplatePanelActions", function () {
  it("renders the inner panel component TemplatePropertiesForm and calls the correct button functions", function () {
    const mockFunction1 = jest.fn();
    (useTemplateMutationActionTrigger as jest.Mock).mockReturnValue({
      triggerMutation: mockFunction1,
    });

    const { getByRole } = render(<TemplatePanelActions {...props} />, {
      preloadedState: {
        templateForms: {
          propertiesForm: {
            name: "Test Template",
            description: "Template description",
            revision: "",
          },
          isSubmitting: false,
        },
      } as RootState,
    });

    const createButton = getByRole("button", {
      name: /Create/i,
    });

    fireEvent.click(createButton);

    expect(mockFunction1).toBeCalled();

    const cancelButton = getByRole("button", {
      name: /Cancel/i,
    });

    fireEvent.click(cancelButton);

    expect(props.onClosePanel).toBeCalled();
  });
  it("shows the create button is disabled when form is empty", function () {
    const mockFunction1 = jest.fn();
    (useTemplateMutationActionTrigger as jest.Mock).mockReturnValue({
      triggerMutation: mockFunction1,
    });
    const { getByRole } = render(<TemplatePanelActions {...props} />, {
      preloadedState: {
        templateForms: {
          propertiesForm: {
            name: "",
            description: "",
            revision: "",
          },
          isSubmitting: false,
        },
      } as RootState,
    });

    const createButton = getByRole("button", {
      name: /Create/i,
    });

    expect(createButton).toBeDisabled();
  });
});
