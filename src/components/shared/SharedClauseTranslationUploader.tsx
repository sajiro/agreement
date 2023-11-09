import { mergeStyleSets } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import FileUploader from "components/shared/FileUploader/FileUploader";
import UploadedFileDisplay from "components/shared/FileUploader/UploadedFileDisplay";
import { uploadTranslations } from "helpers/translations";
import _ from "lodash";
import { IUploadedTranslation } from "models/translations";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";
import { memo, useCallback } from "react";

type ClauseTranslationUploaderProps = {
  isCustomClause: boolean;
  disabled: boolean;
  uploadedTranslations: IUploadedTranslation[] | undefined;
  updateUploadedTranslations: (
    uploadedTranslations: IUploadedTranslation[]
  ) => void;
};

const SharedClauseTranslationUploader = memo(({
  isCustomClause,
  disabled,
  uploadedTranslations,
  updateUploadedTranslations,
}: ClauseTranslationUploaderProps) => {
  const onFilesUploaded = useCallback((files: File[]) => {
    const newTranslations: IUploadedTranslation[] = uploadTranslations(files);
    const existingUploadedTranslations = _.cloneDeep<IUploadedTranslation[]>(uploadedTranslations!);
    existingUploadedTranslations.push(...newTranslations);
    updateUploadedTranslations(existingUploadedTranslations);
  }, [updateUploadedTranslations, uploadedTranslations]);

  const onDelete = useCallback((index: number) => {
    const changedUploadedFiles = _.cloneDeep<IUploadedTranslation[]>(uploadedTranslations!);
    changedUploadedFiles.splice(index, 1);
    updateUploadedTranslations(changedUploadedFiles);
  }, [updateUploadedTranslations, uploadedTranslations]);

  const styles = mergeStyleSets({
    title: {
      fontWeight: 600,
      lineHeight: 20,
      marginBottom: isCustomClause ? 16 : 5,
    },
    intro: isCustomClause
      ? {
          display: "none",
        }
      : {
          marginBottom: 20,
          color: customTheme.secondaryGrey130,
        },
  });

  return (
    <div>
      <Text block className={styles.title}>
        {
          stringsConst.clausePanel.ClauseTranslationUploader
            .uploadNewTranslations
        }
      </Text>
      <Text block className={styles.intro}>
        {
          stringsConst.clausePanel.ClauseTranslationUploader
            .uploadNewTranslationsIntro
        }
      </Text>
      <FileUploader disabled={disabled} onFilesUploaded={onFilesUploaded} />
      <UploadedFileDisplay
        uploadedTranslations={uploadedTranslations}
        onDelete={onDelete}
        disabled={disabled}
      />
    </div>
  );
});

export default SharedClauseTranslationUploader;
