import { IComboBoxOption } from "@fluentui/react";
import _ from "lodash";
import countries from "consts/countries";

import { IClauseContent, IClauseContentInfo } from "models/clauses";
import { ICustomClauseContentInfo } from "models/customClauses";
import {
  IClauseTranslationsForm,
  IUploadedTranslation,
} from "models/translations";
import stringsConst from "consts/strings";
import { maxFileSize, mimeTypes } from "consts/globals";

export const translationFormHasChanges = (
  uploadedTranslations: IUploadedTranslation[],
  removedTranslations: string[]
) => uploadedTranslations.length !== 0 || removedTranslations.length !== 0;

export const getTranslationLanguageFromFileName = (fileName: string) => {
  const languageRegex = /[^.]*_([^.]+)\.docx/;
  const matches = languageRegex.exec(fileName.toLowerCase());
  return matches ? matches![1] : null;
};

export const getLanguageFromUrl = (url: string) => {
  const tempArr = url.split("/");

  return tempArr[tempArr.length - 1];
};

/* 
  Example: 
    "en-us" => "English (US)"
    "fr-fr" => "French"
*/
export const getDisplayNameForLanguage = (language: string) => {
  const result = countries.find((country) => country.key === language);

  if (!result) return "";

  return result.text;
};

export const uploadTranslations = (files: File[]) =>
  files.map((file) => {
    const isoCode = getTranslationLanguageFromFileName(file.name);

    let fileObj: IUploadedTranslation = {
      fileName: file.name,
      fileType: file.type,
      blobUrl: "",
    };

    if (mimeTypes.includes(file.type)) {
      if (isoCode) {
        if (getDisplayNameForLanguage(isoCode)) {
          if (file.size < maxFileSize) {
            fileObj = {
              ...fileObj,
              blobUrl: window.URL.createObjectURL(file),
            };
          } else {
            fileObj = {
              ...fileObj,
              errorMessage: `${stringsConst.translations.maxFileSizeErrorMessage}${maxFileSize}`,
            };
          }
        } else {
          fileObj = {
            ...fileObj,
            errorMessage:
              stringsConst.translations.languageNotSupportedErrorMessage,
          };
        }
      } else {
        fileObj = {
          ...fileObj,
          errorMessage: stringsConst.translations.invalidFileNameErrorMessage,
        };
      }
    } else {
      fileObj = {
        ...fileObj,
        errorMessage: stringsConst.translations.invalidMimeTypeErrorMessage,
      };
    }
    return fileObj;
  });

export const clearUnneededTranslations = (
  existingTranslations: IUploadedTranslation[],
  resultingTranslations: IUploadedTranslation[]
) => {
  const resultTranslationFileNames = resultingTranslations.map(
    (t) => t.fileName
  );
  const unneededTranslations = existingTranslations.filter(
    (t) => !resultTranslationFileNames.includes(t.fileName)
  );
  unneededTranslations.forEach((item) => {
    window.URL.revokeObjectURL(item.blobUrl);
  });
  // for (let translation of unneededTranslations) {
  //   window.URL.revokeObjectURL(translation.blobUrl);
  // }
};

export const getTranslationIndex = (
  translations: IComboBoxOption[],
  locale: string
) => translations.findIndex((item) => item.key === locale);

export const sortByLanguageName = (clauseContents: IClauseContent[]) =>
  clauseContents.sort((a, b) => {
    const aLanguageName = getDisplayNameForLanguage(a.language);
    const bLanguageName = getDisplayNameForLanguage(b.language);

    return aLanguageName.localeCompare(bLanguageName);
  });

export const getDefaultTranslationsForm = (
  clauseContentInfo: IClauseContentInfo | ICustomClauseContentInfo
): IClauseTranslationsForm => ({
  existingTranslations:
    clauseContentInfo.contents?.map((c) => c.language) || [],
  removedTranslations: [],
  uploadedTranslations: [],
  successfullyRemovedTranslations: [],
  successfullyUploadedTranslations: [],
  isValid: true,
  hasChanges: false,
});

export const getUpToDateTranslationsForm = (
  contentInfo: IClauseContentInfo | ICustomClauseContentInfo,
  currentTranslationsForm: IClauseTranslationsForm
): IClauseTranslationsForm => {
  const currentTranslations =
    contentInfo.contents?.map((c) => c.language) || [];
  const hasUnremovedTranslations =
    currentTranslationsForm.removedTranslations.length > 0;
  const hasUnUploadedTranslations =
    currentTranslationsForm.uploadedTranslations.length > 0;

  return {
    existingTranslations: currentTranslations,
    removedTranslations: currentTranslationsForm.removedTranslations,
    uploadedTranslations: currentTranslationsForm.uploadedTranslations,

    // these two properties will be updated once the API calls return success/failure
    successfullyRemovedTranslations:
      currentTranslationsForm.successfullyRemovedTranslations,
    successfullyUploadedTranslations:
      currentTranslationsForm.successfullyUploadedTranslations,

    isValid: true,
    hasChanges: hasUnremovedTranslations || hasUnUploadedTranslations,
  };
};

export const getTranslationsToCopy = (
  translationsForm: IClauseTranslationsForm | undefined
): string[] => {
  if (!translationsForm) {
    return [];
  }

  const copiedTranslations = _.difference(
    translationsForm.existingTranslations,
    translationsForm.removedTranslations
  );

  return copiedTranslations;
};
