export interface IBusinessGroup {
  ApplicationId: string;
  Namespace: string;
  Name: string;
  MetaData: MetaData;
}

interface MetaData {
  GroupType: string;
}
