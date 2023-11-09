import useTemplateInfoProvider from "hooks/template/useTemplateInfoProvider";
import { IAgreementObjectId } from "models/agreements";
import useRouter from "hooks/useRouter";
import { useEffect } from "react";
import { routeDefinitions } from "router";
import { useGetAllConstraints } from "services/constraint";
import TemplateEditHeader from "./TemplateEditHeader";
import TemplateEditDeleteOrphan from "./TemplateEditDeleteOrphan";
import TemplateEditPivot from "./TemplateEditPivot";

function TemplateEdit({ templateId, revisionId }: IAgreementObjectId) {
  const { updateRoute } = useRouter();
  const { templateInfo, setCurrentRevision, isPublishable } =
    useTemplateInfoProvider(templateId, true, revisionId);
  const {
    isLoading: isLoadingConstraintValues,
    isFetching: isFetchingConstraintValues,
  } = useGetAllConstraints();
  const isConstraintValuesLoaded =
    !isLoadingConstraintValues && !isFetchingConstraintValues;
  const isTemplateEditable = templateInfo.hasData && isConstraintValuesLoaded;
  const hasNoRevisions =
    !templateInfo.isLoading &&
    !templateInfo?.currentRevision?.id &&
    templateInfo.template;
  const selectedTemplateId = templateInfo.template?.id;
  const selectedRevisionId = templateInfo.currentRevision?.id;

  useEffect(() => {
    if (selectedTemplateId && selectedRevisionId) {
      updateRoute(
        routeDefinitions.TemplateEdit.getRouteInfo({
          templateId: selectedTemplateId,
          revisionId: selectedRevisionId,
        })
      );
    }
  }, [selectedTemplateId, selectedRevisionId, updateRoute]);

  if (hasNoRevisions) {
    return (
      <TemplateEditDeleteOrphan
        name={templateInfo.template!.name}
        id={templateId!}
      />
    );
  }

  return (
    <>
      <TemplateEditHeader
        templateInfo={templateInfo}
        setCurrentRevision={setCurrentRevision}
        isTemplateEditable={isTemplateEditable}
        isPublishable={isPublishable}
      />
      {isTemplateEditable && <TemplateEditPivot templateInfo={templateInfo} />}
    </>
  );
}

export default TemplateEdit;
