import { ConstraintOperator } from "./constraints";
import { ITree } from "./general";
import { RelativeNodePosition } from "./node";

export enum SlotOperationType {
  Replace = "Replace",
}

export interface ISlotConstraint {
  valueDisplay?: string;
  key: string;
  keyDisplay?: string;
  value: string;
  operator: ConstraintOperator;
  keyId?: string;
}

export interface ITemplateRevisionSlot {
  length: number;
  constraints: ISlotConstraint[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  position: number;
  etag: string;

  id: string;
  parentSlotId: string;

  category: string;
  partId: string;
  partName: string;
  name: string;
}

export interface ITemplateRevisionSlotItem extends ITemplateRevisionSlot {
  slots: ITemplateRevisionSlot[];
  isCollapsed: boolean;
  level: number;
  languageDisplay?: string;
  isParentSelected?: boolean;
  current?: boolean;
}

export interface ISlotTree extends ITree<ITemplateRevisionSlot> {
  isLoading: boolean;
}

export interface ISlotIdentification {
  templateId: string;
  revisionId: string;
  slotId: string;
}

export interface ISlotPositioningTarget {
  parentSlotId: string;
  targetSlotGroup: ITemplateRevisionSlot[];
  targetLocation?: { slotId: string; position: RelativeNodePosition };
}

export interface IBaseSlotMutationIdentification {
  templateId: string;
  revisionId: string;
  parentSlotId: string;
}

export interface ISlotUpdateOperation {
  op: SlotOperationType;
  path: string;
  value: any;
}

export interface ISlotUpdateInfo {
  slotId: string;
  parentSlotId: string;
  etag: string;
  updateOperations: ISlotUpdateOperation[];
}

export interface ISlotsUpdateInfo extends IBaseSlotMutationIdentification {
  updateInfos: ISlotUpdateInfo[];
}

export interface ISlotCreationRequest {
  position: number;
  category: string;
  partId: string;
  partName: string;
  constraints: ISlotConstraint[];
}

export interface ISlotsCreationInfo extends IBaseSlotMutationIdentification {
  slots: ISlotCreationRequest[];
}

export interface ISlotsDeletionInfo {
  templateId: string;
  revisionId: string;
  slotInfos: { slotId: string; parentSlotId: string }[];
}

export interface ICopySlotsInfo {
  templateId: string;
  sourceRevisionId: string;
  targetRevisionId: string;
}
