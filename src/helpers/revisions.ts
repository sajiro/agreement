import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import icons from "components/shared/Icons";
import { IRevision, RevisionStatus } from "models/revisions";

const sortRevisionsByDateDesc = (revisions: any[], dateFieldName: string) => {
  revisions.sort(
    (a, b) =>
      new Date(b[dateFieldName]).getTime() -
      new Date(a[dateFieldName]).getTime()
  );
};

export const getLatestPublishedRevision = (revisions: IRevision[]) => {
  sortRevisionsByDateDesc(revisions, "effectiveDate");
  const currentTime = new Date().getTime();
  const isPublished = (r: IRevision) =>
    r.status === RevisionStatus.Published &&
    new Date(r.effectiveDate).getTime() <= currentTime;
  return revisions.find((r) => isPublished(r));
};

/* eslint-disable no-param-reassign */
export const setRevisionStatuses = (revisions: IRevision[]) => {
  const isAllDraft =
    revisions.length > 0 &&
    revisions.every((r) => r.status === RevisionStatus.Draft);
  const latestPublishedRevision = getLatestPublishedRevision(revisions);
  revisions.forEach((r) => {
    const isPublished = r.status === RevisionStatus.Published;
    const isActive =
      new Date(r.effectiveDate).getTime() <= new Date().getTime();

    if (isAllDraft) r.status = RevisionStatus.Unpublished;
    else if (isPublished && !isActive) r.status = RevisionStatus.Pending;
    else if (
      isPublished &&
      latestPublishedRevision &&
      latestPublishedRevision.id === r.id
    )
      r.status = RevisionStatus.Live;
    else if (
      isPublished &&
      latestPublishedRevision &&
      latestPublishedRevision.id !== r.id
    )
      r.status = RevisionStatus.Old;
  });
};

export const applyRevisionOrderingAndCorrectStatuses = (
  revisions: IRevision[]
) => {
  setRevisionStatuses(revisions);
  sortRevisionsByDateDesc(revisions, "createdDate");
};

export const isDraftRevisionVariant = (
  revisionStatus: RevisionStatus | undefined
) =>
  revisionStatus === RevisionStatus.Draft ||
  revisionStatus === RevisionStatus.Unpublished;

export const isPublishedRevisionVariant = (
  revisionStatus: RevisionStatus | undefined
) =>
  revisionStatus === RevisionStatus.Pending ||
  revisionStatus === RevisionStatus.Published ||
  revisionStatus === RevisionStatus.Live ||
  revisionStatus === RevisionStatus.Old;

export const getMostRecentPublishedVariant = (revisions: IRevision[]) => {
  const revisionsClone = _.cloneDeep(revisions);
  sortRevisionsByDateDesc(revisionsClone, "effectiveDate");
  const latestLiveRevision = revisionsClone.find(
    (r) => r.status === RevisionStatus.Live
  );
  // If latestPublishedRevision is undefined, then that means there is not live revision
  // So get the most recent published revision instead
  return (
    latestLiveRevision ||
    revisionsClone.find((r) => isPublishedRevisionVariant(r.status))
  );
};

// back-end accepts only three status values for UpdateRevision:
//   Draft, Testing, Published
export const getRevisionStatusForUpdate = (
  revisionStatus: RevisionStatus | undefined
) => {
  if (!revisionStatus || isDraftRevisionVariant(revisionStatus)) {
    return RevisionStatus.Draft;
  }

  if (isPublishedRevisionVariant(revisionStatus)) {
    return RevisionStatus.Published;
  }

  // status: Testing
  return revisionStatus;
};

export const isValidPublishDate = (targetPublishDate: Date, revisions: IRevision[]) => {
  const publishDates = revisions.filter(r => isPublishedRevisionVariant(r.status)).map(r => new Date(r.effectiveDate));
  const hasSamePublishedDate = !!publishDates.find(d => d.getTime() === targetPublishDate.getTime()); // publish times are zeroed out, so date time comparison can be used
  return !hasSamePublishedDate;
};

export const revisionStatusTextColors: { [key in RevisionStatus]: string } = {
  [RevisionStatus.Draft]: "#B3480F",
  [RevisionStatus.Unpublished]: "#B3480F",
  [RevisionStatus.Test]: "#005A9E",
  [RevisionStatus.Pending]: "#005A9E",
  [RevisionStatus.Live]: "#107C10",
  [RevisionStatus.Published]: "#107C10",
  [RevisionStatus.Old]: "#323130",
};

export const revisionStatusMenuColors: { [key in RevisionStatus]: string } = {
  [RevisionStatus.Draft]: "#FFF4CE",
  [RevisionStatus.Unpublished]: "#FFF4CE",
  [RevisionStatus.Test]: "#EFF6FC",
  [RevisionStatus.Pending]: "#EFF6FC",
  [RevisionStatus.Live]: "#DFF6DD",
  [RevisionStatus.Published]: "#F3F2F1",
  [RevisionStatus.Old]: "#F3F2F1",
};

export const revisionIconColors: { [key in RevisionStatus]: string } = {
  [RevisionStatus.Draft]: "#797775",
  [RevisionStatus.Unpublished]: "#797775",
  [RevisionStatus.Test]: "#005A9E",
  [RevisionStatus.Pending]: "#005A9E",
  [RevisionStatus.Live]: "#107C10",
  [RevisionStatus.Published]: "#107C10",
  [RevisionStatus.Old]: "#797775",
};

export const revisionIconMapping: { [key in RevisionStatus]: string } = {
  [RevisionStatus.Draft]: icons.pageEdit.iconName!,
  [RevisionStatus.Unpublished]: icons.pageEdit.iconName!,
  [RevisionStatus.Test]: icons.test.iconName!,
  [RevisionStatus.Pending]: icons.clock.iconName!,
  [RevisionStatus.Live]: icons.clock.iconName!,
  [RevisionStatus.Published]: icons.clock.iconName!,
  [RevisionStatus.Old]: icons.archive.iconName!,
};

export const getRevisionStatusStyle = (status: RevisionStatus | undefined) => {
  if (!status) {
    return {};
  }

  return {
    color: revisionStatusTextColors[status],
  };
};

export const getRevisionStatusDisplayName = (
  status: RevisionStatus | undefined
) => {
  if (!status) {
    return "";
  }

  if (status === RevisionStatus.Test) {
    return "Testing";
  }

  return status.toString();
};

// Cloned revisions that the same ID as the cloned source, so need to be able to differentiate between them
export const getRevisionId = (revision: IRevision | undefined) =>
  `${revision?.id}_${revision?.isCloned}`;

export const useCurrentRevisionHandler = (
  initialRevisionId: string | undefined,
  revisions: IRevision[] | undefined
) => {
  const [currentRevisionId, setCurrentRevisionId] = useState<
    string | undefined
  >(undefined);
  const previousRevisionsRef = useRef<IRevision[]>([]);

  const setCurrentRevision = useCallback(
    (revision: IRevision | undefined) => {
      setCurrentRevisionId(revision?.id);
    },
    [setCurrentRevisionId]
  );

  useEffect(() => {
    if (initialRevisionId) {
      setCurrentRevisionId(initialRevisionId);
    }
  }, [initialRevisionId]);

  // reset the current revision when the list of revisions change
  useEffect(() => {
    const areRevisionsSame = _.isEqual(revisions, previousRevisionsRef.current);

    if (revisions && revisions.length > 0 && !areRevisionsSame) {
      // Need to use the optional callback parameter as we need to rely on the current state as well

      const hasNewRevision =
        revisions.length === previousRevisionsRef.current.length + 1 &&
        revisions[1]?.id === previousRevisionsRef.current[0]?.id;

      setCurrentRevisionId((currentRevisionIdAgr) => {
        previousRevisionsRef.current = revisions;

        const isPresent = !!revisions?.find(
          (r) => r.id === currentRevisionIdAgr
        );
        // reset the current revision to the latest (top) item in the list
        // after deleting a revision (previous current no longer exists) or adding a new revision
        const revisionIdToSet =
          isPresent && !hasNewRevision ? currentRevisionIdAgr : revisions[0].id;

        return revisionIdToSet;
      });
    }
  }, [revisions]);

  // Ensures incorrect cached revision is not used if the clause/template revisions are being fetched
  const currentRevision = revisions?.find((r) => r.id === currentRevisionId);
  const isFetchingCurrentRevision = !currentRevision || !currentRevisionId;

  return {
    currentRevision,
    isFetchingCurrentRevision,
    setCurrentRevision,
  };
};
