import { createApi } from "@reduxjs/toolkit/query/react";
import { json2QueryString } from "helpers/utils";
import { IPreviewDocumentURLRequest } from "models/clauseMutation";
import { IPreviewTemplatePreviewRequest } from "models/templateMutation";
import baseQuery from "./baseQuery";

type PrevType = {
  href: string;
  id: string;
};

export const previewApi = createApi({
  reducerPath: "previewApi",
  baseQuery,
  tagTypes: ["preview"],
  endpoints: (builder) => ({
    getTemplatePreview: builder.mutation<
      PrevType,
      IPreviewTemplatePreviewRequest
    >({
      queryFn: async (previewInfo, _api, _extraOptions, baseQueryAgr) => {
        const { templateId, revisionId, config } = previewInfo;
        const { context, ...configQueryString } = config;
        const previewResponse = await baseQueryAgr({
          url: `template/${templateId}/revision/${revisionId}/previewdocument?${json2QueryString(
            configQueryString
          )}`,
          method: "POST",
          body: {
            AssemblyOptions: {
              orientation: "portrait",
              IncludeTestRevision: config.IncludeTestRevision,
            },
            ConstraintsContext: context,
          },

          headers: {
            "content-language": config.languagelocale,
            "Accept-Language": config.languagelocale,
          },
        });

        if (previewResponse.data) {
          const preview = previewResponse.data as PrevType;
          return { data: preview };
        }
        return { error: previewResponse.error! };
      },
    }),
    getClausePreview: builder.mutation<PrevType, IPreviewDocumentURLRequest>({
      queryFn: async (previewInfo, _api, _extraOptions, baseQueryAgr) => {
        const { clauseId, revisionId, language, content } = previewInfo;
        const previewResponse = await baseQueryAgr({
          url: `/part/${clauseId}/revision/${revisionId}/previewdocument?languagelocale=${language}`,
          method: "POST",
          body: {
            Contents: { ...content },
            AssemblyOptions: { IgnoreRequiredContentPlaceholder: true },
          },

          headers: {
            "content-language": language,
            "Accept-Language": language,
          },
        });
        if (previewResponse.data) {
          const preview = previewResponse.data as PrevType;
          return { data: preview };
        }
        return { error: previewResponse.error! };
      },
    }),
  }),
});

export const { useGetTemplatePreviewMutation, useGetClausePreviewMutation } =
  previewApi;
