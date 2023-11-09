# Routing

## Route Definition

The Application specifies the route info via the **data query parameter** in the URL.  
Due to needing to support running the app within MSX, the route info is restricted to the single data parameter (more info can be found at: [Link](https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/sample-pass-multiple-values-web-resource-through-data-parameter?view=op-9-1)).  
  
The data parameter is set to an URL encoded JSON object with the following structure:

    export interface IRouteInfo {
      component: RouteComponent; // Page the app should display, e.g. Clause, Custom Clause, Template, etc.
      objectIdInfo?: IAgreementObjectId; // The info of the agreement object that should be selected
    }
    
    export enum RouteComponent {
      Templates = "Templates",
      TemplateEdit = "TemplateEdit",
      Clauses = "Clauses",
      ClauseEdit = "clauseEdit",
      CustomClauses = "CustomClauses",
      CustomClauseEdit = "CustomClauseEdit",
      Constraints = "Constraints",
      DefaultRoute = "DefaultRoute",
    }

    export interface IAgreementObjectId {
      clauseId?: string;
      templateId?: string;
      revisionId?: string;
      constraintId?: string;
      isNothingSelected?: boolean; // Special property to show a "No agreement object selected" component
    }

NOTES:
- On initial load if the URL doesn't contain a data parameter, the app will auto navigate to the "Clause" Page, auto select/update the route to the first clause.
- To add a new "route", add an additional enum value in the RouteComponent definition and update the route handling logic to handle the new route.

## Handling Route Changes

The component that handles route changes/controls what component to display is **AppContent.tsx** (src\components\AppContent.tsx).  
  
Due to the route info being in the **data query parameter** the route handling/re-rendering is handled via the following:  

    <Route
      render={() => {
        // Extract Route Info from data query parameter
        const routeInfo = getRouteInfo();
        
        // Based on the Route Info return the corresponding components
        return (<></>);
      }}
    />

## Route Utility Functions

In order to encapsulate all the routing related functions the following hook has been defined: **useRouter.ts**.
The hook definition can be found at: src\hooks\useRouter.ts