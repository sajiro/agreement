import { useGetContentsQuery, useGetRevisionsQuery } from "services/clause";
import { getMostRecentPublishedVariant } from "helpers/revisions";

const useTranslationInfoProvider = (partId: string): any => {
  const { data: revisions, isSuccess } = useGetRevisionsQuery(partId, {
    skip: !partId,
  });
  
  // need latest published revision
  const latestPublishRevision = getMostRecentPublishedVariant(revisions || []);
  const { data: contents, isSuccess: contentSuccess } = useGetContentsQuery(
    {
      id: partId,
      revisionId: latestPublishRevision?.id,
    },
    { skip: !isSuccess || !latestPublishRevision }
  );

  return {
    data: contents,
    isSuccess: contentSuccess,
  };
};

export default useTranslationInfoProvider;
