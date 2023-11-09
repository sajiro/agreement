import { IUploadedTranslation } from "models/translations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { clausePanelFormsActions } from "store/clausePanelFormsSlice";

import SharedClauseTranslationUploader from "components/shared/SharedClauseTranslationUploader";
import { memo, useCallback } from "react";
import ClauseTranslationRemover from "./ClauseTranslationRemover";

const ClauseTranslationsForm = memo(({
  isLoadingTranslations,
}: {
  isLoadingTranslations: boolean;
}) => {
  const { translationsForm, isSubmitting } = useSelector((state: RootState) => state.clausePanelForms);
  const dispatch = useDispatch();
  const isLoading = isSubmitting || isLoadingTranslations;

  const updateUploadedTranslations = useCallback((uploadedFiles: IUploadedTranslation[]) => {
    dispatch(clausePanelFormsActions.updateUploadedTranslations(uploadedFiles));
  }, [dispatch]);

  const updateRemovedTranslations = useCallback((removedTranslations: string[]) => {
    dispatch(clausePanelFormsActions.updateRemovedTranslations(removedTranslations));
  }, [dispatch]);

  return (
    <div style={{ maxWidth: "500px" }} data-testid="clauseTranslationsForm">
      <SharedClauseTranslationUploader
        isCustomClause={false}
        disabled={isLoading}
        uploadedTranslations={translationsForm?.uploadedTranslations}
        updateUploadedTranslations={updateUploadedTranslations}
      />
      {translationsForm?.existingTranslations.length !== 0 && (
        <ClauseTranslationRemover
          disabled={isLoading}
          existingTranslations={translationsForm?.existingTranslations}
          removedTranslations={translationsForm?.removedTranslations}
          successfullyRemovedTranslations={
            translationsForm?.successfullyRemovedTranslations
          }
          successfullyUploadedTranslations={
            translationsForm?.successfullyUploadedTranslations
          }
          updateRemovedTranslations={updateRemovedTranslations}
        />
      )}
    </div>
  );
});

export default ClauseTranslationsForm;
