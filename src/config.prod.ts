import { IConfig } from "config";

export const config: IConfig = {
  authentication: {
    msalConfig: {
      auth: {
        clientId: "3c69340e-b760-4caa-9cb9-f6a3a9909a3f",
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
      "https://microsoft.onmicrosoft.com/agreementservice/user_impersonation",
    ],
  },
  rootRouteRegex: /^((?:\/)(?:main.aspx)?)/gim,
  templateServiceBaseUrl: "https://template.l2o.microsoft.com/v1",
  wopiHostBaseUrl: "https://wopihost.l2o.microsoft.com/v1",
  quoteCenterSvcBaseUrl: "https://quotecenterservice.l2o.microsoft.com/v1",
  complianceCtrlQryString: "&fields=All&ApplicationId=12091",
  complianceCtrlScope: [
    "https://microsoft.onmicrosoft.com/L2O/user_impersonation",
  ],
  instrumentationKey: "fdc14285-1680-4429-8b0e-42e017260c9d",
  msxHostnames: [
    "msxplatform.crm.dynamics.com",
    "msxsupportpoc.crm.dynamics.com",
  ],
  customClauseTemplateInfo: [
    {
      key: "9303e132-70b2-4a01-9b9b-605511b6283a",
      text: "Microsoft Customer Agreement",
    },
    {
      key: "e40cd0d3-89a1-4506-a382-51699fab25c9",
      text: "Microsoft Customer Agreement (Test)",
    },
    {
      key: "d78f889f-0927-4cee-af37-5af1cc2e289e",
      text: "Customer Affiliate Purchase Terms for MCA",
    },
    {
      key: "3abeb613-c3b9-44f2-a91a-dab531a0a0ae",
      text: "OEM - GPA2 Main",
    },
    {
      key: "544ff4d5-c3ef-4592-8fa4-0535ae7b8c9b",
      text: "OEM - GPA2 Amendments",
    },
    {
      key: "4e6a16f9-a3b3-4bf2-aa66-6d91e45f14cc",
      text: "Customer Affiliate Purchase Terms for MCA (Test)",
    },
  ],
  psCategoryTagInfo: {
    id: "b8d37571-1e22-437c-8602-6d716ec3396f",
    name: "Professional Services",
  },
  businessUnitFeatureFlagging: false,
};
