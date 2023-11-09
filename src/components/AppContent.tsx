import { Route } from "react-router-dom";
import {
  IStackItemStyles,
  IStackStyles,
  Pivot,
  PivotItem,
  Stack,
} from "@fluentui/react";
import BusinessUnitImpl from "components/businessUnit/BusinessUnitImpl";
import {
  IRouteDefinition,
  IRouteInfo,
  RouteComponent,
  routeDefinitions,
} from "router/index";
import useRouter from "hooks/useRouter";
import useBusinessUnit from "hooks/useBusinessUnit";
import { useState } from "react";
import customTheme from "helpers/customTheme";
import Clauses from "./clause/Clauses";
import CustomClauses from "./customClause/CustomClauses";
import Overlays from "./overlays/Overlays";
import Constraints from "./constraint/Constraints";
import Templates from "./template/Templates";
import TemplateEdit from "./templateEdit/TemplateEdit";

const stackStylesHeader: Partial<IStackStyles> = {
  root: {
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    height: 50,
    backgroundColor: "#002050",
    color: "white",
    padding: 20,
  },
};

const nonShrinkingStackItemStyles: IStackItemStyles = {
  root: {
    width: "100%",
    height: "100%",
  },
};

function Header({
  currentRoute,
  isMsx,
}: {
  currentRoute: IRouteDefinition;
  isMsx: boolean;
}) {
  if (isMsx || currentRoute.meta.hideNav) return null;

  return (
    <header>
      <Stack horizontal horizontalAlign="center" styles={stackStylesHeader}>
        <Stack.Item data-cy="page-title">Agreement Center</Stack.Item>
      </Stack>
    </header>
  );
}

function BusinessUnit({ children }: { children?: React.ReactNode }) {
  const { businessUnitName } = useBusinessUnit(true);

  return (
    <>
      {null}
      {businessUnitName && children}
    </>
  );
}

type PageContentProps = {
  routeInfo: IRouteInfo;
  currentRoute: IRouteDefinition;
  isMsx: boolean;
  goToRoute: (route: IRouteInfo) => void;
};
function PageContent({
  routeInfo,
  currentRoute,
  isMsx,
  goToRoute,
}: PageContentProps) {
  const [padding, setPadding] = useState<string>("0 0 0 0px");
  const onLinkClicked = (item?: PivotItem) => {
    const routeComponentName = item!.props.itemKey!;
    goToRoute({ component: routeComponentName as RouteComponent });
  };

  const getSelectedNav = (route: IRouteInfo) => {
    const selectedComponent = route.component.toString();
    if (selectedComponent === RouteComponent.TemplateEdit.toString()) {
      return RouteComponent.Templates.toString();
    }

    return selectedComponent;
  };

  if (routeInfo.component === RouteComponent.TemplateEdit)
    return <TemplateEdit {...routeInfo.objectIdInfo} />;

  return (
    <>
      <BusinessUnitImpl setPadding={setPadding} />
      <Pivot
        style={{
          padding:
            currentRoute.meta.hideNav && !isMsx ? "0" : `15px 32px 0 32px`,
        }}
        styles={{
          root: {
            "&::before": {
              display: "inline-block",
              width: "1px",
              height: "24px",
              backgroundColor: customTheme.menuDividerSemanticColor,
              position: "relative",
              top: "8px",
              content: "''",
              marginRight: "10px",
            },
            width: "100%",
            height: "100%",
            padding: `${padding}`,
          },
          itemContainer: { paddingTop: "25px" },
        }}
        onLinkClick={onLinkClicked}
        selectedKey={getSelectedNav(routeInfo)}
      >
        <PivotItem
          headerText="Standard Clauses"
          itemKey={RouteComponent.Clauses.toString()}
        >
          <Clauses />
        </PivotItem>
        <PivotItem
          headerText="Custom Clauses"
          itemKey={RouteComponent.CustomClauses.toString()}
        >
          <CustomClauses />
        </PivotItem>
        <PivotItem
          headerText="Templates"
          itemKey={RouteComponent.Templates.toString()}
        >
          <Templates />
        </PivotItem>
        <PivotItem
          headerText="Constraints"
          itemKey={RouteComponent.Constraints.toString()}
        >
          <Constraints />
        </PivotItem>
      </Pivot>
    </>
  );
}

function AppContent() {
  const { goToRoute, getRouteInfo, isMsx } = useRouter();

  return (
    <Route
      render={() => {
        const routeInfo = getRouteInfo() || {
          component: RouteComponent.Clauses,
        };
        const currentRoute =
          routeDefinitions[routeInfo?.component] ||
          routeDefinitions.DefaultRoute;

        return (
          <div>
            <Header currentRoute={currentRoute} isMsx={isMsx()} />
            <Stack
              style={{
                height: currentRoute.meta.hideNav
                  ? "100%"
                  : `Calc(100% - 50px)`,
              }}
              horizontal
            >
              <main>
                <Stack.Item styles={nonShrinkingStackItemStyles}>
                  <Overlays />
                  <BusinessUnit>
                    <PageContent
                      routeInfo={routeInfo}
                      currentRoute={currentRoute}
                      goToRoute={goToRoute}
                      isMsx={isMsx()}
                    />
                  </BusinessUnit>
                </Stack.Item>
              </main>
            </Stack>
          </div>
        );
      }}
    />
  );
}

export default AppContent;
