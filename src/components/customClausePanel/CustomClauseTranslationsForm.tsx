import { IUploadedTranslation } from "models/translations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { customClausePanelFormsActions } from "store/customClausePanelFormsSlice";

import SharedClauseTranslationUploader from "components/shared/SharedClauseTranslationUploader";

// eslint-disable-next-line react/function-component-definition
const CustomClauseTranslationsForm = ({
  isLoadingTranslations,
}: {
  isLoadingTranslations: boolean;
}) => {
  const { translationsForm, isSubmitting } = useSelector(
    (state: RootState) => state.customClausePanelForms
  );
  const dispatch = useDispatch();
  const isLoading = isSubmitting || isLoadingTranslations;

  const updateUploadedTranslations = (
    uploadedFiles: IUploadedTranslation[]
  ) => {
    dispatch(customClausePanelFormsActions.updateUploadedTranslations(uploadedFiles));
  };

  return (
    <div style={{ maxWidth: "50%" }} data-testid="customClauseTranslationsForm">
      <SharedClauseTranslationUploader
        isCustomClause
        disabled={isLoading}
        uploadedTranslations={translationsForm?.uploadedTranslations}
        updateUploadedTranslations={updateUploadedTranslations}
      />
    </div>
  );
};

export default CustomClauseTranslationsForm;
