import { RouteComponent } from "router/index";

export function getNewClauseName(type: RouteComponent) {
  let typeUpdate = type;
  if (type === RouteComponent.CustomClauses) {
    typeUpdate = RouteComponent.Clauses;
  }

  return typeUpdate.slice(0, -1).toLowerCase();
}
