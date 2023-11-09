import * as listingsLayout from "./listingsLayout";
import { RouteComponent } from "router/index";

describe("getNewClauseName function", () => {
  test("CustomClause changes to clause", () => {
    const type = RouteComponent.CustomClauses;
    const getResult = listingsLayout.getNewClauseName(type);
    expect(getResult).toEqual("clause");
  });

  test("Template changes to template", () => {
    const type = RouteComponent.Templates;
    const getResult = listingsLayout.getNewClauseName(type);
    expect(getResult).toEqual("template");
  });
});
