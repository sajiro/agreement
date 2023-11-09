import { TitleShimmer } from "components/loadingSkeletons/GeneralLoadingSkeletons";
import {
  TemplateActionBarShimmer,
  TemplatePropertiesViewShimmer,
} from "components/loadingSkeletons/TemplateLoadingSkeletons";
import InfoPageTitle, {
  InfoPageTitleWithLoading,
} from "components/shared/InfoPageTitle";
import NoItemSelectedDisplay from "components/shared/NoItemSelectedDisplay";
import { SharedActionBarWithLoading } from "components/shared/SharedActionBar";
import { TemplatePropertiesViewWithLoading } from "components/template/TemplatePropertiesView";

import useTemplateInfoProvider from "hooks/template/useTemplateInfoProvider";
import useRouter from "hooks/useRouter";
import { routeDefinitions } from "router";
import { AgreementObjectType, IAgreementObjectId } from "models/agreements";
import DeleteOrphan from "components/shared/DeleteOrphan";
import useTemplateMutationActionTrigger from "hooks/template/mutation/useTemplateMutationActionTrigger";
import { TemplateEditState } from "models/templatePanel";

// eslint-disable-next-line react/function-component-definition
const TemplateInfo = ({
  templateId,
  isNothingSelected,
}: IAgreementObjectId) => {
  const { templateInfo, setCurrentRevision, isPublishable } =
    useTemplateInfoProvider(templateId, false);
  const { goToRoute } = useRouter();

  const { triggerMutation } = useTemplateMutationActionTrigger(templateInfo);

  const gotoTemplateEditor = (
    editTemplateId: string | undefined,
    editRevisionId: string | undefined,
    editState?: TemplateEditState
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    editState === TemplateEditState.NewRevision
      ? triggerMutation(editState)
      : goToRoute(
          routeDefinitions.TemplateEdit.getRouteInfo({
            templateId: editTemplateId,
            revisionId: editRevisionId,
            isNothingSelected: !editTemplateId && !editRevisionId,
          })
        );
  };

  if (
    !templateInfo.isLoading &&
    !templateInfo?.currentRevision?.id &&
    templateInfo.template
  ) {
    return (
      <>
        <InfoPageTitle title={templateInfo?.template?.name} />
        <DeleteOrphan
          objectType={AgreementObjectType.template}
          id={templateId!}
        />
      </>
    );
  }

  return (
    <>
      {isNothingSelected && <NoItemSelectedDisplay itemType="template" />}
      {!isNothingSelected && (
        <>
          <InfoPageTitleWithLoading
            isLoading={templateInfo.isLoading}
            LoadingSubstitute={TitleShimmer}
            title={templateInfo?.template?.name}
          />
          <SharedActionBarWithLoading
            isLoading={templateInfo.isLoading}
            LoadingSubstitute={TemplateActionBarShimmer}
            objectType={AgreementObjectType.template}
            objectInfo={templateInfo}
            openEditPanel={gotoTemplateEditor}
            setCurrentRevision={setCurrentRevision}
            disablePublishOverride={!isPublishable}
          />
          <TemplatePropertiesViewWithLoading
            isLoading={templateInfo.isLoading}
            LoadingSubstitute={TemplatePropertiesViewShimmer}
            templateInfo={templateInfo}
          />
        </>
      )}
    </>
  );
};

export default TemplateInfo;
