import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import TemplatePropertiesForm from "./TemplatePropertiesForm";
import { TemplateEditState } from "models/templatePanel";
import { ITemplateInfo } from "models/templates";
import { RevisionStatus } from "models/revisions";

const props: {
  editState: TemplateEditState;
  templateInfo: ITemplateInfo;
} = {
  editState: TemplateEditState.NewTemplate,
  templateInfo: {
    template: {
      id: "123",
      createdDate: "2021-08-31T23:42:17Z",
      modifiedDate: "2021-08-31T23:42:17Z",
      category: "",
      constraints: [],
      createdBy: "",
      description: "",
      etag: "",
      modifiedBy: "",
      status: "",
      revisionsUri: "",
      name: "",
    },
    isLoading: false,
    hasData: false,
  },
};

describe("Template Properties Form", function () {
  it("renders the component as New Template", function () {
    const { getByLabelText, getByPlaceholderText } = render(
      <TemplatePropertiesForm {...props} />,
      {
        preloadedState: {
          templateForms: {
            propertiesForm: {
              name: "Test Template",
              description: "Template description",
            },
            templateId: "123",
            revisionId: "abc",
            isSubmitting: false,
          },
        } as RootState,
      }
    );

    const clauseLabel = getByLabelText(/Template name/i);
    expect(clauseLabel).toBeInTheDocument();
    const versionLabel = getByLabelText(/Version name/i);
    const versionPlaceholder = getByPlaceholderText(
      /optionally describe version updates/i
    );
    expect(versionLabel).not.toBeVisible();
    expect(versionPlaceholder).toBeInTheDocument();
    const descriptionLabel = getByLabelText(/Description/i);
    expect(descriptionLabel).toBeInTheDocument();
  });
  it("renders the component as EditTemplate", function () {
    const props: {
      editState: TemplateEditState;
      templateInfo: ITemplateInfo;
    } = {
      editState: TemplateEditState.Default,
      templateInfo: {
        template: {
          id: "123",
          createdDate: "2021-08-31T23:42:17Z",
          modifiedDate: "2021-08-31T23:42:17Z",
          category: "",
          constraints: [],
          createdBy: "",
          description: "",
          etag: "",
          modifiedBy: "",
          status: "",
          revisionsUri: "",
          name: "",
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
        hasData: false,
      },
    };
    const { getByLabelText, getByPlaceholderText } = render(
      <TemplatePropertiesForm {...props} />,
      {
        preloadedState: {
          templateForms: {
            propertiesForm: {
              name: "Test Template",
              description: "Template description",
            },
            templateId: "123",
            revisionId: "abc",
            isSubmitting: false,
          },
        } as RootState,
      }
    );

    const clauseLabel = getByLabelText(/Template name/i);
    expect(clauseLabel).toBeInTheDocument();
    const versionLabel = getByLabelText(/Version name/i);
    const versionPlaceholder = getByPlaceholderText(
      /optionally describe version updates/i
    );
    expect(versionLabel).toBeVisible();
    expect(versionPlaceholder).toBeInTheDocument();
    const descriptionLabel = getByLabelText(/Description/i);
    expect(descriptionLabel).toBeInTheDocument();
  });
});
