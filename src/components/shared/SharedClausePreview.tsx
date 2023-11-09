/* eslint-disable no-param-reassign */

import { useEffect, useMemo, useState } from "react";
import { IComboBoxOption, mergeStyleSets } from "@fluentui/react";
import CustomComboBox from "components/shared/constraints/CustomComboBox";
import DocumentViewer from "components/shared/DocumentViewer";
import DocumentViewerError from "components/shared/DocumentViewerError";
import {
  getDisplayNameForLanguage,
  getTranslationIndex,
} from "helpers/translations";
import { IClauseContent, IClauseContentInfo } from "models/clauses";
import {
  ICustomClauseContent,
  ICustomClauseContentInfo,
} from "models/customClauses";
import stringsConst from "consts/strings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useGetClausePreviewMutation } from "services/preview";
import flat, { unflatten } from "flat";
import { contentPlaceholdersActions } from "store/contentPlaceholdersSlice";
import _ from "lodash";
import customTheme from "helpers/customTheme";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

const styles = mergeStyleSets({
  comboBox: {
    position: "absolute",
    minWidth: "100px",
    float: "right",
    right: "0px",
    top: "5px",
    selectors: {
      "::after": {
        content: "''",
        clear: "both",
        display: "table",
      },
    },
  },
  previewContainer: {
    height: "calc(100vh - 388px)",
    minHeight: "250px",
    ".ms-Panel &": {
      height: "99%",
    },
  },
});

const getTranslationOptions = (
  clauseContentInfo: IClauseContentInfo | ICustomClauseContentInfo
): IComboBoxOption[] =>
  clauseContentInfo.contents?.map(
    (content: IClauseContent | ICustomClauseContent) => ({
      key: content.language,
      text: getDisplayNameForLanguage(content.language),
    })
  ) || [];

type ClausePreviewProps = {
  clauseId: string | undefined;
  revisionId: string | undefined;
  clauseContentInfo: IClauseContentInfo | ICustomClauseContentInfo;
  isCustomClause: boolean;
  dynamicPlaceholderContentInfo: IClauseContent | undefined;
};

// eslint-disable-next-line react/function-component-definition
const SharedClausePreview = ({
  clauseId,
  revisionId,
  clauseContentInfo,
  isCustomClause,
  dynamicPlaceholderContentInfo,
}: ClausePreviewProps) => {
  const translationOptions = useMemo(
    () => getTranslationOptions(clauseContentInfo),
    [clauseContentInfo]
  );
  const [getPreviewData, { data: previewData, error }] =
    useGetClausePreviewMutation();

  const errorInfo = (error as FetchBaseQueryError)?.data as { Message: string };
  const [previewId, setPreviewId] = useState<string | undefined>();
  const contentPlaceHolderInfo = useSelector((state: RootState) => state);
  let placeholderData: any;
  const allClausePlaceholders = Object.entries(
    contentPlaceHolderInfo.contentPlaceholders
  );
  const currentClause = allClausePlaceholders.filter(
    (item) => item[0] === `${clauseId}.${revisionId}`
  );
  if (currentClause.length > 0) {
    placeholderData = unflatten(currentClause[0][1]);
  }

  const [selectedTranslation, setSelectedTranslation] = useState<
    string | undefined
  >();

  const dispatch = useDispatch();

  function removeEmptyPlaceHolders(placeHolders: any) {
    Object.entries(placeHolders).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => { removeEmptyPlaceHolders(val); });
        placeHolders[key] = value.filter(val => !_.isEmpty(val));
      }

      if (typeof value === "object") {
        removeEmptyPlaceHolders(value);
      }

      if (_.isEmpty(placeHolders[key])) {
        delete placeHolders[key];
      }
    });
  };

  const recursiveRender = (placeHolder: any) => {
    const placeHolderCopy = { ...placeHolder };
    Object.entries(placeHolderCopy).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((subValue) => {
          placeholderData[key] = `[${JSON.stringify(subValue)}]`;
          recursiveRender(subValue);
        });
      }
      if (typeof value === "object") {
        recursiveRender(value);
      }
    });
    return placeHolderCopy;
  };
  useEffect(() => {
    if (
      placeholderData === undefined &&
      !isCustomClause &&
      dynamicPlaceholderContentInfo
    ) {
      const flats = flat(dynamicPlaceholderContentInfo?.contents) as {
        key: string;
        value: string;
      };
      if (clauseId && revisionId) {
        Object.entries(flats).forEach(([key]) => {
          dispatch(
            contentPlaceholdersActions.updateRevision({
              clauseId,
              revisionId,
              id: key,
              value: "",
            })
          );
        });
      }
    }
  }, [placeholderData, dynamicPlaceholderContentInfo, clauseId, revisionId]);

  useEffect(() => {
    if (_.isEmpty(dynamicPlaceholderContentInfo?.contents)) {
      placeholderData = {};
    }
    if (
      placeholderData !== undefined &&
      !isCustomClause &&
      selectedTranslation
    ) {
      removeEmptyPlaceHolders(placeholderData);
      recursiveRender(placeholderData);
      getPreviewData({
        clauseId,
        revisionId,
        language: selectedTranslation?.toLowerCase(),
        content: placeholderData,
      });
    }
  }, [
    getPreviewData,
    clauseId,
    revisionId,
    selectedTranslation,
    contentPlaceHolderInfo.contentPlaceholders,
  ]);

  useEffect(() => {
    if (!isCustomClause) setPreviewId(previewData?.id);
  }, [previewData]);

  useEffect(() => {
    const englishUSIndex = getTranslationIndex(translationOptions, "en-us");
    const initialTranslation =
      englishUSIndex > -1
        ? translationOptions[englishUSIndex]
        : translationOptions[0];

    setSelectedTranslation(initialTranslation?.key as string);
  }, [translationOptions]);

  let selectedTranslationFileName: string | undefined = isCustomClause
    ? `CustomPart~${clauseId}~${selectedTranslation?.toLowerCase()}~${revisionId}`
    : `Preview~00000000-0000-0000-0000-000000000000~${selectedTranslation?.toLowerCase()}~${previewId}`;

  selectedTranslationFileName = selectedTranslation
    ? selectedTranslationFileName
    : undefined;

  const onOptionSelected = (option: IComboBoxOption | undefined) => {
    const selectedTranslationOption = option?.key as string;
    setPreviewId(undefined);
    setSelectedTranslation(selectedTranslationOption);
  };

  if (translationOptions.length === 0) {
    return (
      <p
        data-automation-id="preview-no-translation"
        style={{ paddingLeft: "12px", color: customTheme.secondaryGrey130 }}
      >
        {stringsConst.common.noTranslations}
      </p>
    );
  }

  return (
    <>
      <div
        className={styles.comboBox}
        data-automation-id="preview-select-translation"
      >
        <CustomComboBox
          options={translationOptions}
          onOptionSelected={onOptionSelected}
          defaultKey={selectedTranslation}
          noStyleChange
          borderBottomFixed
        />
      </div>
      <div
        data-automation-id="preview-document-viewer"
        className={styles.previewContainer}
      >
        {error && (
          <DocumentViewerError
            errorMessage={errorInfo.Message}
            errorStyle={{ marginLeft: 5 }}
          />
        )}
        {!isCustomClause && !previewId ? null : (
          <DocumentViewer
            fileName={selectedTranslationFileName}
            errorTextStyle={{ marginLeft: 5 }}
          />
        )}
      </div>
    </>
  );
};

export default SharedClausePreview;
