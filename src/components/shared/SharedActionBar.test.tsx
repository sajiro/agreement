import { AgreementObjectType } from "models/agreements";
import { ClauseCategory, IClause, IClauseContent } from "models/clauses";
import { CustomClauseCategory, ICustomClause, ICustomClauseContent } from "models/customClauses";
import { IRevision, RevisionStatus } from "models/revisions";
import { ITemplate } from "models/templates";
import { render, screen } from "test/customRender";
import { v1 as uuidv1 } from 'uuid';
import SharedActionBar from "./SharedActionBar";

const getTestClause = (): IClause => ({
  id: uuidv1(),
  category: ClauseCategory.Content,
  createdDate: "2021-08-31T23:42:17Z",
  modifiedDate: "2021-08-31T23:42:17Z",

  createdBy: "",
  description: "",
  etag: "",
  modifiedBy: "",
  name: "",
  revisionsUri: "",
  status: "",
});

const getTestRevision = (status: RevisionStatus): IRevision => ({
  id: uuidv1(),
  status,

  etag: "",
  createdBy: "",
  createdDate: "",
  effectiveDate: "",
  modifiedBy: "",
  modifiedDate: "",
  number: 0
});

const getTestClauseRevisionContent = (): IClauseContent|ICustomClauseContent => ({
  language: "en-us",
  contents: undefined,
  disposition: "",
  lastModified: new Date(),
  length: 0,
  sasExpiration: new Date(),
  sasUri: "",
  status: ""
});

const getTestCustomClause = (): ICustomClause => ({
  id: uuidv1(),
  templateId: uuidv1(),
  category: CustomClauseCategory.Content,
  createdDate: "2021-08-31T23:42:17Z",
  modifiedDate: "2021-08-31T23:42:17Z",

  createdBy: "",
  description: "",
  etag: "",
  modifiedBy: "",
  name: "",
  revisionsUri: "",
  templateName: ""
});

const getTestTemplate = (): ITemplate => ({
  id: uuidv1(),
  createdDate: "2021-08-31T23:42:17Z",
  modifiedDate: "2021-08-31T23:42:17Z",

  category: "",
  constraints: [],
  createdBy: "",
  description: "",
  etag: "",
  modifiedBy: "",
  status: "",
  revisionsUri: "",
  name: ""
});

interface IExpectedButtonInfo {
  name: string;
  isDisabled: boolean;
}

const validateActionButtons = (expectedButtonInfos: IExpectedButtonInfo[]) => {
  const buttons = screen.getAllByRole("menuitem", { hidden: true });
  expect(buttons.length).toEqual(expectedButtonInfos.length);
  for (let i = 0; i < buttons.length; i += 1) {
    expect(buttons[i]).toHaveTextContent(expectedButtonInfos[i].name);
    expect(buttons[i].getAttribute("disabled"))
    expect(buttons[i].getAttribute("aria-disabled")).toBe(expectedButtonInfos[i].isDisabled ? "true" : null);
  }
};

describe("SharedActionBar", () => {
  it.each([
    [
      [getTestRevision(RevisionStatus.Unpublished)],
      [],
      [
        { name: "Unpublished", isDisabled: true },
        { name: "Edit", isDisabled: false },
        { name: "Delete clause", isDisabled: false },
        { name: "Publish", isDisabled: true }
      ]
    ],
    [
      [
        getTestRevision(RevisionStatus.Draft),
        getTestRevision(RevisionStatus.Pending)
      ],
      [],
      [
        { name: "Draft", isDisabled: false },
        { name: "Edit", isDisabled: false },
        { name: "Delete draft", isDisabled: false },
        { name: "Test", isDisabled: true },
        { name: "Publish", isDisabled: true }
      ]
    ],
    [
      [
        getTestRevision(RevisionStatus.Draft),
        getTestRevision(RevisionStatus.Pending)
      ],
      [getTestClauseRevisionContent()],
      [
        { name: "Draft", isDisabled: false },
        { name: "Edit", isDisabled: false },
        { name: "Delete draft", isDisabled: false },
        { name: "Test", isDisabled: false },
        { name: "Publish", isDisabled: false }
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Unpublished)],
      [getTestClauseRevisionContent()],
      [
        { name: "Unpublished", isDisabled: true },
        { name: "Edit", isDisabled: false },
        { name: "Delete clause", isDisabled: false },
        { name: "Publish", isDisabled: false }
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Pending)],
      [getTestClauseRevisionContent()],
      [
        { name: "Pending", isDisabled: false },
        { name: "Withdraw", isDisabled: false }
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Live)],
      [getTestClauseRevisionContent()],
      [
        { name: "Live", isDisabled: false },
        { name: "Create New Version", isDisabled: false }
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Old)],
      [getTestClauseRevisionContent()],
      [
        { name: "Old", isDisabled: false },
        { name: "Create New Version", isDisabled: false }
      ]
    ],
  ])("renders the correct action buttons for clause %#", (
      revisions: IRevision[],
      contents: IClauseContent[],
      expectedButtonInfos: IExpectedButtonInfo[]
    ) => {

    render(
      <SharedActionBar
        objectType={AgreementObjectType.clause}
        objectInfo={{ clause: getTestClause(), revisions, currentRevision: revisions[0], isLoading: false, hasData: true }}
        objectContentInfo={{ contents, isLoading: false, hasData: true }}
        openEditPanel={() => { }}
        setCurrentRevision={() => { }}
      />
    );

    validateActionButtons(expectedButtonInfos);
  });

  it.each([
    [
      [getTestRevision(RevisionStatus.Unpublished)],
      [],
      [
        { name: "Unpublished", isDisabled: true },
        { name: "Edit", isDisabled: false },
        { name: "Publish", isDisabled: true },
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Unpublished)],
      [getTestClauseRevisionContent()],
      [
        { name: "Unpublished", isDisabled: true },
        { name: "Edit", isDisabled: false },
        { name: "Publish", isDisabled: false },
      ]
    ],
    [
      [
        getTestRevision(RevisionStatus.Draft),
        getTestRevision(RevisionStatus.Live)
      ],
      [],
      [
        { name: "Draft", isDisabled: false },
        { name: "Edit", isDisabled: false },
        { name: "Publish", isDisabled: true },
      ]
    ],
    [
      [
        getTestRevision(RevisionStatus.Draft),
        getTestRevision(RevisionStatus.Live)
      ],
      [getTestClauseRevisionContent()],
      [
        { name: "Draft", isDisabled: false },
        { name: "Edit", isDisabled: false },
        { name: "Publish", isDisabled: false },
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Live)],
      [getTestClauseRevisionContent()],
      [
        { name: "Live", isDisabled: true },
      ]
    ]
  ])("renders the correct action buttons for custom clause %#", (
      revisions: IRevision[],
      contents: ICustomClauseContent[],
      expectedButtonInfos: IExpectedButtonInfo[]
    ) => {

      render(
        <SharedActionBar
          objectType={AgreementObjectType.customClause}
          objectInfo={{ clause: getTestCustomClause(), revisions, currentRevision: revisions[0], hasData: false, isLoading: false }}
          objectContentInfo={{ contents, isLoading: false, hasData: false }}
          openEditPanel={() => {}}
          setCurrentRevision={() => {}}
        />
      );

      validateActionButtons(expectedButtonInfos);
  });

  it.each([
    [
      [getTestRevision(RevisionStatus.Unpublished)],
      false,
      [
        { name: "Unpublished", isDisabled: true },
        { name: "Edit", isDisabled: false },
        { name: "Delete template", isDisabled: false },
        { name: "Test", isDisabled: true },
        { name: "Publish", isDisabled: true },
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Unpublished)],
      true,
      [
        { name: "Unpublished", isDisabled: true },
        { name: "Edit", isDisabled: false },
        { name: "Delete template", isDisabled: false },
        { name: "Test", isDisabled: false },
        { name: "Publish", isDisabled: false },
      ]
    ],
    [
      [
        getTestRevision(RevisionStatus.Draft),
        getTestRevision(RevisionStatus.Pending),
      ],
      false,
      [
        { name: "Draft", isDisabled: false },
        { name: "Edit", isDisabled: false },
        { name: "Delete draft", isDisabled: false },
        { name: "Test", isDisabled: true },
        { name: "Publish", isDisabled: true },
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Test)],
      true,
      [
        { name: "Testing", isDisabled: false },
        { name: "Open", isDisabled: false },
        { name: "Withdraw", isDisabled: false },
        { name: "Publish", isDisabled: false },
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Pending)],
      true,
      [
        { name: "Pending", isDisabled: false },
        { name: "Open", isDisabled: false },
        { name: "Withdraw", isDisabled: false },
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Live)],
      true,
      [
        { name: "Live", isDisabled: false },
        { name: "Open", isDisabled: false },
        { name: "Create New Version", isDisabled: false },
      ]
    ],
    [
      [getTestRevision(RevisionStatus.Old)],
      true,
      [
        { name: "Old", isDisabled: false },
        { name: "Open", isDisabled: false },
        { name: "Create New Version", isDisabled: false },
      ]
    ],
  ])("renders the correct action buttons for template %#", (
      revisions: IRevision[],
      hasSlots: boolean,
      expectedButtonInfos: IExpectedButtonInfo[]
    ) => {

    render(
      <SharedActionBar
        objectType={AgreementObjectType.template}
        objectInfo={{ template: getTestTemplate(), revisions, currentRevision: revisions[0], hasData: false, isLoading: false }}
        openEditPanel={() => {}}
        setCurrentRevision={() => {}}
        disablePublishOverride={!hasSlots}
      />
    );

    validateActionButtons(expectedButtonInfos);
  });
});