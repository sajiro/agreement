import {
  Dialog,
  DialogType,
  IDialogContentProps,
} from "@fluentui/react/lib/Dialog";
import { useSelector } from "react-redux";
import { RootState } from "store";
import useDialog from "hooks/useDialog";
import {
  DialogComponentType,
  DialogContentType,
  IDialogContentComponent,
} from "models/dialogs";
import { useRef } from "react";

import AgreementObjectCopyDialog from "components/dialogs/agreementObject/AgreementObjectCopyDialog";
import AgreementObjectGoLiveDialog from "components/dialogs/agreementObject/AgreementObjectGoLiveDialog";
import AgreementObjectWithdrawDialog from "components/dialogs/agreementObject/AgreementObjectWithdrawDialog";
import AgreementObjectUnsavedChangesDialog from "components/dialogs/agreementObject/AgreementObjectUnsavedChangesDialog";
import AgreementObjectDeletionDialog from "components/dialogs/agreementObject/AgreementObjectDeletionDialog";

import CustomClauseGoLiveDialog from "components/dialogs/customClause/CustomClauseGoLiveDialog";
import ConstraintDeletionDialog from "components/dialogs/constraint/ConstraintDeletionDialog";
import ConstraintUnsavedChangesDialog from "components/dialogs/constraint/ConstraintUnsavedChangesDialog";
import ProcessingDialog from "components/dialogs/ProcessingDialog";
import MessageDialog from "components/dialogs/MessageDialog";
import Error404Dialog from "components/dialogs/Error404Dialog";
import Error412Dialog from "components/dialogs/Error412Dialog";
import Error405Dialog from "components/dialogs/Error405Dialog";

import { FontIcon } from "@fluentui/react";
import TemplateCloneFailDialog from "components/dialogs/template/TemplateCloneFailDialog";
import SlotGroupCreationDialog from "components/dialogs/template/SlotGroupCreationDialog";
import DialogActions from "./DialogActions";

const dialogStyles = {
  main: {
    selectors: {
      "@media (min-width: 0px)": {
        minHeight: 0,
      },
    },
  },
};
type DialogInfoMappingType = {
  [key in DialogContentType]: {
    proceedButtonText: string;
    Component: DialogComponentType;
    noCancelButton?: boolean;
    hideActionButtons?: boolean;
    cancelButtonText?: string;
  };
};

const dialogContentTypeMappings: DialogInfoMappingType = {
  [DialogContentType.messageDialog]: {
    proceedButtonText: "Close",
    Component: MessageDialog,
    noCancelButton: true,
  },
  [DialogContentType.error404]: {
    proceedButtonText: "Refresh",
    Component: Error404Dialog,
    noCancelButton: true,
  },
  [DialogContentType.error405]: {
    proceedButtonText: "Refresh",
    Component: Error405Dialog,
    noCancelButton: true,
  },
  [DialogContentType.error412]: {
    proceedButtonText: "Refresh",
    Component: Error412Dialog,
    noCancelButton: true,
  },

  [DialogContentType.constraintDeletion]: {
    proceedButtonText: "Delete",
    Component: ConstraintDeletionDialog,
  },
  [DialogContentType.constraintUnsavedChanges]: {
    proceedButtonText: "Continue",
    Component: ConstraintUnsavedChangesDialog,
  },
  [DialogContentType.customClauseGoLive]: {
    proceedButtonText: "Publish",
    Component: CustomClauseGoLiveDialog,
  },

  [DialogContentType.Copy]: {
    proceedButtonText: "Enable testing",
    Component: AgreementObjectCopyDialog,
  },
  [DialogContentType.GoLive]: {
    proceedButtonText: "Publish",
    Component: AgreementObjectGoLiveDialog,
  },
  [DialogContentType.Withdraw]: {
    proceedButtonText: "Withdraw",
    Component: AgreementObjectWithdrawDialog,
  },
  [DialogContentType.Deletion]: {
    proceedButtonText: "Delete",
    Component: AgreementObjectDeletionDialog,
  },
  [DialogContentType.UnsavedChanges]: {
    proceedButtonText: "Continue",
    Component: AgreementObjectUnsavedChangesDialog,
  },
  [DialogContentType.Processing]: {
    proceedButtonText: "",
    Component: ProcessingDialog,
    noCancelButton: true,
    hideActionButtons: true,
  },

  [DialogContentType.TemplateCloneFail]: {
    proceedButtonText: "Delete draft",
    Component: TemplateCloneFailDialog,
    noCancelButton: true,
  },
  [DialogContentType.SlotGroupCreation]: {
    proceedButtonText: "Move Constraint",
    Component: SlotGroupCreationDialog,
    cancelButtonText: "Leave Constraint"
  },
};

// eslint-disable-next-line
const DialogTitle = ({
  title,
  titleIcon,
  titleIconColor,
}: {
  title: string;
  titleIcon?: string;
  titleIconColor?: string;
}) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    {titleIcon && (
      <FontIcon
        style={{ marginRight: 5, color: titleIconColor }}
        iconName={titleIcon}
      />
    )}
    <span>{title}</span>
  </div>
);

// eslint-disable-next-line
const DialogComponent = () => {
  const { closeDialog } = useDialog();
  const dialogInfo = useSelector((state: RootState) => state.dialog);
  const dialogComponentRef = useRef<IDialogContentComponent>(null);

  const DialogComponentInfo = dialogContentTypeMappings[dialogInfo.type];
  const dialogContentProps: IDialogContentProps = {
    type: DialogType.normal,
    title: (
      <DialogTitle
        title={dialogInfo.title}
        titleIcon={dialogInfo.titleIcon}
        titleIconColor={dialogInfo.titleIconColor}
      />
    ),
    showCloseButton: !DialogComponentInfo.hideActionButtons,

    styles: {
      inner: {
        padding: 0,
        minHeight: DialogComponentInfo.hideActionButtons ? "72px" : "",
      },
    },
  };

  // Need to wrap component ref's function as the ref will not be initialized until rendered
  const onProceed = () => dialogComponentRef.current?.onProceed();
  const onCancel = () => {
    const cancelAction = dialogComponentRef.current?.onCancel || closeDialog;
    cancelAction();
  };

  return (
    <Dialog
      hidden={!dialogInfo.isDialogOpen}
      onDismiss={closeDialog}
      dialogContentProps={dialogContentProps}
      minWidth={500}
      modalProps={{ isBlocking: true, styles: dialogStyles }}
    >
      <div 
        data-automation-id={`dialog-${dialogInfo.type}`}
        style={{ padding: "4px 24px 24px" }}
      >
        <DialogComponentInfo.Component
          ref={dialogComponentRef}
          {...dialogInfo.additionalInfo}
        />
      </div>
     {!DialogComponentInfo.hideActionButtons && <DialogActions
        proceedButtonText={DialogComponentInfo.proceedButtonText}
        cancelButtonText={DialogComponentInfo.cancelButtonText || "Cancel"}
        onProceed={onProceed}
        onCancel={onCancel}
        isProceeding={dialogInfo.isProceeding}
        noCancelButton={DialogComponentInfo.noCancelButton}
      />}
    </Dialog>
  );
};

export default DialogComponent;
