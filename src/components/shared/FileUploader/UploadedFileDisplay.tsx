import { FontIcon, IconButton } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import icons from "components/shared/Icons";
import { IUploadedTranslation } from "models/translations";
import customTheme from "helpers/customTheme";

type UploadedFileProps = {
  index: number;
  fileName: string;
  onDelete: (index: number) => void;
  disabled: boolean;
  error?: string;
};
// eslint-disable-next-line
const UploadedFile = ({
  index,
  fileName,
  onDelete,
  disabled,
  error,
}: UploadedFileProps) => (
  <>
    <div
      data-automation-id="uploaded-translation"
      style={{
        marginTop: 5,
        marginBottom: 5,
        width: 500,
        minHeight: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 5,
        backgroundColor: disabled
          ? customTheme.bodyDividerSemanticColor
          : customTheme.white,
        border: `1.95px solid ${
          error
            ? customTheme.errorTextSemanticColor
            : customTheme.menuDividerSemanticColor
        }`,
      }}
    >
      <Text style={{ marginLeft: 15 }}>
        <FontIcon
          iconName="WordDocument"
          style={{
            color: customTheme.blueIconColor,
            top: 2,
            position: "relative",
          }}
        />
        &nbsp;&nbsp;{fileName}
      </Text>
      <IconButton
        iconProps={icons.delete}
        title="Delete"
        onClick={() => {
          onDelete(index);
        }}
        disabled={disabled}
      />
    </div>
    {error && (
      <div role="alert">
        <p style={customTheme.errorMessage}>{error}</p>
      </div>
    )}
  </>
);

type UploadedFileDisplayProps = {
  uploadedTranslations: IUploadedTranslation[] | undefined;
  onDelete: (index: number) => void;
  disabled: boolean;
};
// eslint-disable-next-line
const UploadedFileDisplay = ({
  uploadedTranslations,
  onDelete,
  disabled,
}: UploadedFileDisplayProps) => (
  <div style={{ marginTop: 15 }}>
    {uploadedTranslations?.map((translation, index) => (
      <UploadedFile
        key={`uploadedFile_${index}`}
        fileName={translation.fileName}
        index={index}
        onDelete={onDelete}
        disabled={disabled}
        error={translation?.errorMessage}
      />
    ))}
  </div>
);

export default UploadedFileDisplay;
