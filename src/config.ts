import { Configuration } from "@azure/msal-browser";
import { config as devConfig } from "config.dev";
import { config as prodConfig } from "config.prod";

export interface IConfig {
  authentication: { msalConfig: Configuration; scopes: string[] };
  rootRouteRegex: RegExp;
  templateServiceBaseUrl: string;
  wopiHostBaseUrl: string;
  quoteCenterSvcBaseUrl: string;
  complianceCtrlQryString: string;
  complianceCtrlScope: string[];
  instrumentationKey: string;
  msxHostnames: string[];
  customClauseTemplateInfo: { key: string; text: string }[];
  psCategoryTagInfo: { id: string; name: string };
  businessUnitFeatureFlagging: boolean;
}

const isProdEnv = process.env.REACT_APP_NODE_ENV === "prod";
export const config = isProdEnv ? prodConfig : devConfig;
