import {
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
  useUpdateRevisionMutation as useUpdateClauseRevisionMutation,
} from "services/clause";
import {
  invalidateTemplateCache,
  useUpdateRevisionMutation as useUpdateTemplateRevisionMutation,
} from "services/template";
import { useTrackingContext } from "components/shared/TrackingContext";
import stringsConst from "consts/strings";
import { getAsZeroedOutUtcDate } from "helpers/dates";

/**
 * Copy (Test) dialog is shared by Clauses and Templates
 */
const AgreementObjectCopyDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const dispatch = useDispatch();
    const { openError404Dialog, openErrorDialog, openSuccessDialog } =
      useDialog();
    const { trackEvent } = useTrackingContext();

    const copyContent = props as IRevisionUpdateDialogContent;
    const objectType = copyContent.objectType.toString();
    const objectTypeToLowerCase = objectType.toLowerCase();

    const isClause = objectType === AgreementObjectType.clause;
    const isTemplate = objectType === AgreementObjectType.template;

    // eslint-disable-next-line
    const [updateRevision, revisionResult] = isClause
      ? useUpdateClauseRevisionMutation()
      : useUpdateTemplateRevisionMutation();

    useEffect(() => {
      if (isMutationCompleted(revisionResult)) {
        if (revisionResult.isSuccess) {
          if (isClause) {
            trackEvent("test Clause Dialog");
            dispatch(invalidateClauseCache(copyContent.id));
          } else if (isTemplate) {
            trackEvent("test Template Dialog");
            dispatch(invalidateTemplateCache(copyContent.id));
          }

          openSuccessDialog(
            stringsConst.dialogs.AgreementObjectCopyDialog.success({
              objectTypeToLowerCase,
            })
          );
        } else {
          const errorResult = revisionResult.error as
            | FetchBaseQueryError
            | undefined;

          // handle 404 errors separately from other errors
          if (errorResult && errorResult.status === 404) {
            const errorData = errorResult.data as any;

            // handle 404 error where another user has deleted the current revision
            if (is404ErrorForRevision(errorData)) {
              openError404Dialog(
                "revision",
                copyContent.objectType,
                true,
                copyContent.id
              );
            }
            // handle 404 error where another user has deleted the current clause/template
            else {
              openError404Dialog(
                objectTypeToLowerCase,
                copyContent.objectType,
                false
              );
            }
          } else {
            openErrorDialog(
              stringsConst.dialogs.AgreementObjectCopyDialog.error({
                objectTypeToLowerCase,
              })
            );
          }
        }

        revisionResult.reset();
      }
    }, [copyContent, revisionResult]);

    useImperativeHandle(ref, () => ({
      onProceed: () => {
        const updateRevisionInfo = _.cloneDeep(copyContent.revision);
        const currentDate = getAsZeroedOutUtcDate(new Date());
        updateRevisionInfo.effectiveDate = currentDate.toISOString();
        updateRevisionInfo.status = RevisionStatus.Test;

        const payload: any = { revision: updateRevisionInfo };
        if (isClause) {
          payload.clauseId = copyContent.id;
        } else if (isTemplate) {
          payload.templateId = copyContent.id;
        }

        updateRevision(payload);
      },
    }));

    return (
      <Text 
        data-automation-id="testObject-instruction"
        block
      >
        {stringsConst.dialogs.AgreementObjectCopyDialog.proceed({
          objectTypeToLowerCase,
        })}
      </Text>
    );
  }
);

export default AgreementObjectCopyDialog;
