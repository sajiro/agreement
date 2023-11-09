import { ApplicationInsights, ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';
import { config } from "config";

export const getAppInsightInfo = () => {
  const browserHistory = createBrowserHistory({ basename: '' });
  const reactPlugin = new ReactPlugin();
  const appInsights = new ApplicationInsights({
      config: {
          instrumentationKey: config.instrumentationKey,
          disableFetchTracking: false,
          enableRequestHeaderTracking: true,
          enableResponseHeaderTracking: true,
          enableAutoRouteTracking: true,
          extensions: [reactPlugin as ITelemetryPlugin], // workaround due to issue: https://github.com/microsoft/ApplicationInsights-JS/issues/1293
          extensionConfig: {
            [reactPlugin.identifier]: { history: browserHistory }
          }
      }
  });
  appInsights.loadAppInsights();
  return { reactPlugin, appInsights };

}
