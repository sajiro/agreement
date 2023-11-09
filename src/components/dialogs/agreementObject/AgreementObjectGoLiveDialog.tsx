import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { DatePicker } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import _ from "lodash";
import { AgreementObjectType } from "models/agreements";
import {
  IDialogContentComponent,
  IRevisionUpdateDialogContent,
} from "models/dialogs";
import { RevisionStatus } from "models/revisions";
import stringsConst from "consts/strings";
import { FormatDate, getAsZeroedOutUtcDate } from "helpers/dates";
import usePublishAgreementObjectMutation from "hooks/usePublishAgreementObjectMutation";

const dialogSectionStyle: CSSProperties = {
  marginBottom: 16,
};

const getMinimumPublishDate = (today: Date) => {
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 2);

  return minDate;
};

/**
 * GoLive (Publish) dialog is shared by Clauses and Templates
 */
const AgreementObjectGoLiveDialog = forwardRef(
  (props: any, ref: ForwardedRef<IDialogContentComponent>) => {
    const today = new Date();
    const minDate = getMinimumPublishDate(today);
    const [selectedDate, setSelectedDate] = useState<Date>(minDate);

    const goLiveContent = props as IRevisionUpdateDialogContent;
    const objectType = goLiveContent.objectType as AgreementObjectType.clause|AgreementObjectType.template; // Only used for clause & template revisions
    const { publishRevision } = usePublishAgreementObjectMutation(objectType, goLiveContent.id);

    useImperativeHandle(ref, () => ({
      onProceed: () => {
        const updateRevisionInfo = _.cloneDeep(goLiveContent.revision);
        const publishDate = getAsZeroedOutUtcDate(selectedDate);
        updateRevisionInfo.effectiveDate = publishDate.toISOString();
        updateRevisionInfo.status = RevisionStatus.Published;

        const payload = { revision: updateRevisionInfo, clauseId: goLiveContent.id, templateId: goLiveContent.id };
        publishRevision(payload);
      },
    }));

    const onDateSelected = (date: Date | null | undefined) => {
      if (date) {
        setSelectedDate(date);
      }
    };

    return (
      <>
        <Text style={dialogSectionStyle} block>
          {stringsConst.dialogs.AgreementObjectGoLiveDialog.proceed}
        </Text>
        <Text
          data-automation-id="goLive-ObjectName"
          style={dialogSectionStyle} block
        >
          <span style={{ fontWeight: 600 }}>{objectType.toString()}</span>
          <br />
          {goLiveContent.objectName}
        </Text>
        <DatePicker
          data-automation-id="goLiveDatePicker"
          label="Go live date"
          today={today}
          minDate={minDate}
          value={selectedDate}
          showGoToToday={false}
          onSelectDate={onDateSelected}
          formatDate={(date: Date|undefined) => date ? FormatDate(date, "ddd, MMM DD, YYYY") : ""}
        />
      </>
    );
  }
);

export default AgreementObjectGoLiveDialog;
