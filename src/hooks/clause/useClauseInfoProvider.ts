import { useRef } from "react";

import { useCurrentRevisionHandler } from "helpers/revisions";
import useBusinessUnit from "hooks/useBusinessUnit";
import useClauseLabels from "hooks/clause/useClauseLabels";
import { IClauseLabelInfo } from "models/clauseLabels";
import {
  IClauseContent,
  IClauseContentInfo,
  IClauseInfo,
  IClausePlaceHolderContentInfo,
  IProvisionedClauseInfo,
} from "models/clauses";
import {
  useGetClauseQuery,
  useGetContentsQuery,
  useGetRevisionsQuery,
  useGetContentPlaceholdersQuery,
} from "services/clause";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

// Need to create wrapper around useGetContentsQuery() as the returned "cached" result becomes undefined if skip is true
const useGetContents = (
  query: { id?: string; revisionId?: string },
  queryConditions: { skip: boolean }
) => {
  const cachedContentsRef = useRef<{
    id?: string;
    revisionId?: string;
    contents: IClauseContent[] | undefined;
  }>();
  const { currentData, isFetching } = useGetContentsQuery(
    query,
    queryConditions
  );
  if (currentData) {
    cachedContentsRef.current = {
      id: query.id,
      revisionId: query.revisionId,
      contents: currentData,
    };
  }

  const isSameQuery =
    query.id === cachedContentsRef.current?.id &&
    query.revisionId === cachedContentsRef.current?.revisionId;
  const contents =
    !currentData && isSameQuery
      ? cachedContentsRef.current?.contents
      : currentData;
  return { currentData: contents, isFetching };
};
const useGetContentPlaceholders = (
  query: { id?: string; revisionId?: string; language?: string },
  queryConditions: { skip: boolean }
) => {
  const cachedContentsRef = useRef<{
    id?: string;
    revisionId?: string;
    content: IClauseContent | undefined;
  }>();
  const { currentData, isFetching } = useGetContentPlaceholdersQuery(
    query,
    queryConditions
  );
  if (currentData) {
    cachedContentsRef.current = {
      id: query.id,
      revisionId: query.revisionId,
      content: currentData,
    };
  }
  const isSameQuery =
    query.id === cachedContentsRef.current?.id &&
    query.revisionId === cachedContentsRef.current?.revisionId;
  const contents =
    !currentData && isSameQuery
      ? cachedContentsRef.current?.content
      : currentData;
  return { currentData: contents, isFetching };
};

const useClauseInfoProvider = (
  clauseId: string | undefined,
  initialRevisionId?: string
): IProvisionedClauseInfo => {
  const {
    currentData: clause,
    error: clauseError,
    isFetching: isFetchingClauses,
  } = useGetClauseQuery(clauseId, { skip: !clauseId });

  const isClause404Error =
    !!clauseError && (clauseError as FetchBaseQueryError).status === 404;

  const {
    currentData: revisions,
    isFetching: isFetchingRevisions,
    isUninitialized: isUninitializedRevisions,
  } = useGetRevisionsQuery(clauseId, { skip: !clauseId || isClause404Error });

  const { currentRevision, isFetchingCurrentRevision, setCurrentRevision } =
    useCurrentRevisionHandler(initialRevisionId, revisions);

  const { currentData: contents, isFetching: isFetchingContents } =
    useGetContents(
      { id: clauseId, revisionId: currentRevision?.id },
      {
        skip:
          !clauseId ||
          isFetchingRevisions ||
          isFetchingCurrentRevision ||
          isClause404Error,
      }
    );

  let language: string = "en-us";
  if (contents && contents.length > 0) {
    const containsUsLanguage = contents.some(
      (item) => item.language === "en-us"
    );
    if (!containsUsLanguage) {
      language = contents[0].language;
    }
  }

  const {
    currentData: placeholderContents,
    isFetching: isFetchingplaceholderContents,
  } = useGetContentPlaceholders(
    { id: clauseId, revisionId: currentRevision?.id, language },
    {
      skip:
        !clauseId ||
        isFetchingRevisions ||
        isFetchingCurrentRevision ||
        isClause404Error,
    }
  );

  // "PS Category" clause labels are only used by "Professional Services" business unit
  const { isProfessionalServices } = useBusinessUnit();
  const isBusinessUnitPS = isProfessionalServices();

  const { allPsCategoryLabels, isFetchingPsCategoryLabels, getClauseLabels } =
    useClauseLabels(isBusinessUnitPS, isClause404Error);

  const { clauseLabels, isFetchingClauseLabels } = getClauseLabels(
    isBusinessUnitPS,
    clauseId,
    isClause404Error
  );

  const isFetchingLabels = isFetchingPsCategoryLabels || isFetchingClauseLabels;
  const labelInfo: IClauseLabelInfo | undefined =
    !isFetchingLabels && allPsCategoryLabels && clauseLabels
      ? {
          psCategoryLabels: allPsCategoryLabels,
          clauseLabels,
        }
      : undefined;

  const hasClauseInfo = !!clause && !!revisions && !isFetchingCurrentRevision;
  const hasClauseContent = !!contents;

  const containsRevisions = !!revisions && revisions.length > 0;

  const isFetchingCurrentRevisionVerify =
    isFetchingRevisions ||
    isUninitializedRevisions ||
    (isFetchingCurrentRevision && containsRevisions);

  const isClauseInfoLoading =
    isFetchingClauses || isFetchingLabels || isFetchingCurrentRevisionVerify;

  // const isClauseInfoLoading =
  //   isFetchingClauses || isFetchingRevisions || isFetchingCurrentRevision;

  const clauseInfo: IClauseInfo = {
    clause,
    revisions,
    currentRevision,
    psCategoryLabelInfo: labelInfo,
    isLoading: isClauseInfoLoading,
    hasData: hasClauseInfo,
  };
  const clauseContentInfo: IClauseContentInfo = {
    contents,
    isLoading: isFetchingContents,
    hasData: hasClauseContent,
  };
  const clausePlaceholderContent: IClausePlaceHolderContentInfo = {
    content: placeholderContents,
    isLoading: isFetchingplaceholderContents,
    hasData: hasClauseContent,
  };

  return {
    clauseInfo,
    clauseContentInfo,
    setCurrentRevision,
    clausePlaceholderContent,
    isClause404Error,
  };
};

export default useClauseInfoProvider;
