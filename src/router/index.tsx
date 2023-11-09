import { INavLink } from "@fluentui/react";
import { IAgreementObjectId } from "models/agreements";

export interface IRouteInfo {
  component: RouteComponent;
  objectIdInfo?: IAgreementObjectId;
}

export interface IRouteMeta {
  hideNav?: boolean;
  hideSideNav?: boolean;
}

export interface IRouteDefinition {
  getRouteInfo: (objectIdInfo: IAgreementObjectId) => IRouteInfo;
  meta: IRouteMeta;
  navLink?: INavLink;
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

export const routeDefinitions: Record<RouteComponent, IRouteDefinition> = {
  [RouteComponent.Clauses]: {
    getRouteInfo: (objectIdInfo: IAgreementObjectId) => ({component: RouteComponent.Clauses, objectIdInfo}),
    meta: {},
    navLink: { name: "Standard Clauses", url: RouteComponent.Clauses.toString(), key: "Clauses" }
  },
  [RouteComponent.ClauseEdit]: {
    getRouteInfo: (objectIdInfo: IAgreementObjectId) => ({component: RouteComponent.ClauseEdit, objectIdInfo}),
    meta: { hideNav: true, hideSideNav: true }
  },
  [RouteComponent.CustomClauses]: {
    getRouteInfo: (objectIdInfo: IAgreementObjectId) => ({component: RouteComponent.CustomClauses, objectIdInfo}),
    meta: {},
    navLink: { name: "Custom Clauses", url: RouteComponent.CustomClauses.toString(), key: "CustomClauses" }
  },
  [RouteComponent.CustomClauseEdit]: {
    getRouteInfo: () => ({component: RouteComponent.CustomClauseEdit}),
    meta: {}
  },
  [RouteComponent.Templates]: {
    getRouteInfo: (objectIdInfo: IAgreementObjectId) => ({component: RouteComponent.Templates, objectIdInfo}),
    meta: {},
    navLink: { name: "Templates", url: RouteComponent.Templates.toString(), key: "templates" }
  },
  [RouteComponent.TemplateEdit]: {
    getRouteInfo: (objectIdInfo: IAgreementObjectId) => ({component: RouteComponent.TemplateEdit, objectIdInfo}),
    meta: {}
  },
  [RouteComponent.Constraints]: {
    getRouteInfo: (objectIdInfo: IAgreementObjectId) => ({component: RouteComponent.Constraints, objectIdInfo}),
    meta: {},
    navLink: { name: "Constraints", url: RouteComponent.Constraints.toString(), key: "constraints" }
  },
  [RouteComponent.DefaultRoute]: {
    getRouteInfo: () => ({component: RouteComponent.DefaultRoute}),
    meta: {}
  }
}

// Need to cast here as TS thinks there is a possibility of values being undefined, but we've already filtered those out 
export const navLinks: INavLink[] = Object.values(routeDefinitions).filter(r => r.navLink).map(r => r.navLink) as INavLink[];