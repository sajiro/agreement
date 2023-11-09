import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { config } from "config";
import { getAuthenticationToken } from "./authentication";

const ccfBaseQuery = fetchBaseQuery({
  baseUrl: `${config.quoteCenterSvcBaseUrl}/compliancecontrol/ManagementAPI/v1/`,
  prepareHeaders: async (headers: Headers) => {
    const authenticationToken = await getAuthenticationToken(
      config.complianceCtrlScope
    );
    headers.set("authorization", `bearer ${authenticationToken}`);
    return headers;
  },
});

export default ccfBaseQuery;
