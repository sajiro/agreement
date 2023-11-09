# Overview

Entry points into the app

## index.tsx

```
    <AppInsightsContext.Provider value={reactPlugin}>
      <MsalProvider instance={publicClientApplication}>
        <MsalAuthenticationTemplate {...authenticationTemplateProps}>
          <AppInsightsErrorBoundary
            onError={ErrorMessage}
            appInsights={reactPlugin}
          >
            <App />
```

AppInsightsContext.Provider is a wrapper for AppInsights

MsalProvider and MsalAuthentication wrappers are needed for login with ms accounts

AppInsightsErrorBoundary is needed to catch any code errors and send to telemetry

App component is wrapped in a Redux store

```
    <Provider store={store}>
      <AppRouter />
    </Provider>
```

Then we need to wrap the AppRouter in the Router wrapper component

```
    <Router>
      <AppContent />
    </Router>
```

extracted these 2 out to help with testing the AppContent component

## AppContent.tsx

The intro to the app where we need to check whether in MSX or not. We also need to check if a Business Unit is set. If no business set then just render the app title header and a dialog should render based on functionality in the useBusinessUnit hook.

If business unit present then render the page content which includes an Overlay component and a set of pivots for Clauses, Templates, Custom Clauses and Constraints.

BusinessUnitImpl component is used to switch between Busines Units

Also have a seperate Template Edit page to be routed too.
