import { IConfig } from "config";

export const config: IConfig = {
  authentication: {
    msalConfig: {
      auth: {
        clientId: "b12ca5c0-ea9d-4d0f-9eec-8e5463be5c82",
        authority:
          "https://login.microsoftonline.com/microsoft.onmicrosoft.com",
        redirectUri: window.location.origin,
        knownAuthorities: ["login.microsoftonline.com"],
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
      },
    },
    scopes: [
      "https://microsoft.onmicrosoft.com/agreementserviceppe/user_impersonation",
    ],
  },
  rootRouteRegex: /^((?:\/)(?:main.aspx)?)/gim,
  templateServiceBaseUrl: "https://template.int.l2o.microsoft.com/v1",
  wopiHostBaseUrl: "https://wopihost.int.l2o.microsoft.com/v1",
  quoteCenterSvcBaseUrl: "https://quotecenterservice.int.l2o.microsoft.com/v1",
  complianceCtrlQryString: "&fields=All&ApplicationId=12091",
  complianceCtrlScope: [
    "https://microsoft.onmicrosoft.com/L2O/user_impersonation",
  ],
  instrumentationKey: "46deb58f-e9d7-4a23-b8ec-a8fb7c408fea",
  msxHostnames: [
    "msxplatform.crm.dynamics.com",
    "msxsupportpoc.crm.dynamics.com",
  ],
  customClauseTemplateInfo: [
    {
      key: "8d5ad5f3-5da0-401a-9f08-0a6810f9b11b",
      text: "Microsoft Customer Agreement",
    },
    {
      key: "02eb1b33-2c00-4bb1-b73d-2b9c18a92196",
      text: "Customer Affiliate Purchase Terms for MCA (Test)",
    },
  ],
  psCategoryTagInfo: {
    id: "1df51f7b-e4e2-44f5-afd1-1d19950e0acb",
    name: "Professional Services",
  },
  businessUnitFeatureFlagging: false,
};
