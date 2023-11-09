import _ from "lodash";
import { IRevision, RevisionStatus } from "models/revisions";
import moment from "moment";
import { v1 as uuidv1 } from 'uuid';
import { getLatestPublishedRevision, getMostRecentPublishedVariant, setRevisionStatuses } from "./revisions";

const mockCurrentDate = new Date("2022-04-06T23:09:26Z");

const offsetDateBy = (date: Date, offset: number, field: "days"|"minutes"|"months"|"hours") => {
  const newMoment = moment(date).add(offset, field);
  return newMoment.toDate();
};

const getTestRevision = (effectiveDate: Date, backendStatus: RevisionStatus): IRevision => ({
  id: uuidv1(),
  effectiveDate: effectiveDate.toISOString(),
  createdBy: "",
  createdDate: "",
  etag: "",
  modifiedBy: "",
  modifiedDate: "",
  number: 1,
  status: backendStatus
});

describe("getLatestPublishedRevision function", () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(mockCurrentDate);
  });

  const validateLatestPublishedRevision = (revisions: IRevision[], expected: IRevision|undefined) => {
    const latestPublishedRevision = getLatestPublishedRevision(revisions);
    expect(latestPublishedRevision).toEqual(expected);
  };

  it("returns undefined when no revisions in list", () => {
    const revisions: IRevision[] = [];

    validateLatestPublishedRevision(revisions, undefined);
  });

  it("returns undefined when no revisions are published", () => {
    const revisions = [
      getTestRevision(offsetDateBy(mockCurrentDate, 2, "months"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "hours"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Test)
    ];

    validateLatestPublishedRevision(revisions, undefined);
  });

  it("returns undefined when all status are published to future date", () => {
    const revisions = [
      getTestRevision(offsetDateBy(mockCurrentDate, 2, "months"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, 5, "days"), RevisionStatus.Published),
      getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, 1, "months"), RevisionStatus.Published)
    ];

    validateLatestPublishedRevision(revisions, undefined);
  });

  it("returns correct revision with single revision is published on past date", () => {
    const revisions = [
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "days"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -12, "days"), RevisionStatus.Published),
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "hours"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Test)      
    ];

    validateLatestPublishedRevision(revisions, revisions[1]);
  });

  it("returns correct revision with multiple revisions in published status (past and future published dates)", () => {
    const revisions = [
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "minutes"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -12, "days"), RevisionStatus.Published),
      getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, 1, "months"), RevisionStatus.Published),
      getTestRevision(offsetDateBy(mockCurrentDate, -9, "hours"), RevisionStatus.Published)
    ];

    validateLatestPublishedRevision(revisions, revisions[4]);
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});

describe("setRevisionStatuses function", () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(mockCurrentDate);
  });

  const validateStatusReset = (revisionInfos: { revision: IRevision; expectedStatus: RevisionStatus }[]) => {
    const revisions = _.cloneDeep(revisionInfos.map(ri => ri.revision));
    setRevisionStatuses(revisions);

    expect(revisionInfos.length).toEqual(revisions.length);
    revisionInfos.forEach(ri => {
      const correspondingRevision = revisions.find(r => r.id === ri.revision.id);
      expect(correspondingRevision!.status).toEqual(ri.expectedStatus);
    });
  };

  it("resets draft status revisions to Unpublished if all revisions are draft", () => {
    const revisionInfos = [
      { revision: getTestRevision(mockCurrentDate, RevisionStatus.Draft), expectedStatus: RevisionStatus.Unpublished },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -1, "days"), RevisionStatus.Draft), expectedStatus: RevisionStatus.Unpublished }
    ];

    validateStatusReset(revisionInfos);
  });

  it("does not reset draft status, if accompanied by other non-draft status revisions", () => {
    const revisionInfos = [
      { revision: getTestRevision(mockCurrentDate, RevisionStatus.Draft), expectedStatus: RevisionStatus.Draft },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -1, "days"), RevisionStatus.Test), expectedStatus: RevisionStatus.Test }
    ];

    validateStatusReset(revisionInfos);
  });

  it("does not modify test status revision", () => {
    const revisionInfos = [
      { revision: getTestRevision(mockCurrentDate, RevisionStatus.Test), expectedStatus: RevisionStatus.Test }
    ];

    validateStatusReset(revisionInfos);
  });

  it("resets single published past effective date status revision to Live", () => {
    const revisionInfos = [
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -5, "days"), RevisionStatus.Draft), expectedStatus: RevisionStatus.Draft },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -12, "days"), RevisionStatus.Published), expectedStatus: RevisionStatus.Live },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -5, "hours"), RevisionStatus.Draft), expectedStatus: RevisionStatus.Draft },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Test), expectedStatus: RevisionStatus.Test }
    ];
    
    validateStatusReset(revisionInfos)
  });

  it("resets latest past effective date revision to Live and rest past effective dates to old", () => {
    const revisionInfos = [
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -2, "months"), RevisionStatus.Published), expectedStatus: RevisionStatus.Old },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -10, "days"), RevisionStatus.Published), expectedStatus: RevisionStatus.Old },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -9, "hours"), RevisionStatus.Published), expectedStatus: RevisionStatus.Old },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, -2, "minutes"), RevisionStatus.Published), expectedStatus: RevisionStatus.Live },      
    ];

    validateStatusReset(revisionInfos);
  });

  it("resets published revision with future effective date to pending", () => {
    const revisionInfos = [
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, 1, "months"), RevisionStatus.Published), expectedStatus: RevisionStatus.Pending },
      { revision: getTestRevision(offsetDateBy(mockCurrentDate, 12, "days"), RevisionStatus.Published), expectedStatus: RevisionStatus.Pending }
    ];

    validateStatusReset(revisionInfos);    
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});

describe("getMostRecentPublishedVariant function", () => {
  const validateMostRecentPublishedVariant = (revisions: IRevision[], expectedRevision: IRevision|undefined) => {
    const mostRecentPublishedVariant = getMostRecentPublishedVariant(revisions);
    expect(mostRecentPublishedVariant).toEqual(expectedRevision);
  };

  it("returns undefined when no revisions in list", () => {
    const revisions: IRevision[] = [];

    validateMostRecentPublishedVariant(revisions, undefined);
  });

  it("returns undefined if no published revisions", () => {
    const revisions = [
      getTestRevision(offsetDateBy(mockCurrentDate, 2, "months"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "hours"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Test)
    ];

    validateMostRecentPublishedVariant(revisions, undefined);
  });

  it("returns correct revision if single Live revision present", () => {
    const revisions = [
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "days"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -12, "days"), RevisionStatus.Live),
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "hours"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Test)
    ];

    validateMostRecentPublishedVariant(revisions, revisions[1]);
  });

  it("returns correct revision if single live revision and multiple old and pending revisions present", () => {
    const revisions = [
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "minutes"), RevisionStatus.Live),
      getTestRevision(offsetDateBy(mockCurrentDate, 12, "days"), RevisionStatus.Pending),
      getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Old),
      getTestRevision(offsetDateBy(mockCurrentDate, 1, "months"), RevisionStatus.Pending),
      getTestRevision(offsetDateBy(mockCurrentDate, -9, "hours"), RevisionStatus.Old)
    ];

    validateMostRecentPublishedVariant(revisions, revisions[0]);
  });

  it("returns correct revision if only pending and non-live revisions present", () => {
    const revisions = [
      getTestRevision(offsetDateBy(mockCurrentDate, -5, "days"), RevisionStatus.Draft),
      getTestRevision(offsetDateBy(mockCurrentDate, 12, "days"), RevisionStatus.Pending),
      getTestRevision(offsetDateBy(mockCurrentDate, 1, "months"), RevisionStatus.Pending),
      getTestRevision(offsetDateBy(mockCurrentDate, -1, "months"), RevisionStatus.Test)
    ];
    
    validateMostRecentPublishedVariant(revisions, revisions[2]);
  });
});