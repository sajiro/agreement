export interface ITagsData {
  id: string;
  name: string;
  displayOption?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface ICreateTagsRequest {
  name?: string;
  id?: string;
  templateId?: string;
  labelId?: string;
}
