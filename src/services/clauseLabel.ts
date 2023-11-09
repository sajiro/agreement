import { createApi } from "@reduxjs/toolkit/query/react";
import { 
  ILabelData, 
  IUpdateClauseLabelsRequest, 
  IUpdateClauseLabelsResult,
} from "models/clauseLabels";
import baseQuery from "./baseQuery";

/*
  Clause Labels are used only by "Professional Services" busines unit
*/
export const clauseLabelApi = createApi({
  reducerPath: "clauseLabelApi",
  baseQuery,
  tagTypes: [
    "LabelList",
    "TaggedLabels",
    "ClauseLabels",
  ],
  endpoints: (builder) => ({
    
    getAllLabels: builder.query<ILabelData[], void>({
      query: () => "/labels",
      transformResponse: (response: ILabelData[]) => response || [],
      providesTags: ["LabelList"],
    }),

    getTaggedLabels: builder.query<ILabelData[], string | undefined>({
      query: (labelId) => `/ui/label/${labelId}/taggedlabels`,
      transformResponse: (response: ILabelData[]) => response || [],
      providesTags: (_result, _error, arg) => [
        { type: "TaggedLabels", id: arg },
      ],
    }),

    getClauseLabels: builder.query<ILabelData[], string | undefined>({
      query: (clauseId) => `/part/${clauseId}/labels`,
      transformResponse: (response: ILabelData[]) => response || [],
      providesTags: (_result, _error, arg) => [
        { type: "ClauseLabels", id: arg },
      ],
    }),

    updateClauseLabels: builder.mutation<IUpdateClauseLabelsResult, IUpdateClauseLabelsRequest>({
      queryFn: async (
        labelInfo,
        _api,
        _extraOptions,
        baseQueryAgr
      ) => {
        const updateResult: IUpdateClauseLabelsResult = {
          success: 0,
          fail: 0,
        };

        if (labelInfo.deletedLabels && labelInfo.deletedLabels.length > 0) {
          const deletionPromises = labelInfo.deletedLabels.map(async (label) => {

            const deleteLabelResponse = await baseQueryAgr({
              url: `/part/${labelInfo.clauseId}/label/${label.id}`,
              method: "DELETE",
            });

            return deleteLabelResponse;
          });
          const deletionPromisedData = await Promise.all(deletionPromises);

          deletionPromisedData.forEach((item) => {
            if (item?.meta?.response?.ok) {
              updateResult.success += 1;
            } 
            else {
              updateResult.fail += 1;
            }
          });
        }

        if (labelInfo.addedLabels && labelInfo.addedLabels.length > 0) {
          const additionPromises = labelInfo.addedLabels.map(async (label) => {

            const addLabelResponse = await baseQueryAgr({
              url: `/part/${labelInfo.clauseId}/label`,
              method: "POST",
              body: { 
                id: label.id,
                name: label.name,
              },
            });

            return addLabelResponse;
          });
          const additionPromisedData = await Promise.all(additionPromises);

          additionPromisedData.forEach((item) => {
            if (item?.meta?.response?.ok) {
              updateResult.success += 1;
            } 
            else {
              updateResult.fail += 1;
            }
          });
        }
        
        return { data: updateResult };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "ClauseLabels", id: arg.clauseId }
      ],
    }),
  }),
});

export const {
  useGetAllLabelsQuery,
  useGetTaggedLabelsQuery,
  useGetClauseLabelsQuery,

  useUpdateClauseLabelsMutation,
} = clauseLabelApi;

export const invalidateClauseLabelCache = (
  labelId: string,
  clauseId: string,
) =>
  clauseLabelApi.util.invalidateTags([
    { type: "LabelList" },
    { type: "TaggedLabels", id: labelId },
    { type: "ClauseLabels", id: clauseId },
  ]);
