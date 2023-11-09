import { IAgreementObjectInfo } from "models/agreements";
import { IProvisionedTemplateInfo, ITemplateRevision } from "models/templates";
import { useGetRevisionsQuery, useGetTemplateQuery } from "services/template";
import { useCurrentRevisionHandler } from "helpers/revisions";
import { useGetSlotTreeQuery } from "services/slot";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useGetPublishedClausesQuery } from "services/clause";
import { useGetAllConstraintsForEditConstraintQuery } from "services/constraint";
import { getAllNonExistingConstraints, getAllNonPublishedClauses } from "helpers/slot";
import { useEffect } from "react";
import useDialog from "hooks/useDialog";

const useTemplateRevisionValidator = (templateId: string|undefined, revisionId: string|undefined) => {
  const slotTreeQuery = templateId && revisionId ? { templateId, revisionId } : skipToken;
  const { currentData: slotTree, isLoading: isLoadingSlotTree } = useGetSlotTreeQuery(slotTreeQuery);
  const { currentData: publishedClauses, isLoading: isLoadingPublishedClauses } = useGetPublishedClausesQuery();
  const { currentData: constraints, isLoading: isLoadingConstraints } = useGetAllConstraintsForEditConstraintQuery();

  const isLoading = isLoadingSlotTree || isLoadingPublishedClauses || isLoadingConstraints;
  const slots = slotTree ? Object.values(slotTree.nodes) : [];
  const nonPublishedClauses = getAllNonPublishedClauses(slots, publishedClauses || []);
  const nonExistingConstraints = getAllNonExistingConstraints(slots, constraints || []);

  // Assumes clauses can only be added if they are published, so if clause is not in published list it doesn't exist
  return { isLoading, nonExistingConstraints, hasSlots: slots.length > 0, nonExistingClauses: nonPublishedClauses };
};

const useTemplateInfoProvider = (
  templateId: string | undefined,
  validate: boolean,
  initialRevisionId?: string
): IProvisionedTemplateInfo => {
  const { currentData: template, isFetching: isFetchingTemplates } =
    useGetTemplateQuery(templateId, { skip: !templateId });
  const {
    currentData: revisions,
    isFetching: isFetchingRevisions,
    isUninitialized: isUninitializedRevisions,
  } = useGetRevisionsQuery(templateId, { skip: !templateId });
  const { currentRevision, isFetchingCurrentRevision, setCurrentRevision } =
    useCurrentRevisionHandler(initialRevisionId, revisions);

  const { isLoading, hasSlots, nonExistingClauses, nonExistingConstraints } = useTemplateRevisionValidator(templateId, currentRevision?.id);
  const { openErrorDialog } = useDialog();

  useEffect(() => {
    if (validate && !isLoading && (nonExistingClauses.length > 0 || nonExistingConstraints.length > 0)) {
      const nonExistingClauseMessages = nonExistingClauses.map(c => `Clause: ${c.partName}`);
      const nonExistingConstraintMessages = nonExistingConstraints.map(c => `Constraint: ${c.key}`);
      openErrorDialog(
        "The Template contains the following non-existing clause(s)/constraint(s).",
        [...nonExistingClauseMessages, ...nonExistingConstraintMessages]
      );
    }
  }, [validate, nonExistingClauses, nonExistingConstraints, openErrorDialog]);

  const hasTemplateInfo = !!template && !!revisions && !isFetchingCurrentRevision;
  const isPublishable = hasSlots && nonExistingClauses.length === 0 && nonExistingConstraints.length === 0;
  const containsRevisions = !!revisions && revisions.length > 0;

  const isFetchingCurrentRevisionVerify =
    isFetchingRevisions ||
    isUninitializedRevisions ||
    (isFetchingCurrentRevision && containsRevisions);

  const isTemplateInfoLoading =
    isFetchingTemplates || isFetchingCurrentRevisionVerify;

  const templateInfo: IAgreementObjectInfo = {
    template,
    revisions,
    currentRevision: currentRevision as ITemplateRevision,
    isLoading: isTemplateInfoLoading,
    hasData: hasTemplateInfo,
  };

  return {
    templateInfo,
    setCurrentRevision,
    isPublishable
  };
};

export default useTemplateInfoProvider;
