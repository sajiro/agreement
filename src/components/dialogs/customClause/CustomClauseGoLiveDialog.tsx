/* eslint-disable no-nested-ternary */
import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useDispatch } from "react-redux";
import { Text } from "@fluentui/react/lib/Text";
import _ from "lodash";

import { isMutationCompleted } from "helpers/mutation";
import useDialog from "hooks/useDialog";
import {
  IDialogContentComponent,
  IRevisionUpdateDialogContent,
} from "models/dialogs";
import { RevisionStatus } from "models/revisions";
import {
  invalidateCustomClauseCache,
  useUpdateRevisionMutation,
} from "services/customClause";
import stringsConst from "consts/strings";
import { getAsZeroedOutUtcDate } from "helpers/dates";

const dialogSectionStyle: CSSProperties = {
  marginBottom: 16,
};

const CustomClauseGoLiveDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const dispatch = useDispatch();
    const { openErrorDialog, openSuccessDialog } = useDialog();

    const [updateRevision, revisionResult] = useUpdateRevisionMutation();
    const goLiveContent = props as IRevisionUpdateDialogContent;

    useEffect(() => {
      if (isMutationCompleted(revisionResult)) {
        if (revisionResult.isSuccess) {
          dispatch(invalidateCustomClauseCache(goLiveContent.id));
          openSuccessDialog(
            stringsConst.dialogs.CustomClauseGoLiveDialog.success
          );
        } else {
          openErrorDialog(stringsConst.dialogs.CustomClauseGoLiveDialog.error);
        }

        revisionResult.reset();
      }
    }, [goLiveContent, revisionResult]);

    useImperativeHandle(ref, () => ({
      onProceed: () => {
        const updateRevisionInfo = _.cloneDeep(goLiveContent.revision);
        const currentDate = getAsZeroedOutUtcDate(new Date());

        updateRevisionInfo.status = RevisionStatus.Published;
        updateRevisionInfo.effectiveDate = currentDate.toISOString();

        const payload: any = {
          templateId: goLiveContent.templateId,
          clauseId: goLiveContent.id,
          revision: updateRevisionInfo,
        };
        updateRevision(payload);
      },
    }));

    return (
      <>
        <Text style={dialogSectionStyle} block>
          {stringsConst.dialogs.CustomClauseGoLiveDialog.proceed}
        </Text>
        <Text style={dialogSectionStyle} block>
          <span style={{ fontWeight: 600 }}>Custom clause</span>
          <br />
          {goLiveContent.objectName}
        </Text>
        <Text style={dialogSectionStyle} block>
          <span style={{ fontWeight: 600 }}>Template</span>
          <br />
          {goLiveContent.templateName}
        </Text>
        <Text block>
          <span style={{ fontWeight: 600 }}>ID</span>
          <br />
          {goLiveContent.id}
        </Text>
      </>
    );
  }
);

export default CustomClauseGoLiveDialog;
