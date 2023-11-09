export interface ILabelData {
  id: string;
  name?: string;
}

export interface IClauseLabelInfo {
  psCategoryLabels: ILabelData[]; // all the labels tagged as "PS Category" labels
  clauseLabels: ILabelData[];     // the "PS Category" labels this clause is tagged with
}

export interface ILabelTag {
  id?: string;
  entityId?: string;    // ID of the entity tagged by the label "1df51f7b-e4e2-44f5-afd1-1d19950e0acb"
  entityName?: string;  // display name of the entity, eg: "Legal"
  entityType?: string;  // type of the entity, eg: "label"
  entityUri?: string;
  labelId?: string;   // eg: "1df51f7b-e4e2-44f5-afd1-1d19950e0acb"
  labelName?: string; // eg: "Professional Services "
  createdBy?: string;
  createdDate?: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface IUpdateClauseLabelsRequest {
  clauseId?: string;
  deletedLabels?: ILabelData[];
  addedLabels?: ILabelData[];
}

export interface IUpdateClauseLabelsResult {
  success: number;
  fail: number;
}
