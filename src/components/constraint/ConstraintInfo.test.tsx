import { screen } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import ConstraintInfo from "./ConstraintInfo";
import { InfoPageTitleWithLoading } from "components/shared/InfoPageTitle";
import { ConstraintActionBarWithLoading } from "components/constraint/ConstraintActionBar";
import { ConstraintInfoCardWithLoading } from "components/constraint/ConstraintInfoCard";
import { ConstraintGroupedListWithLoading } from "components/constraint/ConstraintGroupedList";
import NoItemSelectedDisplay from "components/shared/NoItemSelectedDisplay";

jest.mock("components/shared/NoItemSelectedDisplay", () => () => (
  <div data-testid="noItemSelectedDisplay">
    <p>Test</p>
  </div>
));

jest.mock("components/constraint/ConstraintGroupedList", () => ({
  ConstraintGroupedListWithLoading: () => (
    <div data-testid="constraintGroupedList">
      <p>Test</p>
    </div>
  ),
}));

jest.mock("components/constraint/ConstraintInfoCard", () => ({
  ConstraintInfoCardWithLoading: () => (
    <div data-testid="constraintInfoCard">
      <p>Test</p>
    </div>
  ),
}));

jest.mock("components/constraint/ConstraintActionBar", () => ({
  ConstraintActionBarWithLoading: () => (
    <div data-testid="constraintActionBar">
      <p>Test</p>
    </div>
  ),
}));

jest.mock("components/shared/InfoPageTitle", () => ({
  InfoPageTitleWithLoading: () => (
    <div data-testid="infoPageTitle">
      <p>Test</p>
    </div>
  ),
}));

describe("ConstraintInfo", function () {
  it("renders the noItemSelectedDisplay component only if isNothingSelected is false", function () {
    const props = {
      constraintId: "",
      isNothingSelected: true,
    };
    const { queryByTestId } = render(<ConstraintInfo {...props} />, {
      preloadedState: {} as RootState,
    });
    const noItemSelectedDisplay = queryByTestId("noItemSelectedDisplay");
    const constraintGroupedList = queryByTestId("constraintGroupedList");
    const constraintInfoCard = queryByTestId("constraintInfoCard");
    const infoPageTitle = queryByTestId("infoPageTitle");
    const constraintActionBar = queryByTestId("constraintActionBar");

    expect(constraintActionBar).toBeFalsy();
    expect(infoPageTitle).toBeFalsy();
    expect(constraintGroupedList).toBeFalsy();
    expect(constraintInfoCard).toBeFalsy();
    expect(noItemSelectedDisplay).toBeTruthy();
  });
  it("renders the constraints info is isNothingSelected is false", function () {
    const props = {
      constraintId: "",
      isNothingSelected: false,
    };
    const { queryByTestId } = render(<ConstraintInfo {...props} />, {
      preloadedState: {} as RootState,
    });
    const noItemSelectedDisplay = queryByTestId("noItemSelectedDisplay");
    const constraintGroupedList = queryByTestId("constraintGroupedList");
    const constraintInfoCard = queryByTestId("constraintInfoCard");
    const infoPageTitle = queryByTestId("infoPageTitle");
    const constraintActionBar = queryByTestId("constraintActionBar");

    expect(constraintActionBar).toBeTruthy();
    expect(infoPageTitle).toBeTruthy();
    expect(constraintGroupedList).toBeTruthy();
    expect(constraintInfoCard).toBeTruthy();
    expect(noItemSelectedDisplay).toBeFalsy();
  });
});
