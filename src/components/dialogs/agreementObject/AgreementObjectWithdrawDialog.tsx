import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Text } from "@fluentui/react/lib/Text";
import _ from "lodash";

import { is404ErrorForRevision, isMutationCompleted } from "helpers/mutation";
import useDialog from "hooks/useDialog";
import { AgreementObjectType } from "models/agreements";
import {
  IDialogContentComponent,
  IRevisionUpdateDialogContent,
} from "models/dialogs";
import { RevisionStatus } from "models/revisions";
import {
  invalidateClauseCache,
  useLazyGetRevisionsQuery,
  useLazyGetUsedInTemplateQuery,
  useUpdateRevisionMutation as useUpdateClauseRevisionMutation,
} from "services/clause";
import {
  invalidateTemplateCache,
  useUpdateRevisionMutation as useUpdateTemplateRevisionMutation,
} from "services/template";
import stringsConst from "consts/strings";
import { isPublishedRevisionVariant } from "helpers/revisions";

const dialogSectionStyle: CSSProperties = {
  marginBottom: 16,
};

const useClauseValidator = () => {
  const [getClauseRevisionsTrigger,,]= useLazyGetRevisionsQuery();
  const [getClauseUsedInTemplateTrigger,,] = useLazyGetUsedInTemplateQuery();

  const validate = async (objectId: string) => {
    const errorInfo: { message: string|undefined; subMessages: string[]|undefined } = { message: undefined, subMessages: undefined };
    const { clauseRevisionsRetrievalError, usedInTemplatesRetrievalError, activeClauseError } = stringsConst.dialogs.AgreementObjectWithdrawDialog;

    const { data: clauseRevisions, error: clauseRevisionsError } = await getClauseRevisionsTrigger(objectId);
    const { data: usedInTemplates, error: usedInTemplatesError } = await getClauseUsedInTemplateTrigger(objectId);
    const hasMultiplePublishedRevisions = clauseRevisionsError ? false : clauseRevisions!.filter(r => isPublishedRevisionVariant(r.status)).length > 1;
    const isUsedInTemplates = usedInTemplatesError ? true : (usedInTemplates && usedInTemplates.length > 0); // treat retrieval error as clause being used in template(s), to block withdraw
    const isValid = !isUsedInTemplates || hasMultiplePublishedRevisions;
    
    errorInfo.message = clauseRevisionsError ? clauseRevisionsRetrievalError : errorInfo.message;
    errorInfo.message = usedInTemplatesError ? usedInTemplatesRetrievalError : errorInfo.message;
    errorInfo.message = !isValid ? activeClauseError : errorInfo.message;
    errorInfo.subMessages = isUsedInTemplates ? usedInTemplates?.map(t => t.name) : undefined;

    return { isValid, errorInfo };
  };

  return { validate };
};

const withdrawActionMappings = {
  [AgreementObjectType.clause]: {
    revisionUpdater: useUpdateClauseRevisionMutation,
    cacheInvalidator: invalidateClauseCache,
    validator: useClauseValidator
  },
  [AgreementObjectType.template]: {
    revisionUpdater: useUpdateTemplateRevisionMutation,
    cacheInvalidator: invalidateTemplateCache,
    validator: () => ({ validate: () => Promise.resolve({ isValid: true, errorInfo: { message: undefined, subMessages: undefined } }) }) // Template requires no extra validation
  }
};

/**
 * Withdraw (UnPublish) dialog is shared by Clauses and Templates
 * Both 'Published' and 'Testing' clauses/templates can be withdrawn
 */
const AgreementObjectWithdrawDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const withdrawContent = props as IRevisionUpdateDialogContent;
    const objectType = withdrawContent.objectType as AgreementObjectType.clause|AgreementObjectType.template; // Only used for clause & template revisions
    const objectTypeToLowerCase = objectType.toString().toLowerCase();
    const withdrawActions = withdrawActionMappings[objectType];
    
    const isPending = withdrawContent.revision.status === RevisionStatus.Pending;
    const pendingStatusMessage = stringsConst.dialogs.AgreementObjectWithdrawDialog.proceedIsPending({ objectTypeToLowerCase });
    const nonPendingStatusMessage = stringsConst.dialogs.AgreementObjectWithdrawDialog.proceed({ objectTypeToLowerCase });
    const dialogMessage = isPending ? pendingStatusMessage : nonPendingStatusMessage;

    const dispatch = useDispatch();
    const { openError404Dialog, openErrorDialog, openSuccessDialog } = useDialog();
    const [updateRevision, revisionResult] = withdrawActions.revisionUpdater();
    const { validate } = withdrawActions.validator();

    useEffect(() => {
      if (isMutationCompleted(revisionResult)) {
        if (revisionResult.isSuccess) {
          dispatch(withdrawActions.cacheInvalidator(withdrawContent.id));
          openSuccessDialog(stringsConst.dialogs.AgreementObjectWithdrawDialog.success({ objectTypeToLowerCase }));
        } else {
          const errorResult = revisionResult.error as FetchBaseQueryError | undefined;

          // handle 404 errors separately from other errors
          if (errorResult && errorResult.status === 404) {
            const errorData = errorResult.data as any;

            // handle 404 error where another user has deleted the current revision
            if (is404ErrorForRevision(errorData)) {
              openError404Dialog("revision", withdrawContent.objectType, true, withdrawContent.id);
            }
            // handle 404 error where another user has deleted the current clause/template
            else {
              openError404Dialog(objectTypeToLowerCase, withdrawContent.objectType, false);
            }
          } else {
            openErrorDialog(stringsConst.dialogs.AgreementObjectWithdrawDialog.error({ objectTypeToLowerCase }));
          }
        }

        revisionResult.reset();
      }
    }, [revisionResult, withdrawContent]);

    useImperativeHandle(ref, () => ({
      onProceed: async () => {
        const updateRevisionInfo = _.cloneDeep(withdrawContent.revision);
        updateRevisionInfo.status = RevisionStatus.Draft;
        const payload: any = { revision: updateRevisionInfo };
        payload.clauseId = withdrawContent.id;
        payload.templateId = withdrawContent.id;

        const { isValid, errorInfo } = await validate(withdrawContent.id);
        if (isValid) {
          updateRevision(payload);
          return;
        }
  
        openErrorDialog(errorInfo.message!, errorInfo.subMessages);
      },
    }));

    return (
      <>
        <Text style={dialogSectionStyle} block>{dialogMessage}</Text>
        <Text data-automation-id="withdraw-ObjectName" block>
          <span style={{ fontWeight: 600 }}>{objectType}</span>
          <br />
          {withdrawContent.objectName}
        </Text>
      </>
    );
  }
);

export default AgreementObjectWithdrawDialog;
