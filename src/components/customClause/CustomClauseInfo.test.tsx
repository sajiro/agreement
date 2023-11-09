import { screen } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import CustomClauseInfo from "./CustomClauseInfo";
import { InfoPageTitleWithLoading } from "components/shared/InfoPageTitle";
import { SharedActionBarWithLoading } from "components/shared/SharedActionBar";
import { SharedClausePivotWithLoading } from "components/shared/SharedClausePivot";
import NoItemSelectedDisplay from "components/shared/NoItemSelectedDisplay";
// import DeleteOrphan from "components/shared/DeleteOrphan";
import useCustomClauseInfoProvider from "hooks/customClause/useCustomClauseInfoProvider";
import { IAgreementObjectId } from "models/agreements";

jest.mock("hooks/customClause/useCustomClauseInfoProvider", () => jest.fn());

// jest.mock("components/shared/DeleteOrphan", () => () => (
//   <div data-testid="deleteOrphan">
//     <p>Test</p>
//   </div>
// ));

jest.mock("components/shared/NoItemSelectedDisplay", () => () => (
  <div data-testid="noItemSelectedDisplay">
    <p>Test</p>
  </div>
));

jest.mock("components/shared/SharedActionBar", () => ({
  SharedActionBarWithLoading: () => (
    <div data-testid="sharedActionBar">
      <p>Test</p>
    </div>
  ),
}));

jest.mock("components/shared/SharedClausePivot", () => ({
  SharedClausePivotWithLoading: () => (
    <div data-testid="sharedClausePivot">
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

describe("CustomClauseInfo", function () {
  it("renders the noItemSelectedDisplay component only if isNothingSelected is false", function () {
    (useCustomClauseInfoProvider as jest.Mock).mockReturnValue({
      clauseInfo: {},
    });
    const props: IAgreementObjectId = {
      constraintId: "",
      isNothingSelected: true,
    };
    const { queryByTestId } = render(<CustomClauseInfo {...props} />, {
      preloadedState: {} as RootState,
    });
    const noItemSelectedDisplay = queryByTestId("noItemSelectedDisplay");
    const sharedActionBar = queryByTestId("sharedActionBar");
    const sharedClausePivot = queryByTestId("sharedClausePivot");
    const infoPageTitle = queryByTestId("infoPageTitle");

    expect(infoPageTitle).toBeFalsy();
    expect(sharedActionBar).toBeFalsy();
    expect(sharedClausePivot).toBeFalsy();
    expect(noItemSelectedDisplay).toBeTruthy();
  });
  it("renders the custom clause info if isNothingSelected is false", function () {
    (useCustomClauseInfoProvider as jest.Mock).mockReturnValue({
      clauseInfo: {},
    });
    const props: IAgreementObjectId = {
      constraintId: "",
      isNothingSelected: false,
    };
    const { queryByTestId } = render(<CustomClauseInfo {...props} />, {
      preloadedState: {} as RootState,
    });
    const noItemSelectedDisplay = queryByTestId("noItemSelectedDisplay");
    const sharedActionBar = queryByTestId("sharedActionBar");
    const sharedClausePivot = queryByTestId("sharedClausePivot");
    const infoPageTitle = queryByTestId("infoPageTitle");

    expect(infoPageTitle).toBeTruthy();
    expect(sharedActionBar).toBeTruthy();
    expect(sharedClausePivot).toBeTruthy();
    expect(noItemSelectedDisplay).toBeFalsy();
  });
  //   it("renders deleted orphan", function () {
  //     useClauseInfoProvider.mockReturnValue({
  //       clauseInfo: {
  //         isLoading: false,
  //         currentRevision: {
  //           id: "",
  //         },
  //         clause: {
  //           id: "123",
  //         },
  //       },
  //     });

  //     const props = {
  //       constraintId: "",
  //       isNothingSelected: false,
  //     };
  //     const { queryByTestId } = render(<ClauseInfo {...props} />, {
  //       preloadedState: {},
  //     });

  //     const noItemSelectedDisplay = queryByTestId("noItemSelectedDisplay");
  //     const sharedActionBar = queryByTestId("sharedActionBar");
  //     const sharedClausePivot = queryByTestId("sharedClausePivot");
  //     const infoPageTitle = queryByTestId("infoPageTitle");

  //     expect(infoPageTitle).toBeFalsy();
  //     expect(sharedActionBar).toBeFalsy();
  //     expect(sharedClausePivot).toBeFalsy();
  //     expect(noItemSelectedDisplay).toBeFalsy();

  //     const deleteOrphan = queryByTestId("deleteOrphan");
  //     expect(deleteOrphan).toBeTruthy();
  //   });
});
