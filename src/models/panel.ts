import { AgreementObjectEditState, IAgreementObjectId } from "./agreements";

export interface IPanelSlice extends IPanel, IPanelCache {}

export interface IPanel {
  panelType: PanelType | undefined;
  agreementObjectIds: IAgreementObjectId;
  additionalInfo: any;
}

export interface IPanelCache {
  persistentInfo: { [key: string]: any };
}

export enum PanelType {
  CustomClause = "CustomClause",
  Clause = "Clause",
  Constraint = "Constraint",
  Template = "Template",
}

export interface IPanelProps extends IPanelCache {
  isBlocking: boolean;
  panelInfo: IPanel;
}

export interface IPanelInfo {
  editState: AgreementObjectEditState;
  agreementObjectIds: IAgreementObjectId;

  // for Clause and Custom Clause
  preselectedPivot?: string;
}

export interface IClausePanelArgs {
  agreementObjectIds: IAgreementObjectId;
  editState?: AgreementObjectEditState;
}

// for Clause and Custom Clause
export enum ClausePivotName {
  Properties = "Properties",
  Translations = "Translations",
  ContentPlaceholders = "Content placeholders",
  Preview = "Preview",
}
