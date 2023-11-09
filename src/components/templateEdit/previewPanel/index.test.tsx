import stringsConst from "consts/strings";
import { RootState } from "store";
import { render, screen } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { setTimeout } from "timers";
import PreviewPanel, { PreviewPanelProps } from "./index";

describe("previewPanel", () => {
  describe("previewPanel on Preview tab", () => {
    beforeEach(() => {
      /* this test uses the mock apis     
    "https://template.int.l2o.microsoft.com/v1/template/2cae7724-3277-48bf-bf52-2943e13d1c81/revision/963478fd-1567-4b35-9a8b-b9493c0a0da4/slots/",
    &  "https://template.int.l2o.microsoft.com/v1/template/2cae7724-3277-48bf-bf52-2943e13d1c81/revision/963478fd-1567-4b35-9a8b-b9493c0a0da4/slots/8425da46-2ae9-4e96-b033-48edd4aedea3",
    in \src\test\server\serverHandlers.ts
    */

      const props: PreviewPanelProps = {
        isPanelOpen: true,
        templateId: "2cae7724-3277-48bf-bf52-2943e13d1c81",
        revisionId: "963478fd-1567-4b35-9a8b-b9493c0a0da4",
        pivotName: "Preview",
      };
      render(<PreviewPanel {...props} />, {
        preloadedState: {
          resultSlotSlice: {
            isTriggered: false,
          },
        } as RootState,
      });
    });
    it("loads the panel with correct heading and initial controls", async function () {
      const panelTitle = await screen.getByText(
        stringsConst.templateEdit.previewPanel.AssemblySettings
      );
      expect(panelTitle).toBeInTheDocument();

      const toggleText = await screen.getByText(
        stringsConst.templateEdit.previewPanel.ShowTestClauses
      );
      expect(toggleText).toBeInTheDocument();

      const dateLabel = await screen.getByLabelText(stringsConst.common.Date);
      expect(dateLabel).toBeInTheDocument();

      const dateValue = screen.getByText("Today");
      expect(dateValue).toBeInTheDocument();

      const langInput = await screen.getByText(stringsConst.common.Language);
      expect(langInput).toBeInTheDocument();

      const langValue = screen.getByText("English (US)");
      expect(langValue).toBeInTheDocument();
    });
    it("loads the correct constraints", async function () {
      // need this timeout as the slots calls have numerous nested awaits
      await new Promise((r) => setTimeout(r, 2000));

      const constraint1 = await screen.getByText("Applicable Law");

      const constraint1Input = await screen.getByPlaceholderText(
        "select an option"
      );

      expect(constraint1Input).toBeInTheDocument();

      const constraint2 = await screen.getByText("Has Consulting TM Packages");

      expect(constraint1).toBeInTheDocument();

      expect(await screen.getByText("Include")).toBeInTheDocument();

      expect(constraint2).toBeInTheDocument();

      const constraint2Checkbox = screen.getByRole("checkbox");

      expect(constraint2Checkbox).toBeInTheDocument();
    });
  });
  describe("previewPanel on Structure tab with no constraints", () => {
    /* this test uses the mock apis     
"https://template.int.l2o.microsoft.com/v1/template/111/revision/222/slots/",
in \src\test\server\serverHandlers.ts
 */

    beforeEach(() => {
      const props: PreviewPanelProps = {
        isPanelOpen: true,
        templateId: "111",
        revisionId: "222",
        pivotName: "Structure",
      };
      render(<PreviewPanel {...props} />, {
        preloadedState: {
          resultSlotSlice: {
            isTriggered: false,
          },
        } as RootState,
      });
    });
    it("loads the panel with correct info", async function () {
      await new Promise((r) => setTimeout(r, 2000));

      const panelTitle = await screen.getByText(
        stringsConst.templateEdit.previewPanel.AssemblySettings
      );
      expect(panelTitle).toBeInTheDocument();

      const noConstraintText = await screen.getByText(
        stringsConst.templateEdit.previewPanel.noSettings
      );
      expect(noConstraintText).toBeInTheDocument();

      const toggleText = await screen.queryByText(
        stringsConst.templateEdit.previewPanel.ShowTestClauses
      );
      expect(toggleText).not.toBeInTheDocument();
    });
  });
  describe("previewPanel on Structure tab with constraints", () => {
    /* this test uses the mock apis     
    "https://template.int.l2o.microsoft.com/v1/template/2cae7724-3277-48bf-bf52-2943e13d1c81/revision/963478fd-1567-4b35-9a8b-b9493c0a0da4/slots/",
    &  "https://template.int.l2o.microsoft.com/v1/template/2cae7724-3277-48bf-bf52-2943e13d1c81/revision/963478fd-1567-4b35-9a8b-b9493c0a0da4/slots/8425da46-2ae9-4e96-b033-48edd4aedea3",
    in \src\test\server\serverHandlers.ts
    */
    beforeEach(() => {
      const props: PreviewPanelProps = {
        isPanelOpen: true,
        templateId: "2cae7724-3277-48bf-bf52-2943e13d1c81",
        revisionId: "963478fd-1567-4b35-9a8b-b9493c0a0da4",
        pivotName: "Preview",
      };
      render(<PreviewPanel {...props} />, {
        preloadedState: {
          resultSlotSlice: {
            isTriggered: false,
          },
        } as RootState,
      });
    });
    it("loads the panel with correct constraints", async function () {
      await new Promise((r) => setTimeout(r, 2000));

      const noConstraintText = await screen.queryByText(
        stringsConst.templateEdit.previewPanel.noSettings
      );
      expect(noConstraintText).not.toBeInTheDocument();

      const constraint1 = await screen.getByText("Applicable Law");

      const constraint1Input = await screen.getByPlaceholderText(
        "select an option"
      );

      expect(constraint1Input).toBeInTheDocument();

      const constraint2 = await screen.getByText("Has Consulting TM Packages");

      expect(constraint1).toBeInTheDocument();

      expect(await screen.getByText("Include")).toBeInTheDocument();

      expect(constraint2).toBeInTheDocument();

      const constraint2Checkbox = screen.getByRole("checkbox");

      expect(constraint2Checkbox).toBeInTheDocument();
    });
  });
});
