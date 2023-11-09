import { useDispatch } from "react-redux";
import icons from "components/shared/Icons";
import { AgreementObjectType } from "models/agreements";
import {
  DialogContentType,
  IDialogContent,
  IError404Content,
  IMessageContent,
  ISlotGroupCreationContent,
  ITemplateCloneFailDialog,
} from "models/dialogs";
import { dialogActions } from "store/dialogSlice";
import { useCallback } from "react";
import stringsConst from "consts/strings";

const useDialog = () => {
  const dispatch = useDispatch();

  const openDialog = useCallback(
    (dialogInfo: IDialogContent & { type: DialogContentType }) => {
      dispatch(dialogActions.setDialog({ isDialogOpen: true, ...dialogInfo }));
    },
    [dispatch]
  );

  const setDialogProceeding = useCallback(
    (isProceeding: boolean) => {
      if (isProceeding) {
        dispatch(dialogActions.startProceeding());
      } else {
        dispatch(dialogActions.endProceeding());
      }
    },
    [dispatch]
  );

  const closeDialog = useCallback(() => {
    dispatch(dialogActions.closeDialog());
  }, [dispatch]);

  const openSuccessDialog = useCallback(
    (message: string) => {
      const messageInfo: IMessageContent = { message };

      openDialog({
        title: stringsConst.dialogs.useDialog.success,
        type: DialogContentType.messageDialog,
        additionalInfo: messageInfo,
      });
    },
    [openDialog]
  );

  const openErrorDialog = useCallback(
    (message: string, subMessages?: string[]) => {
      const messageInfo: IMessageContent = { message, subMessages };

      openDialog({
        title: stringsConst.dialogs.useDialog.error,
        titleIcon: icons.error.iconName,
        titleIconColor: icons.error.color,
        type: DialogContentType.messageDialog,
        additionalInfo: messageInfo,
      });
    },
    [openDialog]
  );

  const openError404Dialog = useCallback(
    (
      targetStr: string,
      targetType: AgreementObjectType,
      isTargetRevision: boolean,
      refreshObjectId?: string // has value only if isTargetRevision is true
    ) => {
      const errorInfo: IError404Content = {
        targetStr,
        targetType,
        isTargetRevision,
        refreshObjectId,
      };

      openDialog({
        title: stringsConst.dialogs.useDialog.missingData,
        titleIcon: icons.error.iconName,
        titleIconColor: icons.error.color,
        type: DialogContentType.error404,
        additionalInfo: errorInfo,
      });
    },
    [openDialog]
  );

  const openProcessingDialog = useCallback(
    (isOpen: boolean) => {
      const { message, title } = stringsConst.dialogs.useDialog.processing;
      const messageInfo: IMessageContent = { message };
      if (isOpen) {
        openDialog({
          title,
          type: DialogContentType.Processing,
          additionalInfo: messageInfo,
        });
      } else {
        closeDialog();
      }
    },
    [openDialog, closeDialog]
  );

  const openCloneFailDialog = useCallback(
    (dialogData: ITemplateCloneFailDialog) => {
      const messageInfo: ITemplateCloneFailDialog = dialogData;
      openDialog({
        title: messageInfo.title,
        titleIcon: icons.error.iconName,
        titleIconColor: icons.error.color,
        type: DialogContentType.TemplateCloneFail,
        additionalInfo: messageInfo,
      });
    },
    [openDialog]
  );

  const openSlotGroupCreationDialog = useCallback(
    (dialogContent: ISlotGroupCreationContent) => {
      openDialog({
        title: stringsConst.dialogs.useDialog.moveConstraints,
        type: DialogContentType.SlotGroupCreation,
        additionalInfo: dialogContent,
      });
    },
    [openDialog]
  );

  return {
    openDialog,
    openSuccessDialog,
    openErrorDialog,
    openError404Dialog,
    setDialogProceeding,
    closeDialog,
    openProcessingDialog,
    openCloneFailDialog,
    openSlotGroupCreationDialog,
  };
};

export default useDialog;
