import { RootState } from "store";
import { render, screen, fireEvent } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import TemplateEditEmptyContentDisplay from "components/templateEdit/TemplateEditEmptyContentDisplay";
import Translation from "../translation";

/* 
this test uses the mock api 
https://template.int.l2o.microsoft.com/v1/template/111/revision/222/slots 
https://template.int.l2o.microsoft.com/v1/template/6fc1486f-6c1d-47ee-ba8b-74368a019289/revision/bf1c3a26-8519-4c89-bfe1-527c700c056c/slots
https://template.int.l2o.microsoft.com/v1/ui/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revisions
https://template.int.l2o.microsoft.com/v1/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/09bbd9ab-081b-4948-ae6b-237ac2a84de0
https://template.int.l2o.microsoft.com/v1/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/b4b05af3-6e3f-4b1d-8c8e-ce0e634b351e
https://template.int.l2o.microsoft.com/v1/ui/part/3d234a08-58c7-4414-b00e-1a31d1003afd/revision/09bbd9ab-081b-4948-ae6b-237ac2a84de0/contents
in \src\test\server\serverHandlers.ts
*/

jest.mock(
  "components/templateEdit/TemplateEditEmptyContentDisplay",
  () => () =>
    (
      <div data-testid="templateEditEmptyContentDisplay">
        <p>Test</p>
      </div>
    )
);

const props = {
  templateId: "6fc1486f-6c1d-47ee-ba8b-74368a019289",
  revisionId: "bf1c3a26-8519-4c89-bfe1-527c700c056c",
};

describe("translation", () => {
  it("renders the clause", async function () {
    render(<Translation {...props} />, {
      preloadedState: {} as RootState,
    });
    const templateEditEmptyContentDisplay = screen.queryByTestId(
      "templateEditEmptyContentDisplay"
    );
    await new Promise((r) => setTimeout(r, 2000));
    expect(templateEditEmptyContentDisplay).toBeFalsy();
    const clauseName = await screen.getByText("TestClauseACV2EffDate");
    expect(clauseName).toBeInTheDocument();
  });
  it("renders the empty template", async function () {
    const props = {
      templateId: "111",
      revisionId: "222",
    };
    render(<Translation {...props} />, {
      preloadedState: {} as RootState,
    });
    await new Promise((r) => setTimeout(r, 2000));
    const templateEditEmptyContentDisplay = screen.queryByTestId(
      "templateEditEmptyContentDisplay"
    );

    expect(templateEditEmptyContentDisplay).toBeTruthy();
  });
});
