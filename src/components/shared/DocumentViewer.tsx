import { CSSProperties, useEffect, useState } from "react";
import useDocumentPreview from "hooks/useDocumentPreview";
import DocumentViewerError from "components/shared/DocumentViewerError";
import stringsConst from "consts/strings";

export interface DocumentViewerProps {
  fileName: string | undefined;
  frameHeight?: string;
  errorTextStyle?: CSSProperties;
}

function DocumentViewer({
  fileName,
  frameHeight = "100%",
  errorTextStyle,
}: DocumentViewerProps) {
  const { generateIFramePreview } = useDocumentPreview();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [iframeContent, setIFrameContent] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { isError, content } = await generateIFramePreview(fileName!);
      if (!isError) {
        setErrorMessage(undefined);
        setIFrameContent(content);
        return;
      }

      setErrorMessage(`${stringsConst.common.officeOnlineError} ${content}`);
    };
    if (fileName) {
      fetchData();
    }
  }, [fileName, setErrorMessage, setIFrameContent]);

  return (
    <>
      {errorMessage && (
        <DocumentViewerError
          errorMessage={errorMessage}
          errorStyle={errorTextStyle}
        />
      )}
      {!errorMessage && iframeContent && (
        <iframe
          // need to set tab index of iframe to allow the rest of the elements outside of the iframe to be tab-able
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          data-automation-id="Preview-document"
          srcDoc={iframeContent}
          style={{ width: "100%", height: frameHeight, border: "none" }}
          title="clause preview"
          className="'terms-office-iframe"
          aria-label="clause preview"
        />
      )}
    </>
  );
}

export default DocumentViewer;
