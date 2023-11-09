import { createApi } from "@reduxjs/toolkit/query/react";

import { sortAgreementObjectsByNameAsc } from "helpers/agreements";
import {
  applyRevisionOrderingAndCorrectStatuses,
  getRevisionStatusForUpdate,
} from "helpers/revisions";
import {
  getLanguageFromUrl,
  getTranslationLanguageFromFileName,
  sortByLanguageName,
} from "helpers/translations";
import { IAgreementObject } from "models/agreements";
import {
  ICreateCustomClauseRequest,
  ICreateCustomClauseRevisionRequest,
} from "models/customClauseMutation";
import {
  ICustomClause,
  ICustomClauseContent,
  ICustomClauseRevision,
} from "models/customClauses";
import { RevisionStatus } from "models/revisions";
import { ITemplate } from "models/templates";
import {
  ITranslationQueryResult,
  IUpdateTranslationInfo,
} from "models/translations";

import { getCurrentUser } from "./authentication";
import baseQuery, { baseQueryWithRetry } from "./baseQuery";

export const customClauseApi = createApi({
  reducerPath: "customClauseApi",
  baseQuery,
  tagTypes: [
    "CustomClauseList",
    "CustomClause",
    "CustomClauseRevisions",
    "CustomClauseContents",
  ],
  endpoints: (builder) => ({
    getAll: builder.query<IAgreementObject[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const customClauseResult = await fetchWithBQ("ui/customparts");
        if (customClauseResult.error) {
          return { error: customClauseResult.error }
        }

        const customClauses = customClauseResult.data as ICustomClause[] || [];
        const agreementObjects: IAgreementObject[] = customClauses.map((c) => ({
          key: c.id,
          name: c.name,
          templateName: c.templateName,
          templateId: c.templateId,
          objectIdInfo: { clauseId: c.id, templateId: c.templateId },
        }));
        sortAgreementObjectsByNameAsc(agreementObjects);

        return {
          data: agreementObjects as IAgreementObject[],
        };
      },
      providesTags: ["CustomClauseList"]
    }),
    getCustomClause: builder.query<
      ICustomClause,
      { templateId?: string; id?: string }
    >({
      queryFn: async (
        { templateId, id },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) => {
        const customClauseResult = await fetchWithBQ(
          `template/${templateId}/customparts/${id}`
        );

        const customClause = customClauseResult.data as ICustomClause;
        customClause.etag = customClauseResult.meta?.response?.headers.get(
          "etag"
        ) as string;
        customClause.templateId = templateId || "";

        const templateResult = await fetchWithBQ(`template/${templateId}`);
        const template = templateResult.data as ITemplate;
        customClause.templateName = template?.name || templateId || "";

        return {
          data: customClause,
        };
      },
      providesTags: (result) =>
        result ? [{ type: "CustomClause", id: result!.id }] : ["CustomClause"],
    }),
    getRevisions: builder.query<
      ICustomClauseRevision[],
      { templateId?: string; clauseId?: string }
    >({
      queryFn: async (
        { templateId, clauseId },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) => {
        const revisionsWithoutEtagResult = await fetchWithBQ(
          `template/${templateId}/customparts/${clauseId}/revisions`
        );
        const revisionsWithoutEtag =
          (revisionsWithoutEtagResult.data as ICustomClauseRevision[]) || [];

        const revisionsWithEtagPromises = revisionsWithoutEtag.map((r) =>
          fetchWithBQ(
            `template/${templateId}/customparts/${clauseId}/revisions/${r.id}`
          )
        );
        const revisionsWithEtagResults = await Promise.all(
          revisionsWithEtagPromises
        );

        const revisions = revisionsWithEtagResults.map((result) => {
          const revision = result.data as ICustomClauseRevision;
          revision.etag = result.meta?.response?.headers.get("etag") as string;

          return revision;
        });
        applyRevisionOrderingAndCorrectStatuses(revisions);

        return {
          data: revisions,
        };
      },
      providesTags: (_result, _error, arg) => [
        { type: "CustomClauseRevisions", id: arg.clauseId },
      ],
    }),
    getContents: builder.query<
      ICustomClauseContent[],
      { templateId?: string; clauseId?: string; revisionId?: string }
    >({
      query: ({ templateId, clauseId, revisionId }) =>
        `template/${templateId}/customparts/${clauseId}/revisions/${revisionId}/contents`,
      transformResponse: (response: ICustomClauseContent[]) => {
        const contents = response || [];
        return sortByLanguageName(contents);
      },
      providesTags: (_result, _error, arg) => [
        { type: "CustomClauseContents", id: arg.clauseId },
      ],
    }),
    createCustomClause: builder.mutation<
      { templateId: string; id: string },
      ICreateCustomClauseRequest
    >({
      queryFn: async (createClauseInfo, api, _extraOptions, baseQueryAgr) => {
        const createClauseRequest = {
          ...createClauseInfo.clauseProperties,
        };
        const { templateId } = createClauseInfo.clauseProperties;

        const createClauseResponse = await baseQueryAgr({
          url: `template/${templateId}/customparts`,
          method: "POST",
          body: createClauseRequest,
        });

        if (createClauseResponse.data) {
          const createdClause: any = { templateId, id: (<any>createClauseResponse.data).id };
          const verificationResult = await baseQueryWithRetry({
            url: `template/${createdClause.templateId}/customparts/${createdClause.id}`,
            method: "GET"
          }, api, { maxRetries: 2 });

          if (verificationResult.data) return { data: createdClause };
        }

        return { error: createClauseResponse.error! };
      },
    }),
    createRevision: builder.mutation<
      { id: string; etag: string },
      ICreateCustomClauseRevisionRequest
    >({
      queryFn: async (
        createRevisionInfo,
        api,
        _extraOptions,
        baseQueryAgr
      ) => {
        const {
          templateId,
          clauseId,
          revisionProperties: newRevisionInfo,
        } = createRevisionInfo;

        const createRevisionRequest = {
          ...newRevisionInfo,
          effectiveDate: new Date().toISOString(),
          status: RevisionStatus.Draft.toString(),
        };
        const createRevisionResponse = await baseQueryAgr({
          url: `template/${templateId}/customparts/${clauseId}/revisions`,
          method: "POST",
          body: createRevisionRequest,
        });

        if (createRevisionResponse.data) {
          const createdRevision = createRevisionResponse.data as {id: string; etag: string; };
          createdRevision.etag = createRevisionResponse.meta?.response?.headers.get("etag") as string;
          const verificationResult = await baseQueryWithRetry({
            url: `template/${templateId}/customparts/${clauseId}/revisions/${createdRevision.id}`,
            method: "GET"
          }, api, { maxRetries: 2 });

          if (verificationResult.data) return { data: createdRevision };
        }

        return { error: createRevisionResponse.error! };
      },
    }),
    updateCustomClause: builder.mutation<void, Partial<ICustomClause>>({
      query: (updatedClause) => {
        const { templateId, id: clauseId } = updatedClause;

        const updateClauseRequest = { ...updatedClause };
        updateClauseRequest.modifiedBy = getCurrentUser();

        return {
          url: `template/${templateId}/customparts/${clauseId}`,
          method: "PUT",
          body: updateClauseRequest,
          headers: { "if-match": updateClauseRequest.etag },
        };
      },
    }),
    updateRevision: builder.mutation<
      void,
      {
        templateId: string;
        clauseId: string;
        revision: Partial<ICustomClauseRevision>;
      }
    >({
      query: ({ templateId, clauseId, revision }) => {
        const updateRevisionRequest = { ...revision };
        updateRevisionRequest.status = getRevisionStatusForUpdate(
          updateRevisionRequest.status
        );
        updateRevisionRequest.modifiedBy = getCurrentUser();

        return {
          url: `template/${templateId}/customparts/${clauseId}/revisions/${revision.id}`,
          method: "PUT",
          body: updateRevisionRequest,
          headers: { "if-match": updateRevisionRequest.etag },
        };
      },
    }),
    uploadTranslations: builder.mutation<
      { success: string[]; fail: string[] },
      IUpdateTranslationInfo
    >({
      queryFn: async (updateInfo, _api, _extraOptions, baseQueryAgr) => {
        const promises = updateInfo.translationInfo.map(async (item) => {
          const translationBlobRequest = await fetch(item.blobUrl);
          const translationBlob = await translationBlobRequest.blob();
          const language = getTranslationLanguageFromFileName(item.fileName);
          const { templateId, clauseId, revisionId } = updateInfo;

          const response = await baseQueryAgr({
            url: `template/${templateId}/customparts/${clauseId}/revisions/${revisionId}/contents/${language}`,
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

        // check each promise ok
        /*
          data : {
            success : ['de-de','en-us'],
            fail : ['en-uk']
          }
        */
        const data: ITranslationQueryResult = {
          success: [],
          fail: [],
        };

        promisedData.forEach((item) => {
          if (item?.meta?.response?.ok) {
            data.success.push(getLanguageFromUrl(item?.meta?.response.url));
          } else {
            data.fail.push(getLanguageFromUrl(item?.meta?.request!.url!));
          }
        });

        return { data: data as ITranslationQueryResult };
      },
    }),
  }),
});

export const {
  useGetAllQuery: useGetAllCustomClausesQuery,
  useGetCustomClauseQuery,
  useGetRevisionsQuery,
  useGetContentsQuery,

  useLazyGetCustomClauseQuery,
  useLazyGetRevisionsQuery,

  useCreateCustomClauseMutation,
  useCreateRevisionMutation,
  useUpdateCustomClauseMutation,
  useUpdateRevisionMutation,
  useUploadTranslationsMutation,
} = customClauseApi;

export const invalidateCustomClauseCache = (clauseId: string) =>
  customClauseApi.util.invalidateTags([
    { type: "CustomClauseList" },
    { type: "CustomClause", id: clauseId },
    { type: "CustomClauseRevisions", id: clauseId },
    { type: "CustomClauseContents", id: clauseId },
  ]);
