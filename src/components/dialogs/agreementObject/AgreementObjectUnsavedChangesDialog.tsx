import { ForwardedRef, forwardRef } from "react";

import { AgreementObjectType } from "models/agreements";
import {
  IDialogContentComponent,
  IUnsavedChangesContent,
} from "models/dialogs";
import usePanel from "hooks/usePanel";
import UnsavedChangesDialog from "../UnsavedChangesDialog";

const AgreementObjectUnsavedChangesDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {

    const { openPanel, closePanel } = usePanel(props.objectType);

    const unsavedChangesContent = props as IUnsavedChangesContent;
    const isCustomClause = unsavedChangesContent.objectType === AgreementObjectType.customClause;
    const isTemplate = unsavedChangesContent.objectType === AgreementObjectType.template;

    const objectName = isCustomClause ?
      "custom clause" :
      unsavedChangesContent.objectType.toString().toLowerCase();

    let templateId: string | undefined;
    if (isCustomClause) {
      templateId = unsavedChangesContent.templateId;
    }
    else if (isTemplate) {
      templateId = unsavedChangesContent.id;
    }

    const onProceed = () => {
      if (unsavedChangesContent.isRevisionChangeAction) {
        openPanel({
          clauseId: unsavedChangesContent.id,
          templateId,
          revisionId: unsavedChangesContent.revisionId,
        });
      } 
      else {        
        closePanel();
      }
    };

    return (
      <UnsavedChangesDialog
        ref={ref}
        objectName={objectName}
        onProceedAction={onProceed}
      />
    );
  }
);

export default AgreementObjectUnsavedChangesDialog;
