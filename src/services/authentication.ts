import { PublicClientApplication } from "@azure/msal-browser";
import { config } from "config";
import { v1 as uuidv1 } from "uuid";

const sessionId = uuidv1();

export const isRunningInMsx =
  !!window?.MsxAuthenticationService?.publicClientApplication;
export const publicClientApplication = new PublicClientApplication(
  config.authentication.msalConfig
);

export const getCurrentUser = (): string => {
  if (isRunningInMsx) return window.MsxAuthenticationService.userName;
  const currentAccount = publicClientApplication.getAllAccounts()[0];
  // to avoid warning in unit tests
  return currentAccount?.username;
};

export const getAuthenticationToken = async (
  scope: string[]
): Promise<string> => {
  if (isRunningInMsx) {
    // Assumes only a single scope
    const token = await window.MsxAuthenticationService.acquireTokenForScope(
      scope[0],
      sessionId
    );
    return token;
  }

  const account = publicClientApplication.getAllAccounts()[0];
  // to avoid warning in unit tests
  if (!account) {
    return "";
  }
  const silentTokenRequest = { scopes: scope, account };
  const authenticationResponse =
    await publicClientApplication.acquireTokenSilent(silentTokenRequest);
  return authenticationResponse.accessToken;
};
