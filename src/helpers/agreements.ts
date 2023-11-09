import { IAgreementObject } from "models/agreements";
import { IConstraintTemplateEditPanel } from "models/constraints";

export const DEFAULT_NON_EXISTING_VALUE_TEXT = "-";
export const DEFAULT_TEMPLATE_SHOW_COUNT = 4;

export const sortAgreementObjectsByNameAsc = (
  agreementObjects: IAgreementObject[]
) => {
  agreementObjects.sort((a: IAgreementObject, b: IAgreementObject) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
};

export const sortConstraintObjectsByNameAsc = (
  constraintList: IConstraintTemplateEditPanel[]
) => {
  constraintList.sort(
    (a: IConstraintTemplateEditPanel, b: IConstraintTemplateEditPanel) => {
      if (a.display < b.display) return -1;
      if (a.display > b.display) return 1;
      return 0;
    }
  );
};
