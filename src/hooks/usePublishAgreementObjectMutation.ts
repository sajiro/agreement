import stringsConst from "consts/strings";
import { AgreementObjectType } from "models/agreements";
import { IRevision } from "models/revisions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  invalidateClauseCache,
  useUpdateRevisionMutation as useUpdateClauseRevisionMutation
} from "services/clause";
import {
  invalidateTemplateCache,
  useUpdateRevisionMutation as useUpdateTemplateRevisionMutation
} from "services/template";
import { is404ErrorForRevision, isMutationCompleted } from "helpers/mutation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import useDialog from "./useDialog";

const publishActionMappings = {
  [AgreementObjectType.clause]: {
    revisionUpdater: useUpdateClauseRevisionMutation,
    cacheInvalidator: invalidateClauseCache
  },
  [AgreementObjectType.template]: {
    revisionUpdater: useUpdateTemplateRevisionMutation,
    cacheInvalidator: invalidateTemplateCache
  }
};

type PublishableObjectTypes = AgreementObjectType.clause|AgreementObjectType.template;
const usePublishAgreementObjectMutation = (objectType: PublishableObjectTypes, objectId: string) => {
  const publishActions = publishActionMappings[objectType];
  const [updateRevision, revisionResult] = publishActions.revisionUpdater();
  const { openError404Dialog, openErrorDialog, openSuccessDialog } = useDialog();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMutationCompleted(revisionResult)) {
      const objectTypeToLowerCase = objectType.toString().toLowerCase();

      if (revisionResult.isSuccess) {
        dispatch(publishActions.cacheInvalidator(objectId));
        openSuccessDialog(stringsConst.dialogs.AgreementObjectGoLiveDialog.success({ objectTypeToLowerCase }));
      } else {
        const errorResult = revisionResult.error as FetchBaseQueryError|undefined;

        // Handle Same Published Date Error
        const errorMessage = (errorResult?.data as { message: string; })?.message;
        if (errorMessage?.includes(stringsConst.dialogs.AgreementObjectGoLiveDialog.invalidEffectiveDateApiError)) {
          openErrorDialog(stringsConst.dialogs.AgreementObjectGoLiveDialog.samePublishedDateError({ objectTypeToLowerCase }));
          return;
        }

        // handle 404 errors separately from other errors
        if (errorResult && errorResult.status === 404) {
          const errorData = errorResult.data as any;

          // handle 404 error where another user has deleted the current revision
          if (is404ErrorForRevision(errorData)) {
            openError404Dialog("revision", objectType, true, objectId);
          }
          // handle 404 error where another user has deleted the current clause/template
          else {
            openError404Dialog(objectTypeToLowerCase, objectType, false);
          }
        } else {
          openErrorDialog(stringsConst.dialogs.AgreementObjectGoLiveDialog.error({ objectTypeToLowerCase }));
        }
      }

      revisionResult.reset();
    }
  }, [objectType, objectId, revisionResult, openError404Dialog, openErrorDialog, openSuccessDialog, dispatch]);

  const publishRevision = async (updateRevisionInfo: { revision: IRevision; clauseId: string; templateId: string; }) => {
    updateRevision(updateRevisionInfo);
  };

  return { publishRevision };
};

export default usePublishAgreementObjectMutation;