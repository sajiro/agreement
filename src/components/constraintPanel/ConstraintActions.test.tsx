import { screen, render } from "@testing-library/react";
import ConstraintActions, { ConstraintActionsProps } from "./ConstraintActions";
import useConstraintMutator from "hooks/constraint/mutation/useConstraintMutator";
import { isValidAndHasChanges } from "helpers/constraint";

jest.mock("hooks/constraint/mutation/useConstraintMutator", () => jest.fn());

jest.mock("helpers/constraint", () => ({
  isValidAndHasChanges: jest.fn(),
}));

jest.mock("./ActionWarning", () => () => (
  <div data-testid="actionWarning">
    <p>Test</p>
  </div>
));

jest.mock("components/shared/panel/PanelMessenger", () => () => (
  <div data-testid="panelMessenger">
    <p>Test</p>
  </div>
));

const props: ConstraintActionsProps = {
  constraintId: "",
  constraintInfo: {
    originalContent: {
      name: "",
      display: "",
    },
    errorMessage: "",
    isModified: false,
    isValid: false,
    id: "",
    name: "",
    display: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    valuesUri: "",
  },
  newConstraintValues: [],
  removedConstraintValues: [],
  isNewConstraint: true,
  isSubmitting: false,
  onClosePanel: jest.fn(),
};

describe("Constraint Actions", function () {
  it("renders the warning component", function () {
    const mockFunction1 = jest.fn();
    const mockFunction2 = jest.fn();
    (useConstraintMutator as jest.Mock).mockReturnValue({
      createNewConstraint: mockFunction1,
      triggerConstraintValueMutations: mockFunction2,
    });
    (isValidAndHasChanges as jest.Mock).mockReturnValue({
      isValid: true,
      editsMade: true,
    });
    render(<ConstraintActions {...props} />);

    const actionWarning = screen.queryByTestId("actionWarning");

    const button = screen.getByRole("button", {
      name: /Create/i,
    });

    expect(button).toBeInTheDocument();

    expect(button).toBeEnabled();

    expect(actionWarning).toBeTruthy();
  });
  it("doesn't render the warning component", function () {
    const mockFunction1 = jest.fn();
    const mockFunction2 = jest.fn();
    (useConstraintMutator as jest.Mock).mockReturnValue({
      createNewConstraint: mockFunction1,
      triggerConstraintValueMutations: mockFunction2,
    });
    (isValidAndHasChanges as jest.Mock).mockReturnValue({
      isValid: false,
      editsMade: false,
    });

    const propsTemp = { ...props, isNewConstraint: false };
    render(<ConstraintActions {...propsTemp} />);

    const actionWarning = screen.queryByTestId("actionWarning");

    const button = screen.getByRole("button", {
      name: /Save/i,
    });

    expect(button).toBeInTheDocument();

    expect(button).toBeDisabled();

    expect(actionWarning).toBeFalsy();
  });
});
