import { fetchBaseQuery, retry } from "@reduxjs/toolkit/dist/query";
import { config } from "config";
import { businessGroupDetails } from "consts/globals";
import { RootState } from "store";
import { getAuthenticationToken } from "./authentication";

const baseQuery = fetchBaseQuery({
  baseUrl: config.templateServiceBaseUrl,
  prepareHeaders: async (headers: Headers, { getState }) => {
    const authenticationToken = await getAuthenticationToken(
      config.authentication.scopes
    );

    if (config.businessUnitFeatureFlagging === true) {
      // Does this call needs to be run every time
      const { businessUnit } = getState() as RootState;
      const usrBusinessGroup = businessGroupDetails.find(
        (b) => b.tenant === businessUnit
      )?.businessGroup;
      // if (usrBusinessGroup === "ProfessionalServices" || usrBusinessGroup === "OEM") {
      headers.set("Tenant", `${usrBusinessGroup}`);
      // }
    }

    headers.set("authorization", `bearer ${authenticationToken}`);
    return headers;
  },
});

export const baseQueryWithRetry = retry(baseQuery);
export default baseQuery;
