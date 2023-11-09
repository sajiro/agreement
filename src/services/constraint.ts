import { createApi } from "@reduxjs/toolkit/dist/query/react";
import {
  sortAgreementObjectsByNameAsc,
  sortConstraintObjectsByNameAsc,
} from "helpers/agreements";
import {
  createConstraintValues,
  deleteConstraintValues,
  hasFailedResults,
} from "helpers/constraint";
import { IAgreementObject } from "models/agreements";
import {
  IConstraintMutationRequest,
  IConstraintValuesMutationRequest,
  IConstraintValuesMutationResponse,
  ICreateConstraintRequest,
} from "models/constraintMutation";
import {
  IConstraint,
  IConstraintValue,
  IConstraintTemplateEditPanel,
} from "models/constraints";
import baseQuery, { baseQueryWithRetry } from "./baseQuery";

export const constraintApi = createApi({
  reducerPath: "constraintApi",
  baseQuery,
  tagTypes: ["ConstraintList", "Constraint", "ConstraintValues"],
  endpoints: (builder) => ({
    getAll: builder.query<IAgreementObject[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const constraintsResults = await fetchWithBQ("constraints");
        if (constraintsResults.error) {
          return { error: constraintsResults.error };
        }

        const constraints = (constraintsResults.data as IConstraint[]) || [];
        const agreementObjects: IAgreementObject[] = constraints.map((c) => ({
          key: c.id,
          name: c.display !== "" ? c.display : c.name,
          constraintName: c.name,
          objectIdInfo: { constraintId: c.id },
        }));
        sortAgreementObjectsByNameAsc(agreementObjects);
        return { data: agreementObjects as IAgreementObject[] };
      },
      providesTags: ["ConstraintList"],
    }),
    getAllConstraintsForEditConstraint: builder.query<
      IConstraintTemplateEditPanel[],
      void
    >({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const constraintsResults = await fetchWithBQ("constraints");
        const constraints = constraintsResults.data as IConstraint[];
        const constraintList: IConstraintTemplateEditPanel[] = constraints.map(
          (c) => ({
            key: c.id,
            name: c.name,
            display: c.display ? c.display : c.name,
            /*  keyDisplay: c.display ? c.display : c.name, */
            /*  keyId: c.id, */
          })
        );
        sortConstraintObjectsByNameAsc(constraintList);

        return { data: constraintList as IConstraintTemplateEditPanel[] };
      },
      providesTags: ["ConstraintList"],
    }),

    getConstraint: builder.query<IConstraint, string>({
      query: (id) => `constraint/${id}`,
      providesTags: (result) =>
        result ? [{ type: "Constraint", id: result.id }] : ["Constraint"],
    }),
    getConstraintValues: builder.query<IConstraintValue[], string>({
      query: (id) => `ui/constraint/${id}/values`,
      transformResponse: (response: IConstraintValue[] | undefined) => {
        const constraintValues = response || [];
        return constraintValues;
      },
      providesTags: (_result, _error, arg) =>
        _result
          ? [{ type: "ConstraintValues", id: arg }]
          : ["ConstraintValues"],
    }),

    createConstraint: builder.mutation<string, ICreateConstraintRequest>({
      queryFn: async (constraintRequest, api, _extraOptions, baseQueryAgr) => {
        const createResponse = await baseQueryAgr({
          url: "constraint",
          method: "POST",
          body: constraintRequest.constraintInfo,
        });

        if (createResponse.data) {
          const createdConstraint = createResponse.data as { id: string };
          const verificationResult = await baseQueryWithRetry(
            {
              url: `constraint/${createdConstraint.id}`,
              method: "GET",
            },
            api,
            { maxRetries: 2 }
          );

          if (verificationResult.data) return { data: createdConstraint.id };
        }

        return { error: createResponse.error! };
      },
    }),
    deleteConstraint: builder.mutation<unknown, IConstraintMutationRequest>({
      queryFn: async (deletionRequest, api, _extraOptions, baseQueryAgr) => {
        const deleteConstraintResponse = await baseQueryAgr({
          url: `constraint/${deletionRequest.constraintId}`,
          method: "DELETE",
        });

        if (deleteConstraintResponse?.meta?.response?.ok) {
          const verificationResult = await baseQueryWithRetry(
            {
              url: "constraints",
              method: "GET",
              validateStatus: (_response, body) => {
                const constraints = (body as IConstraint[]) || [];
                const deletedConstraint = constraints.find(
                  (r) => r.id === deletionRequest.constraintId
                );
                return !deletedConstraint;
              },
            },
            api,
            { maxRetries: 2 }
          );

          return verificationResult.data
            ? { data: deleteConstraintResponse.data! }
            : {
                error: {
                  status: "CUSTOM_ERROR",

                  error: "Unable to validate Constraint was deleted",

                  data: {},
                },
              };
        }

        return { error: deleteConstraintResponse.error! };
      },
    }),
    createConstraintValues: builder.mutation<
      IConstraintValuesMutationResponse,
      IConstraintValuesMutationRequest
    >({
      queryFn: async (creationRequest, _api, _extraOptions, baseQueryAgr) => {
        const { constraintId, allowRetry, constraintValueInfos } =
          creationRequest;
        const results = await createConstraintValues(
          constraintId,
          constraintValueInfos,
          baseQueryAgr
        );
        if (hasFailedResults(results) && allowRetry) {
          const retryValues = constraintValueInfos.filter((cv) =>
            results.failureIds.includes(cv.id)
          );
          const retryResults = await createConstraintValues(
            constraintId,
            retryValues,
            baseQueryAgr
          );
          results.successfulIds.push(...retryResults.successfulIds);
          results.failureIds = retryResults.failureIds;
        }

        if (results.failureIds.length > 0)
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Unable to create all constraint values",
              data: results,
            },
          };
        return { data: results };
      },
    }),
    deleteConstraintValues: builder.mutation<
      IConstraintValuesMutationResponse,
      IConstraintValuesMutationRequest
    >({
      queryFn: async (deletionRequest, _api, _extraOptions, baseQueryAgr) => {
        const { constraintId, allowRetry, constraintValueInfos } =
          deletionRequest;
        const results = await deleteConstraintValues(
          constraintId,
          constraintValueInfos,
          baseQueryAgr
        );
        if (hasFailedResults(results) && allowRetry) {
          const retryValues = constraintValueInfos.filter((cv) =>
            results.failureIds.includes(cv.id)
          );
          const retryResults = await deleteConstraintValues(
            constraintId,
            retryValues,
            baseQueryAgr
          );
          results.successfulIds.push(...retryResults.successfulIds);
          results.failureIds = retryResults.failureIds;
        }

        if (hasFailedResults(results))
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Unable to delete all constraint values",
              data: results,
            },
          };
        return { data: results };
      },
    }),
  }),
});

export const {
  useGetAllQuery: useGetAllConstraints,
  useGetConstraintValuesQuery,
  useGetConstraintQuery,

  useLazyGetConstraintQuery,
  useLazyGetAllQuery: useLazyGetAllConstraints,
  useGetAllConstraintsForEditConstraintQuery,
  useCreateConstraintMutation,
  useCreateConstraintValuesMutation,
  useDeleteConstraintMutation,
  useDeleteConstraintValuesMutation,
} = constraintApi;

export const invalidateConstraintCache = (constraintId?: string) =>
  constraintId
    ? constraintApi.util.invalidateTags([
        { type: "ConstraintList" },

        { type: "Constraint", id: constraintId },
        { type: "ConstraintValues", id: constraintId },
      ])
    : constraintApi.util.invalidateTags([{ type: "ConstraintList" }]); // handle cache clearing for constraint deletion
