import { DefaultButton, FontIcon, mergeStyles } from "@fluentui/react";
import React, {
  memo,
  MutableRefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import { Text } from "@fluentui/react/lib/Text";
import icons from "components/shared/Icons";
import customTheme from "helpers/customTheme";
import stringsConst from "consts/strings";
import { useTrackingContext } from "../TrackingContext";

const dropZoneStyles = {
  default: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 5,
    width: 500,
    height: 100,
    borderColor: customTheme.menuDividerSemanticColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inactive: {
    border: `2px dashed ${customTheme.menuDividerSemanticColor}`,
  },
  active: {
    opacity: 0.5,
    background: customTheme.bodyDividerSemanticColor,
    border: `1px solid ${customTheme.bodyDividerSemanticColor}`,
  },
};

type FileInputProps = {
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  handleUploadedFiles: (filesList: FileList) => void;
};
const FileInput = memo(
  ({ fileInputRef, handleUploadedFiles }: FileInputProps) => (
    <input
      data-automation-id="upload-translations"
      ref={fileInputRef}
      type="file"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const ev = event;
        ev.preventDefault();
        ev.stopPropagation();
        const files = ev.target.files || new FileList();
        handleUploadedFiles(files);
        ev.target.value = ""; // Reset input's value so exact same files can be re-uploaded again
      }}
      hidden
      multiple
    />
  )
);

type FileUploaderProps = {
  disabled: boolean;
  onFilesUploaded: (files: File[]) => void;
};
const FileUploader = memo(
  ({ onFilesUploaded, disabled }: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [inDropZone, setInDropZone] = useState<boolean>(false);
    const { trackEvent } = useTrackingContext();

    const additionalDropZoneStyle =
      disabled || inDropZone ? dropZoneStyles.active : dropZoneStyles.inactive;
    const dropZoneClass = mergeStyles({
      ...dropZoneStyles.default,
      ...additionalDropZoneStyle,
    });

    const handleDragEvent = useCallback(
      (event: React.DragEvent<HTMLDivElement>, isInDropZone: boolean) => {
        event.preventDefault();
        event.stopPropagation();
        if (!disabled) setInDropZone(isInDropZone);
      },
      [setInDropZone]
    );

    const handleUploadedFiles = useCallback(
      (filesList: FileList) => {
        const files = Array.from(Array(filesList.length).keys()).map(
          (i) => filesList.item(i)!
        );
        onFilesUploaded(files);
      },
      [onFilesUploaded]
    );

    return (
      <div
        className={dropZoneClass}
        onDragEnter={(event) => {
          handleDragEvent(event, true);
        }}
        onDragLeave={(event) => {
          handleDragEvent(event, false);
        }}
        onDragOver={(event) => {
          const ev = event;
          handleDragEvent(ev, true);
          if (!disabled) ev.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(event) => {
          const ev = event;
          handleDragEvent(ev, false);
          if (!disabled) handleUploadedFiles(ev.dataTransfer.files);
        }}
      >
        <div>
          <Text>
            <FontIcon iconName="Attach" />{" "}
            {stringsConst.shared.FileUploader.dragDropText}
          </Text>
          &nbsp;&nbsp;Or&nbsp;&nbsp;
          <DefaultButton
            text="Select file"
            iconProps={icons.uploadFile}
            disabled={disabled || inDropZone}
            onClick={() => {
              trackEvent("Select translation file button clicked");
              fileInputRef.current!.click();
            }}
          >
            <FileInput
              fileInputRef={fileInputRef}
              handleUploadedFiles={handleUploadedFiles}
            />
          </DefaultButton>
        </div>
      </div>
    );
  }
);

export default FileUploader;
