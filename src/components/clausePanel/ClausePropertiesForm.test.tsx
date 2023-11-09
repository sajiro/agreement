import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import ClausePropertiesForm from "./ClausePropertiesForm";
import { AgreementObjectEditState } from "models/agreements";
import { ClauseCategory } from "models/clauses";

const props = {
  editState: AgreementObjectEditState.NewClause,
  clauseInfo: {
    clause: {
      id: "1234",
      category: ClauseCategory.Content,
      createdDate: "2021-08-31T23:42:17Z",
      modifiedDate: "2021-08-31T23:42:17Z",
      createdBy: "",
      description: "",
      etag: "",
      modifiedBy: "",
      name: "",
      revisionsUri: "",
      status: "",
    },
    isLoading: false,
    hasData: false,
  },
};

describe("Clause Properties Form", function () {
  it("renders the component", function () {
    const { getByLabelText, getByPlaceholderText } = render(
      <ClausePropertiesForm {...props} />,
      {
        preloadedState: {
          clausePanelForms: {
            propertiesForm: {
              properties: {
                name: "Test Clause",
                category: "Test Category",
              },
              revisionProperties: {},
              isValid: true,
              hasChanges: false,
            },
          },
        } as RootState,
      }
    );

    const clauseLabel = getByLabelText(/Clause name/i);
    expect(clauseLabel).toBeInTheDocument();
    const versionLabel = getByLabelText(/Version description/i);
    const versionPlaceholder = getByPlaceholderText(
      /optional, short description of changes/i
    );
    expect(versionLabel).toBeInTheDocument();
    expect(versionPlaceholder).toBeInTheDocument();
    const categoryLabel = getByLabelText(/Category/i);
    expect(categoryLabel).toBeInTheDocument();
    const displayLabel = getByLabelText(/Display Option/i);
    expect(displayLabel).toBeInTheDocument();
  });
});
