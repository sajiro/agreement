import { createApi } from "@reduxjs/toolkit/query/react";
import { businessGroupDetails } from "consts/globals";
import { IBusinessGroup } from "../models/businessUnits";
import { getCurrentUser } from "./authentication";
import ccfBaseQuery from "./ccfBaseQuery";

export const ccfBusinessGroupApi = createApi({
  reducerPath: "businessUnitApi",
  baseQuery: ccfBaseQuery,
  endpoints: (builder) => ({
    getBusinessGroups: builder.query<string[], void>({
      query: () => {
        const userName = getCurrentUser();
        return `search/roles?subjectUpn=${userName}&fields=All`;
      },
      transformResponse: (response: IBusinessGroup[]) => {
        const filteredbusinessgrps = response
          .filter((e) => e.MetaData.GroupType === "2")
          .map((e) => e.Name);
        const businessgrps = filteredbusinessgrps.map(
          (e) => e.split("__UserGroup")[0]
        );
        const usrBizUnitsMap = businessGroupDetails
          .map((e) => businessgrps.find((b) => b === e.businessGroup))
          .filter((e) => !!e);
        const usrBusinessUnits = usrBizUnitsMap.map(
          (e) => businessGroupDetails.find((b) => b.businessGroup === e)!.tenant
        );
        return usrBusinessUnits;
      },
    }),
  }),
});

export const { useGetBusinessGroupsQuery } = ccfBusinessGroupApi;
