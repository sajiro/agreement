import { ForwardRefExoticComponent, RefAttributes } from "react";
import { AgreementObjectType } from "./agreements";
// import { IClauseRevision } from "./clauses";
import { IConstraintValue } from "./constraints";
import { IRevision } from "./revisions";
import { ISlotConstraint, ISlotPositioningTarget, ITemplateRevisionSlot } from "./slot";

export interface IDialogContentComponent {
  onProceed: () => void;
  onCancel?: () => void;
}

export type DialogComponentType = ForwardRefExoticComponent<
  Pick<any, string | number | symbol> & RefAttributes<IDialogContentComponent>
>;

export interface IDialogContent {
  title: string;
  titleIcon?: string;
  titleIconColor?: string;
  additionalInfo?: any;
}

export interface IDialog extends IDialogContent {
  isDialogOpen: boolean;
  isProceeding?: boolean;
  type: DialogContentType;
}

export enum DialogContentType {
  messageDialog = "messageDialog",
  error404 = "error404",
  error405 = "error405",
  error412 = "error412",
  // Constraint dialogs
  constraintDeletion = "constraintDeletion",
  constraintUnsavedChanges = "constraintUnsavedChanges",

  // Custom Clause dialogs
  customClauseGoLive = "customClauseGoLive",

  // AgreementObject (Clause, Template) dialogs
  // Custom Clause shares the UnsavedChanges dialog
  Copy = "Copy",
  GoLive = "GoLive",
  Withdraw = "Withdraw",
  Deletion = "Delete",
  UnsavedChanges = "UnsavedChanges",
  Processing = "Processing",

  TemplateCloneFail = "TemplateCloneFail",
  SlotGroupCreation = "SlotGroupCreation"
}

export interface IRevisionUpdateDialogContent {
  objectType: AgreementObjectType;
  objectName: string;
  id: string;
  revision: IRevision;

  // for Custom Clause GoLive (publish) dialog
  templateId?: string;
  templateName?: string;
}

export interface IUnsavedChangesContent {
  objectType: AgreementObjectType;
  id: string;
  revisionId: string;
  isRevisionChangeAction: boolean; // Assumes that its either a revision change or closing of panel

  // for Custom Clause UnsavedChanges dialog
  templateId?: string;
}

export interface IDeletionContent {
  objectType: AgreementObjectType;
  objectId: string;
  objectEtag?: string;
  revisionId?: string;
  revisionEtag?: string;
}

export interface IMessageContent {
  message: string;
  subMessages?: string[];
}

export interface IError404Content {
  targetStr: string;
  targetType: AgreementObjectType;
  isTargetRevision: boolean;
  refreshObjectId?: string; // has value only if isTargetRevision is true
}

export interface IConstraintDeletionContent {
  constraintId: string;
  existingConstraintValues: IConstraintValue[];
}

export interface ITemplateCloneFailDialog{
  message:string;
  templateId:string;
  templateEtag?:string;
  revisionId?:string;
  revisionEtag?:string;
  title:string;
}

export interface ISlotGroupCreationContent {
  slotsToGroup: ITemplateRevisionSlot[];
  commonConstraints: ISlotConstraint[];
  target: ISlotPositioningTarget;
}
