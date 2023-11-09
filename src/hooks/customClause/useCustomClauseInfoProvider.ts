import { useRef } from "react";

import { useCurrentRevisionHandler } from "helpers/revisions";
import {
  ICustomClauseContent,
  ICustomClauseContentInfo,
  ICustomClauseInfo,
  IProvisionedCustomClauseInfo,
} from "models/customClauses";
import {
  useGetCustomClauseQuery,
  useGetContentsQuery,
  useGetRevisionsQuery,
} from "services/customClause";

// Need to create wrapper around useGetContentsQuery() as the returned "cached" result becomes undefined if skip is true
const useGetContents = (
  query: { templateId?: string; clauseId?: string; revisionId?: string },
  queryConditions: { skip: boolean }
) => {
  const cachedContentsRef = useRef<{
    templateId?: string;
    clauseId?: string;
    revisionId?: string;
    contents: ICustomClauseContent[] | undefined;
  }>();
  const { currentData, isFetching } = useGetContentsQuery(
    query,
    queryConditions
  );

  if (currentData) {
    cachedContentsRef.current = {
      ...query,
      contents: currentData,
    };
  }

  const isSameQuery =
    query.templateId === cachedContentsRef.current?.templateId &&
    query.clauseId === cachedContentsRef.current?.clauseId &&
    query.revisionId === cachedContentsRef.current?.revisionId;
  const contents =
    !currentData && isSameQuery
      ? cachedContentsRef.current?.contents
      : currentData;

  return { currentData: contents, isFetching };
};

const useCustomClauseInfoProvider = (
  templateId: string | undefined,
  clauseId: string | undefined,
  initialRevisionId?: string
): IProvisionedCustomClauseInfo => {
  const { currentData: customClause, isFetching: isFetchingCustomClause } =
    useGetCustomClauseQuery(
      {
        templateId,
        id: clauseId,
      },
      {
        skip: !templateId || !clauseId,
      }
    );

  const {
    currentData: revisions,
    isFetching: isFetchingRevisions,
    isUninitialized: isUninitializedRevisions,
  } = useGetRevisionsQuery(
    {
      templateId,
      clauseId,
    },
    {
      skip: !templateId || !clauseId,
    }
  );

  const { currentRevision, isFetchingCurrentRevision, setCurrentRevision } =
    useCurrentRevisionHandler(initialRevisionId, revisions);

  const { currentData: contents, isFetching: isFetchingContents } =
    useGetContents(
      {
        templateId,
        clauseId,
        revisionId: currentRevision?.id,
      },
      {
        skip:
          !templateId ||
          !clauseId ||
          isFetchingRevisions ||
          isFetchingCurrentRevision,
      }
    );

  const hasCustomClauseInfo =
    !!customClause && !!revisions && !isFetchingCurrentRevision;
  const hasCustomClauseContent = !!contents;

  const containsRevisions = !!revisions && revisions.length > 0;

  const isFetchingCurrentRevisionVerify =
    isFetchingRevisions ||
    isUninitializedRevisions ||
    (isFetchingCurrentRevision && containsRevisions);

  const isCustomClauseInfoLoading =
    isFetchingCustomClause || isFetchingCurrentRevisionVerify;

  // const isCustomClauseInfoLoading = isFetchingCustomClause || isFetchingRevisions || isFetchingCurrentRevision;

  const customClauseInfo: ICustomClauseInfo = {
    clause: customClause,
    revisions,
    currentRevision,
    isLoading: isCustomClauseInfoLoading,
    hasData: hasCustomClauseInfo,
  };
  const customClauseContentInfo: ICustomClauseContentInfo = {
    contents,
    isLoading: isFetchingContents,
    hasData: hasCustomClauseContent,
  };

  return {
    clauseInfo: customClauseInfo,
    clauseContentInfo: customClauseContentInfo,
    setCurrentRevision,
  };
};

export default useCustomClauseInfoProvider;
