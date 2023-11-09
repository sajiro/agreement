import { hasChanges } from "helpers/forms";
import { AgreementObjectType } from "models/agreements";
import { IClausePanelInfo } from "models/clausePanel";
import { IProvisionedClauseInfo } from "models/clauses";
import { ICustomClausePanelInfo } from "models/customClausePanel";
import { ICustomClause, IProvisionedCustomClauseInfo } from "models/customClauses";
import { PanelType } from "models/panel";
import { IRevision } from "models/revisions";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import useAgreementObjectDialog from "./useAgreementObjectDialog";
import usePanel from "./usePanel";

const useSharedClausePanelController = (
  isCustomClause: boolean,
  clauseInfoProvider: IProvisionedClauseInfo|IProvisionedCustomClauseInfo,
  panelInfo: IClausePanelInfo|ICustomClausePanelInfo
) => {
  const panelType = isCustomClause ? PanelType.CustomClause : PanelType.Clause;
  const { closePanel } = usePanel(panelType);
  const { openUnsavedChangesDialog } = useAgreementObjectDialog();
  const formInfo = useSelector((state: RootState) => isCustomClause ? state.customClausePanelForms : state.clausePanelForms);
  const { propertiesForm, translationsForm, hasSubmitted } = formInfo;

  const hasUnsavedChanges = hasChanges(propertiesForm, translationsForm, panelInfo.editState);

  const { clauseInfo, setCurrentRevision: defaultSetCurrentRevision } = clauseInfoProvider;
  const { clause: currentClause, currentRevision } = clauseInfo;
  const unSavedChangesDialogInfo = useMemo(() => isCustomClause
    ? {
      objectType: AgreementObjectType.customClause,
      id: currentClause?.id || "",
      revisionId: currentRevision?.id || "",
      templateId: (<ICustomClause>currentClause)?.templateId || "",
    }
    : {
      objectType: AgreementObjectType.clause,
      id: currentClause?.id || "",
      revisionId: currentRevision?.id || "",
    }, [clauseInfo]);

  const onClosePanel = useCallback((ignoreUnsavedChanges: boolean) => {
    if (hasUnsavedChanges && !hasSubmitted && !ignoreUnsavedChanges) {
      openUnsavedChangesDialog({ ...unSavedChangesDialogInfo, isRevisionChangeAction: false });
      return;
    }

    closePanel();
  }, [openUnsavedChangesDialog, unSavedChangesDialogInfo, closePanel, hasUnsavedChanges]);

  const setCurrentRevision = useCallback((revision: IRevision) => {
    if (hasUnsavedChanges) {
      openUnsavedChangesDialog({ ...unSavedChangesDialogInfo, revisionId: revision.id, isRevisionChangeAction: true });
      return;
    }

    defaultSetCurrentRevision(revision);
  }, [defaultSetCurrentRevision, unSavedChangesDialogInfo, openUnsavedChangesDialog, hasUnsavedChanges]);

  return { onClosePanel, setCurrentRevision };
};

export default useSharedClausePanelController;