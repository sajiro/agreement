import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";
import {  
  ITagsData, 
  ICreateTagsRequest, 
} from "../models/tags";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery,
  tagTypes: [
    "TemplateTags",
  ],
  endpoints: (builder) => ({    
    /*
      the endpoints below are for template tags (not in use currently)
    */
    getTags: builder.query<ITagsData[] | undefined, { id?: string }>({
      query: ({ id }) => `/labels?_=${id}`,
      transformResponse: (response: ITagsData[]) => response || [],
    }),

    getSavedTags: builder.query<
      ITagsData[] | undefined,
      { templateId?: string }
    >({
      query: ({ templateId }) => `/template/${templateId}/labels`,
      transformResponse: (response: ITagsData[]) => response || [],
      providesTags: (_result, _error, arg) => [
        { type: "TemplateTags", id: arg.templateId },
      ],
    }),
    
    saveTags: builder.mutation<{ id: string }, ICreateTagsRequest>({
      queryFn: async (
        tagsInfoRequestBody,
        _api,
        _extraOptions,
        baseQueryAgr
      ) => {
        const saveTagsResponse = await baseQueryAgr({
          url: `/template/${tagsInfoRequestBody.templateId}/label`,
          method: "POST",
          body: { id: tagsInfoRequestBody.id, name: tagsInfoRequestBody.name },
        });
        if (saveTagsResponse.data) {
          const addedTag = saveTagsResponse.data as { id: string };
          return { data: addedTag };
        }
        return { error: saveTagsResponse.error! };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "TemplateTags", id: arg.templateId }
      ],
    }),
    
    deleteTags: builder.mutation<{ id: string }, ICreateTagsRequest>({
      queryFn: async (
        tagsInfoRequestBody,
        _api,
        _extraOptions,
        baseQueryAgr
      ) => {
        const deleteTagsResponse = await baseQueryAgr({
          url: `/template/${tagsInfoRequestBody.templateId}/label/${tagsInfoRequestBody.labelId}`,
          method: "DELETE",
        });
        if (deleteTagsResponse.data) {
          const deleteTag = deleteTagsResponse.data as { id: string };
          return { data: deleteTag };
        }

        return { error: deleteTagsResponse.error! };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "TemplateTags", id: arg.templateId }
      ],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetSavedTagsQuery,
  useSaveTagsMutation,
  useDeleteTagsMutation,
} = tagsApi;

export const invalidateTagCache = ( 
  templateId: string,
) =>
  tagsApi.util.invalidateTags([
    { type: "TemplateTags", id: templateId },
  ]);
