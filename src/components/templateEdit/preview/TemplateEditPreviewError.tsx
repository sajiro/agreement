import { FontIcon } from "@fluentui/react";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { MultipleHeaderFooterPartFoundErrorCode } from "consts/globals";
import stringsConst from "consts/strings";
import { isSlotGroup } from "helpers/slot";
import { ClauseCategory } from "models/clauses";
import { CSSProperties } from "react";
import { useGetSlotTreeQuery } from "services/slot";
import { Text } from "@fluentui/react/lib/Text";
import { ISlotTree } from "models/slot";
import {
  ITemplatePreviewError,
  noActiveRevisionLanguagePreviewErrorInfo,
  noCorrespondingLanguagePreviewErrorInfo,
} from "models/templates";
import customTheme from "helpers/customTheme";

const genericErrorStyles: CSSProperties = {
  textAlign: "center",
  padding: "120px 10px 10px",
  margin: "0 auto",
  width: 250,
};

const getNonHeaderFooterErrorMessage = (
  error: FetchBaseQueryError,
  slotTree: ISlotTree,
  isInvalidConstraintSettings: boolean
) => {
  if (!isInvalidConstraintSettings)
    return stringsConst.templateEdit.preview.noDoc;
  const errorInfo = error.data as ITemplatePreviewError;
  if (!errorInfo?.details || !errorInfo.details[0])
    return stringsConst.templateEdit.preview.defaultPreviewError;
  const errorDetail = errorInfo.details[0];
  const slotNodes = Object.values(slotTree.nodes);

  if (errorDetail.code === noActiveRevisionLanguagePreviewErrorInfo.code) {
    const errorRegex = new RegExp(
      noActiveRevisionLanguagePreviewErrorInfo.messageRegex
    );
    const match = errorRegex.exec(errorDetail.message);
    const clauseId = match![1];
    const clauseName = slotNodes.find((s) => s.partId === clauseId)!.partName;
    return `No active revision exists for clause: ${clauseName} for selected date`;
  }

  if (errorDetail.code === noCorrespondingLanguagePreviewErrorInfo.code) {
    const errorRegex = new RegExp(
      noCorrespondingLanguagePreviewErrorInfo.messageRegex
    );
    const match = errorRegex.exec(errorDetail.message);
    const language = match![1];
    const clauseId = match![2];
    const clauseName = slotNodes.find((s) => s.partId === clauseId)!.partName;
    return `No language: ${language} was associated with assembled revision for clause: ${clauseName}`;
  }

  return stringsConst.templateEdit.preview.defaultPreviewError;
};

type TemplateEditPreviewProps = {
  error: FetchBaseQueryError | SerializedError | undefined;
  templateId: string;
  revisionId: string;
};
function TemplateEditPreviewError({
  error,
  templateId,
  revisionId,
}: TemplateEditPreviewProps) {
  const { currentData: slotTree } = useGetSlotTreeQuery({
    templateId,
    revisionId,
  }); // Assumes slot tree is already retrieved/cached

  const getHeaderFooterErrorSlotNames = () => {
    const errorInfo = error as { data: { code: string } };
    if (
      errorInfo &&
      errorInfo.data &&
      errorInfo.data.code === MultipleHeaderFooterPartFoundErrorCode
    ) {
      const slotList = Object.values(slotTree!.nodes);
      const headerFooterSlots = slotList.filter(
        (s) =>
          !isSlotGroup(s) &&
          s.category === ClauseCategory.HeaderFooter.toString()
      );
      return headerFooterSlots.map((s) => s.partName);
    }

    return [];
  };

  // Handling Header/Footer Errors as special case, rest will be treated as generic errors
  // Assumes that if Header/Footer error occurs, slot tree must have slots containing header/footer clauses
  const headerFooterErrorSlotNames = getHeaderFooterErrorSlotNames();
  const isHeaderFooterError = headerFooterErrorSlotNames.length > 0;
  const isInvalidConstraintSettings =
    (error as FetchBaseQueryError)?.status === 400;
  const nonHeaderFooterErrorMessage = getNonHeaderFooterErrorMessage(
    error as FetchBaseQueryError,
    slotTree!,
    isInvalidConstraintSettings
  );

  return (
    <>
      {!isHeaderFooterError && (
        <div style={genericErrorStyles}>
          {!isInvalidConstraintSettings && (
            <FontIcon
              iconName="ErrorBadge"
              style={{
                color: customTheme.errorIcon,
                marginRight: 3,
                position: "relative",
                top: 2,
              }}
            />
          )}
          <Text>{nonHeaderFooterErrorMessage}</Text>
        </div>
      )}
      {isHeaderFooterError && (
        <div style={{ width: 495, margin: "auto", paddingTop: 120 }}>
          <div style={{ marginBottom: 12 }}>
            <FontIcon
              iconName="ErrorBadge"
              style={{ color: customTheme.errorIcon, marginRight: 8 }}
            />
            <Text variant="mediumPlus" style={{ fontWeight: 500 }}>
              Too many headers
            </Text>
          </div>
          <div style={{ marginLeft: 22 }}>
            <Text block style={{ marginBottom: 12 }}>
              {stringsConst.templateEdit.preview.headerFooterExplanation}
            </Text>
            <Text block>
              {stringsConst.templateEdit.preview.headerFooterError}
            </Text>
            <ul style={{ paddingLeft: 25 }}>
              {headerFooterErrorSlotNames.map((name, index) => (
                <li key={`headerFooterErrorSlot_${index}`}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default TemplateEditPreviewError;
