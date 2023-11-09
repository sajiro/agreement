import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { isRunningInMsx, publicClientApplication } from "services/authentication";

function AuthenticationContext({ children }: { children?: React.ReactNode }) {
  if (isRunningInMsx) {
    return (
      <>
        {null}
        {children}
      </>
    );
  }

  return (
    <MsalProvider instance={publicClientApplication}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        {children}
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}

export default AuthenticationContext;