import { createApi } from "@reduxjs/toolkit/query/react";

import { sortAgreementObjectsByNameAsc } from "helpers/agreements";
import {
  applyRevisionOrderingAndCorrectStatuses,
  getRevisionStatusForUpdate,
} from "helpers/revisions";
import {
  getDisplayNameForLanguage,
  getLanguageFromUrl,
  getTranslationLanguageFromFileName,
  sortByLanguageName,
} from "helpers/translations";
import { IAgreementObject } from "models/agreements";

import {
  ICreateClauseRequest,
  ICreateClauseRevisionRequest,
} from "models/clauseMutation";
import {
  IDeleteTranslationInfo,
  ITranslationQueryResult,
  IUpdateTranslationInfo,
} from "models/translations";
import {
  IClause,
  IClauseContent,
  IClauseRevision,
  IPublishedClause,
} from "models/clauses";
import { RevisionStatus } from "models/revisions";
import { ITemplate } from "models/templates";
import { getCurrentUser } from "./authentication";
import baseQuery, { baseQueryWithRetry } from "./baseQuery";

export const clauseApi = createApi({
  reducerPath: "clauseApi",
  baseQuery,
  tagTypes: [
    "ClauseList",
    "Clause",
    "ClauseRevisions",
    "ClauseContents",
    "ClauseContentPlaceholder",
    "PublishedClause",
    "UsedInTemplates",
  ],
  endpoints: (builder) => ({
    getAll: builder.query<IAgreementObject[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const clausesResult = await fetchWithBQ("ui/parts");
        if (clausesResult.error) {
          return { error: clausesResult.error };
        }
        const clauses = clausesResult.data as IClause[] || [];
        const agreementObjects: IAgreementObject[] = clauses.map((c) => ({
          key: c.id,
          name: c.name,
          status: c.status,
          objectIdInfo: { clauseId: c.id },
        }));
        sortAgreementObjectsByNameAsc(agreementObjects);
        return { data: agreementObjects as IAgreementObject[] };
      },
      providesTags: ["ClauseList"],
    }),
    getClause: builder.query<IClause, string | undefined>({
      query: (id) => `part/${id}`,
      transformResponse: (response: IClause, meta) => {
        const clause = { ...response };
        clause.etag = meta?.response?.headers.get("etag") as string;
        return clause;
      },
      providesTags: (result) =>
        result ? [{ type: "Clause", id: result!.id }] : ["Clause"],
    }),
    getRevisions: builder.query<IClauseRevision[], string | undefined>({
      queryFn: async (clauseId, _queryApi, _extraOptions, fetchWithBQ) => {
        const revisionsWithoutEtagResult = await fetchWithBQ(
          `ui/part/${clauseId}/revisions`
        );
        const revisionsWithoutEtag =
          (revisionsWithoutEtagResult.data as IClauseRevision[]) || [];
        const revisionsWithEtagPromises = revisionsWithoutEtag.map((r) =>
          fetchWithBQ(`part/${clauseId}/revision/${r.id}`)
        );
        const revisionsWithEtagResults = await Promise.all(
          revisionsWithEtagPromises
        );
        const revisions = revisionsWithEtagResults.map((result) => {
          const revision = result.data as IClauseRevision;
          revision.etag = result.meta?.response?.headers.get("etag") as string;
          return revision;
        });

        applyRevisionOrderingAndCorrectStatuses(revisions);
        return { data: revisions as IClauseRevision[] };
      },
      providesTags: (_result, _error, arg) => [
        { type: "ClauseRevisions", id: arg },
      ],
    }),
    getContents: builder.query<
      IClauseContent[],
      { id?: string; revisionId?: string }
    >({
      query: ({ id, revisionId }) =>
        `ui/part/${id}/revision/${revisionId}/contents`,

      transformResponse: (response: IClauseContent[]) => {
        const contents = response || [];
        const tmpContent = contents.map((content) => ({
          ...content,
          languageDisplay: getDisplayNameForLanguage(content.language),
        }));

        return sortByLanguageName(tmpContent);
      },
      providesTags: (_result, _error, arg) => [
        { type: "ClauseContents", id: arg.id },
      ],
    }),
    createClause: builder.mutation<
      { partId: string; partRevisionId: string },
      ICreateClauseRequest
    >({
      queryFn: async (createClauseInfo, api, _extraOptions, baseQueryAgr) => {
        const clause = createClauseInfo.clauseProperties;
        const revision = createClauseInfo.revisionProperties;

        const createClauseRequest = {
          // clause properties
          partName: clause.name?.trim(),
          category: clause.category,
          description: "",
          // revision properties
          partRevisionName: revision.name,
          displayOption: revision.displayOption,
          effectiveDate: new Date().toISOString(),
          status: RevisionStatus.Draft.toString(),
        };
        const createClauseResponse = await baseQueryAgr({
          url: "ui/part",
          method: "POST",
          body: createClauseRequest,
        });

        if (createClauseResponse.data) {
          const createdClause = createClauseResponse.data as {
            partId: string;
            partRevisionId: string;
          };
          const verifyClauseResult = await baseQueryWithRetry(
            { url: `part/${createdClause.partId}`, method: "GET" },
            api,
            { maxRetries: 2 }
          );
          const verifyRevisionResult = await baseQueryWithRetry(
            {
              url: `part/${createdClause.partId}/revision/${createdClause.partRevisionId}`,
            },
            api,
            { maxRetries: 2 }
          );

          if (verifyClauseResult.data && verifyRevisionResult.data)
            return { data: createdClause };
        }

        return { error: createClauseResponse.error! };
      },
    }),
    createRevision: builder.mutation<
      { id: string; etag: string },
      ICreateClauseRevisionRequest
    >({
      queryFn: async (createRevisionInfo, api, _extraOptions, baseQueryAgr) => {
        const newRevisionInfo = createRevisionInfo.revisionProperties;
        const createRevisionRequest = {
          ...newRevisionInfo,
          effectiveDate: new Date().toISOString(),
          status: RevisionStatus.Draft.toString(),
        };
        const createRevisionResponse = await baseQueryAgr({
          url: `part/${createRevisionInfo.clauseId}/revision`,
          method: "POST",
          body: createRevisionRequest,
        });
        if (createRevisionResponse.data) {
          const createdRevision = createRevisionResponse.data as {
            id: string;
            etag: string;
          };
          createdRevision.etag =
            createRevisionResponse.meta?.response?.headers.get(
              "etag"
            ) as string;
          const verificationResult = await baseQueryWithRetry(
            {
              url: `part/${createRevisionInfo.clauseId}/revision/${createdRevision.id}`,
              method: "GET",
            },
            api,
            { maxRetries: 2 }
          );

          if (verificationResult.data) return { data: createdRevision };
        }

        return { error: createRevisionResponse.error! };
      },
    }),
    updateClause: builder.mutation<{ id: string }, Partial<IClause>>({
      queryFn: async (updatedClause, api, _extraOptions, baseQueryAgr) => {
        const updateClauseRequest = { ...updatedClause };
        updateClauseRequest.modifiedBy = getCurrentUser();
        const updateClauseResponse = await baseQueryAgr({
          url: `part/${updateClauseRequest.id}`,
          method: "PUT",
          body: updateClauseRequest,
          headers: { "if-match": updateClauseRequest.etag },
        });
        if (updateClauseResponse.data) {
          const updateClause = updateClauseResponse.data as { id: string };
          const expectedEtag = updateClauseResponse.meta?.response?.headers.get(
            "etag"
          ) as string;
          const verificationResult = await baseQueryWithRetry(
            {
              url: `part/${updateClauseRequest.id}`,
              method: "GET",
              validateStatus: (response) => {
                const newEtag = response.headers.get("etag")!;
                return expectedEtag === newEtag;
              },
            },
            api,
            { maxRetries: 2 }
          );

          if (verificationResult.data) return { data: updateClause };
        }

        return { error: updateClauseResponse.error! };
      },
    }),
    updateRevision: builder.mutation<
      { id: string },
      { clauseId: string; revision: Partial<IClauseRevision> }
    >({
      queryFn: async (
        { clauseId, revision },
        api,
        _extraOptions,
        baseQueryAgr
      ) => {
        const updateRevisionRequest = { ...revision };
        updateRevisionRequest.status = getRevisionStatusForUpdate(
          updateRevisionRequest.status
        );
        updateRevisionRequest.modifiedBy = getCurrentUser();
        const updateRevisionResponse = await baseQueryAgr({
          url: `ui/part/${clauseId}/revision/${revision.id}`,
          method: "PUT",
          body: updateRevisionRequest,
          headers: { "if-match": updateRevisionRequest.etag },
        });
        if (updateRevisionResponse.data) {
          const updatedRevision = updateRevisionResponse.data as { id: string };
          const expectedEtag =
            updateRevisionResponse.meta?.response?.headers.get(
              "etag"
            ) as string;
          const verificationResult = await baseQueryWithRetry(
            {
              url: `part/${clauseId}/revision/${revision.id}`,
              method: "GET",
              validateStatus: (response) => {
                const newEtag = response.headers.get("etag")!;
                return expectedEtag === newEtag;
              },
            },
            api,
            { maxRetries: 2 }
          );

          if (verificationResult.data) return { data: updatedRevision };
        }

        return { error: updateRevisionResponse.error! };
      },
    }),
    copyTranslations: builder.mutation<
      any[],
      {
        clauseId: string;
        sourceRevisionId: string;
        targetRevisionId: string;
        languageLocales: string[];
      }
    >({
      query: (copyInfo) => {
        const payload = {
          SourceRevisionId: copyInfo.sourceRevisionId,
          LanguageLocales: copyInfo.languageLocales,
        };

        return {
          url: `ui/part/${copyInfo.clauseId}/revision/${copyInfo.targetRevisionId}/contents`,
          method: "POST",
          body: payload,
        };
      },
    }),
    uploadTranslations: builder.mutation<
      ITranslationQueryResult,
      IUpdateTranslationInfo
    >({
      queryFn: async (updateInfo, _api, _extraOptions, baseQueryAgr) => {
        const promises = updateInfo.translationInfo.map(async (item) => {
          const translationBlobRequest = await fetch(item.blobUrl);
          const translationBlob = await translationBlobRequest.blob();
          const language = getTranslationLanguageFromFileName(item.fileName);
          const response = await baseQueryAgr({
            url: `part/${updateInfo.clauseId}/revision/${updateInfo.revisionId}/content/${language}`,
            method: "POST",
            body: translationBlob,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": item.fileType,
            },
          });
          return response;
        });

        const promisedData = await Promise.all(promises);
        /*
          data : {
            success : ['de-de','en-us'],
            fail : ['en-uk']
          }
        */
        const data: ITranslationQueryResult = {
          success: [],
          fail: [],
          errors: [],
        };

        promisedData.forEach((item) => {
          if (item?.meta?.response?.ok) {
            data.success.push(getLanguageFromUrl(item?.meta?.response.url));
          } else {
            data.fail.push(getLanguageFromUrl(item?.meta?.request!.url!));

            if (item?.error) {
              data.errors?.push(item?.error);
            }
          }
        });

        return { data: data as ITranslationQueryResult };
      },
    }),
    deleteTranslations: builder.mutation<
      ITranslationQueryResult,
      IDeleteTranslationInfo
    >({
      queryFn: async (deleteInfo, _api, _extraOptions, baseQueryAgr) => {
        const promises = deleteInfo.languageLocales.map(
          async (languageLocale) => {
            const response = await baseQueryAgr({
              url: `part/${deleteInfo.clauseId}/revision/${deleteInfo.revisionId}/content/${languageLocale}`,
              method: "DELETE",
            });
            return response;
          }
        );

        const promisedData = await Promise.all(promises);
        /*
          data : {
            success : ['de-de','en-us'],
            fail : ['en-uk']
          }
        */
        const data: ITranslationQueryResult = {
          success: [],
          fail: [],
          errors: [],
        };

        promisedData.forEach((item) => {
          if (item?.meta?.response?.ok) {
            data.success.push(getLanguageFromUrl(item?.meta?.response.url));
          } else {
            data.fail.push(getLanguageFromUrl(item?.meta?.request!.url!));

            if (item?.error) {
              const errorInfo = {
                languageLocale: getLanguageFromUrl(item?.meta?.request!.url!),
              };
              // eslint-disable-next-line no-param-reassign
              item.error.data = errorInfo;
              data.errors?.push(item?.error);
            }
          }
        });

        return { data: data as ITranslationQueryResult };
      },
    }),
    deleteClause: builder.mutation<void, { id: string; etag: string }>({
      query: ({ id, etag }) => ({
        url: `part/${id}`,
        method: "DELETE",
        headers: { "if-match": etag },
      }),
    }),
    deleteRevision: builder.mutation<
      {},
      { clauseId: string; revisionId: string; revisionEtag: string }
    >({
      queryFn: async (revisionToDelete, api, _extraOptions, baseQueryAgr) => {
        const deleteRevisionRequest = { ...revisionToDelete };
        const deleteRevisionResponse = await baseQueryAgr({
          url: `part/${deleteRevisionRequest.clauseId}/revision/${deleteRevisionRequest.revisionId}`,
          method: "DELETE",
          headers: { "if-match": deleteRevisionRequest.revisionEtag },
        });

        if (deleteRevisionResponse.meta?.response?.ok) {
          const verificationResult = await baseQueryWithRetry(
            {
              url: `ui/part/${deleteRevisionRequest.clauseId}/revisions`,
              method: "GET",
              validateStatus: (_response, body) => {
                const revisions = (body as IClauseRevision[]) || [];
                const deletedRevision = revisions.find(
                  (r) => r.id === deleteRevisionRequest.revisionId
                );
                return !deletedRevision;
              },
            },
            api,
            { maxRetries: 2 }
          );

          if (verificationResult.data) {
            // doing a cache patch to stop erroneous getContent calls
            api.dispatch(
              clauseApi.util.updateQueryData(
                "getRevisions",
                deleteRevisionRequest.clauseId,
                (state) => {
                  const index = state.findIndex(
                    (r) => r.id === deleteRevisionRequest.revisionId
                  );
                  state.splice(index, 1);
                }
              )
            );

            return { data: {} };
          }
        }

        return { error: deleteRevisionResponse.error! };
      },
    }),

    getContentPlaceholders: builder.query<
      IClauseContent,
      { id?: string; revisionId?: string; language?: string }
    >({
      query: ({ id, revisionId, language }) =>
        `part/${id}/revision/${revisionId}/content/${language}`,
      providesTags: (_result, _error, arg) => [
        { type: "ClauseContentPlaceholder", id: arg.id },
      ],
    }),
    getPublishedClauses: builder.query<IPublishedClause[], void>({
      query: () => `/ui/publishedparts`,
      transformResponse: (clauses: IClause[]) =>
        clauses.map((clause) => ({
          name: clause.name,
          key: clause.id,
          category: clause.category!,
        })),
      providesTags: (result) =>
        result ? [{ type: "PublishedClause" }] : ["PublishedClause"],
    }),
    getUsedInTemplate: builder.query<ITemplate[], string | undefined>({
      query: (partId) => `/ui/templates?partid=${partId}`,
      providesTags: (_result, _error, arg) => [
        { type: "UsedInTemplates", id: arg },
      ],
    }),
  }),
});
export const {
  useGetAllQuery: useGetAllClausesQuery,
  useGetClauseQuery,
  useGetRevisionsQuery,
  useGetContentsQuery,
  useGetContentPlaceholdersQuery,
  useGetUsedInTemplateQuery,
  useLazyGetUsedInTemplateQuery,

  useUpdateClauseMutation,
  useUpdateRevisionMutation,
  useCopyTranslationsMutation,
  useUploadTranslationsMutation,
  useDeleteTranslationsMutation,
  useDeleteClauseMutation,
  useDeleteRevisionMutation,

  useLazyGetClauseQuery,
  useLazyGetRevisionsQuery,
  useCreateClauseMutation,
  useCreateRevisionMutation,
  useGetPublishedClausesQuery,
  useLazyGetPublishedClausesQuery,
  useLazyGetContentsQuery,
} = clauseApi;

export const invalidateClauseCache = (clauseId: string) =>
  clauseApi.util.invalidateTags([
    { type: "ClauseList" },
    { type: "Clause", id: clauseId },
    { type: "ClauseRevisions", id: clauseId },
    { type: "ClauseContents", id: clauseId },
    { type: "ClauseContentPlaceholder", id: clauseId },
    { type: "PublishedClause" },
    { type: "UsedInTemplates", id: clauseId },
  ]);
