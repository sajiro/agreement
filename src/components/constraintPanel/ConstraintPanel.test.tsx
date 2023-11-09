import { render, screen } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import ConstraintPanel from "./ConstraintPanel";
import ConstraintEditor from "./ConstraintEditor";
import useConstraintEditor from "hooks/constraint/edit/useConstraintEditor";
import useConstraintInfoProvider from "hooks/constraint/useConstraintInfoProvider";
import useConstraintPanel from "hooks/constraint/useConstraintPanel";
import useConstraintDialog from "hooks/constraint/useConstraintDialog";
import {
  isValidAndHasChanges,
  getConstraintPanelInfo,
} from "helpers/constraint";
import { IPanelProps, PanelType } from "models/panel";

jest.mock("./ConstraintEditor", () => () => (
  <div data-testid="constraintEditor">
    <p>Test</p>
  </div>
));

jest.mock("helpers/constraint", () => ({
  isValidAndHasChanges: jest.fn(),
  getConstraintPanelInfo: jest.fn(),
}));

jest.mock("hooks/constraint/useConstraintDialog", () => jest.fn());

jest.mock("hooks/constraint/useConstraintPanel", () => jest.fn());

jest.mock("hooks/constraint/useConstraintInfoProvider", () => jest.fn());

jest.mock("hooks/constraint/edit/useConstraintEditor", () => jest.fn());

const props: IPanelProps = {
  panelInfo: {
    panelType: PanelType.Constraint,
    agreementObjectIds: {},
    additionalInfo: {},
  },
  isBlocking: false,
  persistentInfo: {},
};

describe("Constraint Editor", function () {
  it("if is a new constraint", function () {
    const mockFunction1 = jest.fn();
    (useConstraintPanel as jest.Mock).mockReturnValue({
      closePanel: mockFunction1,
    });

    (useConstraintDialog as jest.Mock).mockReturnValue({
      openUnsavedChangesDialog: jest.fn(),
    });
    (useConstraintInfoProvider as jest.Mock).mockReturnValue({
      constraintInfo: {
        constraint: "Test",
      },
    });
    (useConstraintEditor as jest.Mock).mockReturnValue({
      isLoading: false,
      constraintInfoEditor: {
        constraintInfo: {
          constraint: "Test",
        },
      },
      constraintValuesEditor: {
        newConstraintValues: [],
        removableConstraintValues: [],
      },
      constraintEditTracker: {
        isSubmitting: false,
      },
    });
    (isValidAndHasChanges as jest.Mock).mockReturnValue({
      editsMade: true,
    });
    (getConstraintPanelInfo as jest.Mock).mockReturnValue({
      authoringInfoShown: true,
    });

    const { queryByTestId } = render(<ConstraintPanel {...props} />, {
      preloadedState: {} as RootState,
    });
    const constraintEditor = queryByTestId("constraintEditor");

    expect(constraintEditor).toBeTruthy();
  });
});
