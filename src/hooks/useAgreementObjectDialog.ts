import {
  DialogContentType,
  IDeletionContent,
  IRevisionUpdateDialogContent,
  IUnsavedChangesContent,
} from "models/dialogs";
import useDialog from "./useDialog";

// Keys need to be strings to avoid having to define for all the enum values
const updateRevisionTitleMapping = {
  [DialogContentType.Copy.toString()]: "Make available for testing?",
  [DialogContentType.GoLive.toString()]: "Go live in production",
  [DialogContentType.customClauseGoLive.toString()]: "Go live in production",
  [DialogContentType.Withdraw.toString()]: "Withdraw and revert to draft?",
};

const useAgreementObjectDialog = () => {
  const { openDialog } = useDialog();

  const openUnsavedChangesDialog = (
    unsavedChangesInfo: IUnsavedChangesContent
  ) => {
    openDialog({
      title: "Unsaved changes",
      type: DialogContentType.UnsavedChanges,
      additionalInfo: unsavedChangesInfo,
    });
  };

  const openDeletionDialog = (
    deletionInfo: { title: string } & IDeletionContent
  ) => {
    const { title, ...additionalDeletionInfo } = deletionInfo;

    openDialog({
      title,
      type: DialogContentType.Deletion,
      additionalInfo: additionalDeletionInfo,
    });
  };

  const openUpdateRevisionDialog = (
    updateRevisionInfo: {
      type: DialogContentType;
    } & IRevisionUpdateDialogContent
  ) => {
    const { type, ...additionalUpdateInfo } = updateRevisionInfo;
    const title = updateRevisionTitleMapping[type.toString()];

    openDialog({
      title,
      type,
      additionalInfo: additionalUpdateInfo,
    });
  };

  return {
    openUnsavedChangesDialog,
    openDeletionDialog,
    openUpdateRevisionDialog,
  };
};

export default useAgreementObjectDialog;
