import { MessageBarType } from "@fluentui/react";
import stringsConst from "consts/strings";
import { getMostRecentPublishedVariant } from "helpers/revisions";
import usePanel from "hooks/usePanel";
import { PanelType } from "models/panel";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useLazyGetRevisionsQuery } from "services/clause";
import { templateEditActions } from "store/TemplateEditSlice";

const useClausePanel = () => {
  const dispatch = useDispatch();
  const { openPanel } = usePanel(PanelType.Clause);
  const [getRevisionsTrigger,,] = useLazyGetRevisionsQuery();

  const openClausePanelAtMostRecentPublishedRevision = useCallback(async (clauseId: string) => {
    const queryResult = await getRevisionsTrigger(clauseId);
    const { data: revisions, isSuccess } = queryResult;
    if (isSuccess) {
      const mostRecentPublishedRevision = getMostRecentPublishedVariant(revisions!);
      openPanel({ clauseId, revisionId: mostRecentPublishedRevision?.id });
      return;
    }

    dispatch(templateEditActions.setMessage({
      message: stringsConst.clausePanel.ClausePanel.getRevisionsError,
      type: MessageBarType.error
    }));
  }, [getRevisionsTrigger]);

  return { openClausePanelAtMostRecentPublishedRevision };
};

export default useClausePanel;