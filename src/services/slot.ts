/* eslint-disable no-param-reassign */

import { AnyAction } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ROOT_NODE_ID } from "consts/globals";
import { deleteSlotTree, isSlotGroup, setSlotLevels } from "helpers/slot";
import _ from "lodash";
import {
  ISlotIdentification,
  ISlotsCreationInfo,
  ITemplateRevisionSlot,
  ISlotsUpdateInfo,
  ISlotsDeletionInfo,
  ISlotTree,
  ITemplateRevisionSlotItem,
  ISlotUpdateInfo,
} from "models/slot";
import { ThunkAction } from "redux-thunk";
import { RootState } from "store";
import baseQuery, { baseQueryWithRetry } from "./baseQuery";

export const slotApi = createApi({
  reducerPath: "slotApi",
  baseQuery,
  tagTypes: ["slotTree", "slotTranslations"],
  endpoints: (builder) => ({
    getSlotTranslations: builder.query<
      ITemplateRevisionSlotItem[],
      { templateId: string; revisionId: string; query?: string }
    >({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const { templateId, revisionId, query = "" } = _arg;

        const result = await fetchWithBQ(
          `template/${templateId}/revision/${revisionId}/slots${
            query ? `?${query} ` : ""
          }`
        );

        const tmpSlots = (result.data || []) as ITemplateRevisionSlotItem[];
        setSlotLevels(tmpSlots);
        return result as any;
      },
      providesTags: ["slotTranslations"],
    }),
    getSlotTree: builder.query<
      ISlotTree,
      { templateId: string; revisionId: string }
    >({
      queryFn: async (
        args,
        { getState, endpoint },
        _extraOptions,
        fetchWithBQ
      ) => {
        const cacheKey = `${endpoint}(${JSON.stringify(
          args,
          Object.keys(args).sort()
        )})`;
        const cachedSlotTree = (getState() as any).slotApi.queries[cacheKey]
          .data as ISlotTree;
        const clonedSlotTree = _.cloneDeep(cachedSlotTree) || {
          isLoading: false,
          childNodeMappings: {},
          nodes: {},
        };

        const getSlot = async ({
          templateId,
          revisionId,
          slotId,
        }: ISlotIdentification) => {
          let slot = clonedSlotTree.nodes[slotId];
          if (!slot) {
            const { data, meta } = await fetchWithBQ(
              `template/${templateId}/revision/${revisionId}/slots/${slotId}`
            );
            slot = data! as ITemplateRevisionSlot;
            slot.etag = meta?.response?.headers.get("etag") as string;
            slot.parentSlotId = slot.parentSlotId || ROOT_NODE_ID; // Root Level slots returned from API don't have parent slot ID set
            clonedSlotTree.nodes[slot.id] = slot;
          }

          return slot;
        };

        const extractChildSlots = (
          data: any,
          slotId?: string
        ): ITemplateRevisionSlot[] => {
          if (slotId) {
            const childSlotsInfo = (data || { slots: [] }) as {
              slots: ITemplateRevisionSlot[];
            };
            return childSlotsInfo.slots;
          }

          const slots = (data || []) as ITemplateRevisionSlot[];
          return slots;
        };

        const getChildSlots = async ({
          templateId,
          revisionId,
          slotId,
        }: ISlotIdentification) => {
          const slotCacheKey = slotId || ROOT_NODE_ID;
          let childSlotIds = clonedSlotTree.childNodeMappings[slotCacheKey];
          if (!childSlotIds) {
            const { data } = await fetchWithBQ(
              `template/${templateId}/revision/${revisionId}/slots/${slotId}`
            );
            const slots = extractChildSlots(data, slotId);
            childSlotIds = slots.map((s) => s.id);
            if (slots.length > 0) {
              clonedSlotTree.childNodeMappings[slotCacheKey] = childSlotIds;
            }
          }

          const slotPromises = childSlotIds.map((id) =>
            getSlot({ templateId, revisionId, slotId: id })
          );
          const slots = await Promise.all(slotPromises);
          return slots;
        };

        const buildSlotTree = async (
          slotIdentification: ISlotIdentification,
          rootSlot: ITemplateRevisionSlot | undefined
        ) => {
          if (!rootSlot || isSlotGroup(rootSlot)) {
            const childSlots = await getChildSlots(slotIdentification);
            const buildSubTreePromises = childSlots.map((slot) => {
              const { templateId, revisionId } = slotIdentification;
              return buildSlotTree(
                { templateId, revisionId, slotId: slot.id },
                slot
              );
            });

            await Promise.all(buildSubTreePromises);
          }
        };

        await buildSlotTree({ ...args, slotId: "" }, undefined);
        clonedSlotTree.isLoading = false;
        return { data: clonedSlotTree };
      },
      providesTags: [{ type: "slotTree" }],
    }),
    updateSlots: builder.mutation<{}, ISlotsUpdateInfo>({
      queryFn: async (args, api, _extraOptions, baseQueryAgr) => {
        const { templateId, revisionId, updateInfos, parentSlotId } = args;

        const sendUpdateRequest = async ({
          slotId,
          etag,
          updateOperations,
        }: ISlotUpdateInfo) => {
          const url = `template/${templateId}/revision/${revisionId}/slots/${slotId}`;
          const updateRequest = await baseQueryAgr({
            url,
            method: "PATCH",
            headers: { "if-match": etag },
            body: updateOperations,
          });
          if (updateRequest.data) {
            const expectedEtag = updateRequest?.meta?.response?.headers.get(
              "etag"
            ) as string;
            const verificationResult = await baseQueryWithRetry(
              {
                url,
                method: "GET",
                validateStatus: (response) => {
                  const newEtag = response.headers.get("etag")!;
                  return expectedEtag === newEtag;
                },
              },
              api,
              { maxRetries: 2 }
            );

            return verificationResult;
          }

          return updateRequest;
        };

        const updateRequestPromises = updateInfos.map((updateInfo) =>
          sendUpdateRequest(updateInfo)
        );
        const updateRequests = await Promise.all(updateRequestPromises);
        if (!updateRequests.every((r) => r.data)) {
          return { error: updateRequests.find((r) => r.error)!.error! };
        }

        api.dispatch(
          slotApi.util.updateQueryData(
            "getSlotTree",
            { templateId, revisionId },
            (state) => {
              state.isLoading = true;
              delete state.childNodeMappings[parentSlotId];
              updateInfos.forEach((updateInfo) => {
                delete state.childNodeMappings[updateInfo.parentSlotId];
                delete state.nodes[updateInfo.slotId];
              });
            }
          )
        );

        return { data: {} };
      },
      extraOptions: { maxRetries: 3 },
    }),
    createSlots: builder.mutation<{ id: string }[], ISlotsCreationInfo>({
      queryFn: async (
        creationInfo,
        { dispatch },
        _extraOptions,
        baseQueryAgr
      ) => {
        const { templateId, revisionId, parentSlotId } = creationInfo;
        const slotCreationRequestPromises = creationInfo.slots.map((slotInfo) =>
          baseQueryAgr({
            url: `template/${templateId}/revision/${revisionId}/slots`,
            method: "POST",
            body: slotInfo,
          })
        );

        const slotCreationRequests = await Promise.all(
          slotCreationRequestPromises
        );
        if (!slotCreationRequests.every((r) => r.data)) {
          return { error: slotCreationRequests.find((r) => r.error)!.error! };
        }

        dispatch(
          slotApi.util.updateQueryData(
            "getSlotTree",
            { templateId, revisionId },
            (state) => {
              state.isLoading = true;
              delete state.childNodeMappings[parentSlotId];
            }
          )
        );

        const slotIds = slotCreationRequests.map(
          (r) => r.data! as { id: string }
        );
        return { data: slotIds };
      },
    }),
    deleteSlots: builder.mutation<{}, ISlotsDeletionInfo>({
      queryFn: async (
        deletionInfo,
        { dispatch },
        _extraOptions,
        baseQueryAgr
      ) => {
        const { templateId, revisionId, slotInfos } = deletionInfo;
        const deletionRequestPromises = slotInfos.map((slotInfo) =>
          baseQueryAgr({
            url: `template/${templateId}/revision/${revisionId}/slots/${slotInfo.slotId}`,
            method: "DELETE",
          })
        );

        const deletionResponses = await Promise.all(deletionRequestPromises);
        if (!deletionResponses.every((r) => r.data)) {
          return { error: deletionResponses.find((r) => r.error)!.error! };
        }

        dispatch(
          slotApi.util.updateQueryData(
            "getSlotTree",
            { templateId, revisionId },
            (state) => {
              state.isLoading = true;
              slotInfos.forEach((slotInfo) => {
                delete state.childNodeMappings[slotInfo.parentSlotId];
                deleteSlotTree(state, slotInfo.slotId);
              });
            }
          )
        );

        return { data: {} };
      },
    }),
  }),
});

export const {
  useGetSlotTranslationsQuery,
  useLazyGetSlotTranslationsQuery,
  useGetSlotTreeQuery,
  useLazyGetSlotTreeQuery,
  useUpdateSlotsMutation,
  useCreateSlotsMutation,
  useDeleteSlotsMutation,
} = slotApi;

export const invalidateSlotCacheThunk =
  (
    partId: string,
    templateId: string,
    revisionId: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(
      slotApi.util.updateQueryData(
        "getSlotTree",
        { templateId, revisionId },
        (state) => {
          const nodeList = Object.values(state.nodes);
          const targetSlot = nodeList.find((n) => n.partId === partId);
          if (targetSlot) {
            state.isLoading = true;
            delete state.nodes[targetSlot.id];
          }
        }
      )
    );

    dispatch(slotApi.util.invalidateTags([{ type: "slotTree" }]));
  };
