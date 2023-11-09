/* eslint-disable no-param-reassign */
import { createApi } from "@reduxjs/toolkit/query/react";

import { sortAgreementObjectsByNameAsc } from "helpers/agreements";
import {
  applyRevisionOrderingAndCorrectStatuses,
  getRevisionStatusForUpdate,
} from "helpers/revisions";
import { IAgreementObject } from "models/agreements";
import { RevisionStatus } from "models/revisions";
import {
  ICreateTemplateRequest,
  ICreateTemplateRevisionRequest,
} from "models/templateMutation";
import { ITemplate, ITemplateRevision } from "models/templates";
import { getCurrentUser } from "./authentication";
import baseQuery, { baseQueryWithRetry } from "./baseQuery";

export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery,
  tagTypes: ["TemplateList", "Template", "TemplateRevisions"],
  endpoints: (builder) => ({
    getAll: builder.query<IAgreementObject[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const templateResult = await fetchWithBQ("ui/templates");
        if (templateResult.error) {
          return { error: templateResult.error }
        }

        const templates = templateResult.data as ITemplate[] || [];
        const agreementObjects: IAgreementObject[] = templates.map((t) => ({
          key: t.id,
          name: t.name,
          description: t.description,
          status: t.status,
          objectIdInfo: { templateId: t.id },
        }));
        sortAgreementObjectsByNameAsc(agreementObjects);

        return {
          data: agreementObjects as IAgreementObject[],
        };
      },
      providesTags: ["TemplateList"],
    }),
    getTemplate: builder.query<ITemplate, string | undefined>({
      query: (id) => `template/${id}`,
      transformResponse: (response: ITemplate, meta) => {
        const template = { ...response };
        template.etag = meta?.response?.headers.get("etag") as string;
        return template;
      },
      providesTags: (result) =>
        result ? [{ type: "Template", id: result!.id }] : ["Template"],
    }),
    getRevisions: builder.query<ITemplateRevision[], string | undefined>({
      queryFn: async (templateId, _queryApi, _extraOptions, fetchWithBQ) => {
        const revisionsWithoutEtagResult = await fetchWithBQ(
          `ui/template/${templateId}/revisions`
        );
        const revisionsWithoutEtag =
          (revisionsWithoutEtagResult.data as ITemplateRevision[]) || [];
        const revisionsWithEtagPromises = revisionsWithoutEtag.map((r) =>
          fetchWithBQ(`template/${templateId}/revision/${r.id}`)
        );
        const revisionsWithEtagResults = await Promise.all(
          revisionsWithEtagPromises
        );
        const revisions = revisionsWithEtagResults.map((result) => {
          const revision = result.data as ITemplateRevision;
          revision.etag = result.meta?.response?.headers.get("etag") as string;
          return revision;
        });

        applyRevisionOrderingAndCorrectStatuses(revisions);
        return { data: revisions as ITemplateRevision[] };
      },
      providesTags: (_result, _error, arg) => [
        { type: "TemplateRevisions", id: arg },
      ],
    }),
    createTemplate: builder.mutation<
      { templateId: string; revisionId: string },
      ICreateTemplateRequest
    >({
      queryFn: async (createTemplateInfo, api, _extraOptions, baseQueryAgr) => {
        const template = createTemplateInfo.templateProperties;
        const revision = createTemplateInfo.revisionProperties;

        const createTemplateRequest = {
          templateName: template.name,
          description: template.description,
          templateRevisionName: revision.name,
          effectiveDate: new Date().toISOString(),
          status: RevisionStatus.Draft.toString(),
        };

        const createTemplateResponse = await baseQueryAgr({
          url: "ui/template",
          method: "POST",
          body: createTemplateRequest,
        });
        const data = createTemplateResponse.data as any;

        if (data) {
          const createdTemplate = {
            templateId: data.templateId,
            revisionId: data.templateRevisionId,
          };
          const verifyTemplateResult = await baseQueryWithRetry(
            { url: `template/${createdTemplate.templateId}`, method: "GET" },
            api,
            { maxRetries: 2 }
          );
          const verifyRevisionResult = await baseQueryWithRetry(
            {
              url: `template/${createdTemplate.templateId}/revision/${createdTemplate.revisionId}`,
              method: "GET",
            },
            api,
            { maxRetries: 2 }
          );

          if (verifyTemplateResult.data && verifyRevisionResult.data)
            return { data: createdTemplate };
        }

        return { error: createTemplateResponse.error! };
      },
    }),
    createRevision: builder.mutation<
      { id: string; etag: string },
      ICreateTemplateRevisionRequest
    >({
      queryFn: async (createRevisionInfo, api, _extraOptions, baseQueryAgr) => {
        const newRevisionInfo = createRevisionInfo.revisionProperties;
        const createRevisionRequest = {
          ...newRevisionInfo,
          effectiveDate: new Date().toISOString(),
          status: RevisionStatus.Draft.toString(),
        };
        const createRevisionResponse = await baseQueryAgr({
          url: `template/${createRevisionInfo.templateId}/revision`,
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
              url: `template/${createRevisionInfo.templateId}/revision/${createdRevision.id}`,
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
    updateRevision: builder.mutation<
      { id: string },
      { templateId: string; revision: Partial<ITemplateRevision> }
    >({
      queryFn: async (
        { templateId, revision },
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
          url: `ui/template/${templateId}/revision/${revision.id}`,
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
              url: `template/${templateId}/revision/${revision.id}`,
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
      invalidatesTags: (result, _error, arg) =>
        result
          ? [
              { type: "TemplateRevisions", id: arg.templateId },
              { type: "Template", id: arg.templateId },
            ]
          : [{ type: "TemplateList" }],
    }),
    updateTemplateProperties: builder.mutation<{ id: string }, ITemplate>({
      queryFn: async (templateInfo, api, _extraOptions, baseQueryAgr) => {
        const updateTemplatePropertiesResponse = await baseQueryAgr({
          url: `template/${templateInfo?.id}`,
          method: "PUT",
          body: templateInfo,
          headers: { "if-match": templateInfo.etag },
        });

        if (updateTemplatePropertiesResponse.data) {
          const updateTemplateProperties =
            updateTemplatePropertiesResponse.data as { id: string };
          const expectedEtag =
            updateTemplatePropertiesResponse.meta?.response?.headers.get(
              "etag"
            ) as string;
          const verificationResult = await baseQueryWithRetry(
            {
              url: `template/${templateInfo.id}`,
              method: "GET",
              validateStatus: (response) => {
                const newEtag = response.headers.get("etag")!;
                return expectedEtag === newEtag;
              },
            },
            api,
            { maxRetries: 2 }
          );

          if (verificationResult.data)
            return { data: updateTemplateProperties };
        }

        return { error: updateTemplatePropertiesResponse.error! };
      },
      invalidatesTags: (result, _error, arg) =>
        result
          ? [{ type: "Template", id: arg.id }]
          : [{ type: "TemplateList" }],
    }),
    copySlots: builder.mutation<
      void,
      {
        templateId: string;
        sourceRevisionId: string;
        targetRevisionId: string;
      }
    >({
      query: (copyInfo) => {
        const payload = {
          SourceRevisionId: copyInfo.sourceRevisionId,
        };
        return {
          url: `ui/template/${copyInfo.templateId}/revision/${copyInfo.targetRevisionId}`,
          method: "POST",
          body: payload,
        };
      },
    }),
    deleteTemplate: builder.mutation<unknown, { id: string; etag: string }>({
      queryFn: async ({ id, etag }, api, _extraOptions, baseQueryAgr) => {
        const deleteTemplateResponse = await baseQueryAgr({
          url: `template/${id}`,
          method: "DELETE",
          headers: { "if-match": etag },
        });

        if (deleteTemplateResponse?.meta?.response?.ok) {
          const verificationResult = await baseQueryWithRetry(
            {
              url: "ui/templates",
              method: "GET",
              validateStatus: (_response, body) => {
                const templates = (body as ITemplate[]) || [];
                const deletedTemplate = templates.find((r) => r.id === id);
                return !deletedTemplate;
              },
            },
            api,
            { maxRetries: 2 }
          );

          return verificationResult.data
            ? { data: deleteTemplateResponse.data! }
            : {
                error: {
                  status: "CUSTOM_ERROR",

                  error: "Unable to validate Template was deleted",

                  data: {},
                },
              };
        }

        return { error: deleteTemplateResponse.error! };
      },
    }),
    deleteRevision: builder.mutation<
      {},
      { templateId: string; revisionId: string; revisionEtag: string }
    >({
      queryFn: async (revisionToDelete, api, _extraOptions, baseQueryAgr) => {
        const deleteRevisionRequest = { ...revisionToDelete };
        const deleteRevisionResponse = await baseQueryAgr({
          url: `template/${deleteRevisionRequest.templateId}/revision/${deleteRevisionRequest.revisionId}`,
          method: "DELETE",
          headers: { "if-match": deleteRevisionRequest.revisionEtag },
        });

        if (deleteRevisionResponse.meta?.response?.ok) {
          const verificationResult = await baseQueryWithRetry(
            {
              url: `ui/template/${deleteRevisionRequest.templateId}/revisions`,
              method: "GET",
              validateStatus: (_response, body) => {
                const revisions = (body as ITemplateRevision[]) || [];
                const deletedRevision = revisions.find(
                  (r) => r.id === deleteRevisionRequest.revisionId
                );
                return !deletedRevision;
              },
            },
            api,
            { maxRetries: 2 }
          );

          if (verificationResult.data) return { data: {} };
        }

        return { error: deleteRevisionResponse.error! };
      },
    }),
  }),
});

export const {
  useGetAllQuery: useGetAllTemplatesQuery,
  useGetTemplateQuery,
  useGetRevisionsQuery,
  useCreateTemplateMutation,
  useCreateRevisionMutation,
  useUpdateRevisionMutation,
  useUpdateTemplatePropertiesMutation,
  useCopySlotsMutation,
  useDeleteTemplateMutation,
  useDeleteRevisionMutation,

  useLazyGetTemplateQuery,
  useLazyGetRevisionsQuery,
} = templateApi;

export const invalidateTemplateCache = (templateId: string) =>
  templateApi.util.invalidateTags([
    { type: "TemplateList" },
    { type: "Template", id: templateId },
    { type: "TemplateRevisions", id: templateId },
  ]);
