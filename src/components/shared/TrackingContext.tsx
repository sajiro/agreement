import { createContext, useContext, useMemo } from "react";

import { ApplicationInsights } from "@microsoft/applicationinsights-web";

interface ITrackingContext {
  trackEvent: (name: string) => void;
}

const Context = createContext<ITrackingContext>({
  trackEvent: () => {},
});

function TrackingContext({
  children,
  appInsights,
}: {
  children?: React.ReactNode;
  appInsights: ApplicationInsights;
}) {
  const trackEvent = (name: string) => {
    appInsights.trackEvent({
      name,
    });
  };

  const contextValue = useMemo(
    () => ({
      trackEvent,
    }),
    [trackEvent]
  );
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export default TrackingContext;

export const useTrackingContext = () => useContext(Context);
