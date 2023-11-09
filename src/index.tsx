import ReactDOM from "react-dom";
import { mergeStyles } from "@fluentui/react";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { AppInsightsErrorBoundary } from "@microsoft/applicationinsights-react-js";
import { getAppInsightInfo } from "telemetry";
import TrackingContext from "components/shared/TrackingContext";
import ErrorMessage from "components/errors/ErrorMessage";
import AuthenticationContext from "components/shared/AuthenticationContext";
import customTheme from "helpers/customTheme";
import { App } from "./App";
import "./index.css";

declare global {
  interface Window {
    MsxAuthenticationService: any;
  }
}

// Inject some global styles - workaround for msx not loading app css
mergeStyles({
  ":global(body,html)": {
    margin: 0,
    padding: 0,
    height: "100vh",
  },
  ":global(main)": {
    width: "100%",
    height: "100%",
  },
  ":global(*)": {
    boxSizing: "border-box",
  },
  ":global(#contentWrapper)": {
    color: customTheme.bodyColor,
    fontFamily:
      "'Segoe UI', '-apple-system', BlinkMacSystemFont, Roboto,'Helvetica Neue', Helvetica, Ubuntu, Arial, sans-serif, 'Apple Color Emoji','Segoe UI Emoji', 'Segoe UI Symbol'",
  },
});

initializeIcons();

function AppProvider() {
  const { reactPlugin, appInsights } = getAppInsightInfo();

  return (
    <AppInsightsErrorBoundary onError={ErrorMessage} appInsights={reactPlugin}>
      <TrackingContext appInsights={appInsights}>
        <AuthenticationContext>
          <App />
        </AuthenticationContext>
      </TrackingContext>
    </AppInsightsErrorBoundary>
  );
}

export default AppProvider;
ReactDOM.render(<AppProvider />, document.getElementById("contentWrapper"));
