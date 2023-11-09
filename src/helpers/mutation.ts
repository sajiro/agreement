import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError, QueryStatus } from "@reduxjs/toolkit/dist/query";
import { ITranslationQueryResult } from "models/translations";

export const getMutationErrorAs = <T>(error: FetchBaseQueryError | SerializedError): T => 
 (error as FetchBaseQueryError).data! as T;


export const isMutationCompleted = (result: {status: QueryStatus}) => 
 result.status === QueryStatus.fulfilled || result.status === QueryStatus.rejected;


// check the mutation result to determine whether it's a 404 error
export const is404Error = (result: any) =>
  result.error && 
  (result.error as FetchBaseQueryError).status === 404;


// check the translation(s) query result to determine whether it has any 404 error
export const hasAny404Error = (data: ITranslationQueryResult | undefined) =>
  data &&
  Array.isArray(data.errors) &&
  data.errors.some((error) => error.status === 404);


// get the first 404 error (if any) from the translation(s) query result
export const getFirst404Error = (data: ITranslationQueryResult) =>
  data.errors!.find((error) => error.status === 404);


// move every 404 error from the translation(s) query result -- from data.fail to data.success
// use this function only when deleting translation(s) that have been deleted by other users
export const mark404ErrorsAsSuccess = (
  data: ITranslationQueryResult
): ITranslationQueryResult => {

  const the404Errors = data.errors!.filter((error) => 
    error.status === 404
  );
  const errorLangLocales = the404Errors.map((error) =>
    (error.data as any).languageLocale || ""
  );

  const failList = data.fail.filter((langLocale) => 
    !errorLangLocales.includes(langLocale)
  );
  const successList = [...data.success, ...errorLangLocales];

  return {
    success: successList,
    fail: failList,
    errors: data.errors,
  }
};


// check the 404 error message to determine whether the mutation target is a revision
export const is404ErrorForClause = (errorData: any) =>
  errorData && (
    (
      Array.isArray(errorData.details) && 
      errorData.details[0] && 
      errorData.details[0].message &&
      (errorData.details[0].message as string).slice(0, 4).toLowerCase() === "part"
    ) ||
    (
      errorData.message &&
      (errorData.message as string).slice(0, 4).toLowerCase() === "part"
    )
  );


// check the 404 error message to determine whether the mutation target is a revision
export const is404ErrorForRevision = (errorData: any) =>
  errorData && (
    (
      Array.isArray(errorData.details) && 
      errorData.details[0] && 
      errorData.details[0].message &&
      (errorData.details[0].message as string).slice(0, 8).toLowerCase() === "revision"
    ) ||
    (
      errorData.message &&
      (errorData.message as string).slice(0, 8).toLowerCase() === "revision"
    )
  );
