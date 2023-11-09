import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { IAgreementForm } from "./agreements";

export interface IClauseTranslationsForm extends IAgreementForm {
  existingTranslations: string[];
  removedTranslations: string[];
  uploadedTranslations: IUploadedTranslation[];
  successfullyRemovedTranslations: string[];
  successfullyUploadedTranslations: string[];
  isValid: boolean;
}

export interface IUploadedTranslation {
  fileName: string;
  fileType: string;
  blobUrl: string;
  errorMessage?: string;
}

export interface IUpdateTranslationInfo {
  translationInfo: IUploadedTranslation[];
  clauseId: string;
  revisionId: string;
  templateId?: string;  // for custom clause
}

export interface IDeleteTranslationInfo {
  languageLocales: string[];
  clauseId: string;
  revisionId: string;
}

export interface ICopyTranslationInfo {
  clauseId: string, 
  sourceRevisionId: string; 
  targetRevisionId: string;
  languageLocales: string[];
}

export interface ITranslationQueryResult {
  success: string[];
  fail: string[];

  // store the error data for 404 error handling -- only clauses, not custom clauses 
  errors?: FetchBaseQueryError[];
}
