export enum RevisionStatus {
  Draft = "Draft",
  Unpublished = "Unpublished",
  Test = "Test",
  Pending = "Pending",
  Live = "Live",
  Published = "Published",
  Old = "Old"
}

export interface IRevision {
  id: string;
  name?: string;  // desplayed as "description" in some places
  effectiveDate: string;
  status: RevisionStatus;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  etag: string;
  isCloned?: boolean;
  number: number;
}
