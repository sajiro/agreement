import { AgreementObjectEditState } from "models/agreements";
import { CustomClauseCategory } from "models/customClauses";
import { RootState } from "store";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory

import CustomClausePropertiesForm from "./CustomClausePropertiesForm";

const props = {
  editState: AgreementObjectEditState.NewClause,
  clauseInfo: {
    clause: {
      category: CustomClauseCategory.Content,
      createdBy: "",
      createdDate: "",
      description: "",
      etag: "",
      id: "",
      modifiedBy: "",
      modifiedDate: "",
      name: "",
      revisionsUri: "",
      templateId: "",
      templateName: "",
    },
    isLoading: false,
    hasData: false,
  },
};

describe("Clause Properties Form", function () {
  it("renders the component", function () {
    const { getByLabelText } = render(
      <CustomClausePropertiesForm {...props} />,
      {
        preloadedState: {
          customClausePanelForms: {
            propertiesForm: {
              properties: {
                name: "Test Custom Clause",
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
    const versionLabel = getByLabelText(/Template/i);
    expect(versionLabel).toBeInTheDocument();
    const descriptionLabel = getByLabelText(/Description/i);
    expect(descriptionLabel).toBeInTheDocument();
  });
});
