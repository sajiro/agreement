import {
  CommandButton,
  VerticalDivider,
  Text,
  ProgressIndicator,
} from "@fluentui/react";
import { TemplateActionBarShimmer } from "components/loadingSkeletons/TemplateLoadingSkeletons";
import icons from "components/shared/Icons";
import { SharedActionBarWithLoading } from "components/shared/SharedActionBar";
import useRouter from "hooks/useRouter";
import {
  AgreementObjectEditState,
  AgreementObjectType,
} from "models/agreements";
import { ITemplateInfo, ITemplateRevision } from "models/templates";
import customTheme from "helpers/customTheme";
import useTemplateMutationActionTrigger from "hooks/template/mutation/useTemplateMutationActionTrigger";
import { TemplateEditState } from "models/templatePanel";
import SharedNotification from "components/shared/SharedNotification";

export type TemplateEditHeaderProps = {
  templateInfo: ITemplateInfo;
  setCurrentRevision: (revision: ITemplateRevision | undefined) => void;
  isTemplateEditable: boolean;
  isPublishable: boolean;
};
function TemplateEditHeader({
  templateInfo,
  setCurrentRevision,
  isTemplateEditable,
  isPublishable
}: TemplateEditHeaderProps) {
  const { back } = useRouter();
  const { triggerMutation } = useTemplateMutationActionTrigger(templateInfo);

  return (
    <>
      <div style={customTheme.editTemplateHeading}>
        <CommandButton
        data-automation-id="template-back-button"
          style={{ height: "100%", marginRight: 10, marginLeft: 10 }}
          iconProps={icons.back}
          ariaDescription="Template edit back button"
          onClick={back}
        />
        <VerticalDivider />
        <Text
        data-automation-id="templatename"
          style={{ margin: "0px 20px", fontWeight: 500 }}
          variant="mediumPlus"
        >
          {templateInfo.template?.name}
        </Text>
        <SharedActionBarWithLoading
          isLoading={templateInfo.isLoading}
          LoadingSubstitute={TemplateActionBarShimmer}
          objectType={AgreementObjectType.template}
          objectInfo={templateInfo}
          openEditPanel={() => {
            triggerMutation(TemplateEditState.NewRevision);
          }}
          setCurrentRevision={setCurrentRevision}
          editState={AgreementObjectEditState.Default} // ensure edit button is not shown
          disablePublishOverride={!isPublishable} // Disable publish if template doesn't have any slots
          additionalStyles={{
            versionMenuStyles: { height: 48, border: "none" },
            actionBarStyles: { root: { flexGrow: 2 } },
          }}
        />
      </div>
      {!isTemplateEditable && (
        <ProgressIndicator
        ariaValueText="Progress Bar"
          styles={{
            itemProgress: {
              padding: 0,
            },
          }}
        />
      )}
      <SharedNotification />
    </>
  );
}

export default TemplateEditHeader;
