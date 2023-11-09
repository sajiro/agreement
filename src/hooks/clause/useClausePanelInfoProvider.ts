import _ from "lodash";

import useBusinessUnit from "hooks/useBusinessUnit";
import usePanel from "hooks/usePanel";
import { AgreementObjectEditState } from "models/agreements";
import { IClausePanelInfo } from "models/clausePanel";
import {
  IClause,
  IClauseContentInfo,
  IClauseInfo,
  IClauseRevision,
  IProvisionedClauseInfo,
} from "models/clauses";
import { PanelType } from "models/panel";
import { IRevision, RevisionStatus } from "models/revisions";
import useClauseInfoProvider from "./useClauseInfoProvider";
import useClauseLabels from "./useClauseLabels";

const useNewClauseInfoProvider = (): IProvisionedClauseInfo => {

  // "PS Category" clause labels are only used by "Professional Services" business unit
  const { isProfessionalServices } = useBusinessUnit();
  const isBusinessUnitPS = isProfessionalServices();

  const {
    allPsCategoryLabels,
  } = useClauseLabels(isBusinessUnitPS);

  const clause: IClause = {
    name: "",
    category: undefined,
    createdBy: "",
    createdDate: "",
    description: "",
    etag: "",
    id: "",
    modifiedBy: "",
    modifiedDate: "",
    revisionsUri: "",
    status: "",
  };

  const revision: IClauseRevision = {
    id: "",
    name: "",
    status: RevisionStatus.Unpublished,
    displayOption: undefined,
    contentsUri: "",
    effectiveDate: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    etag: "",
    number: 0,
  };

  const createNewClauseInfo: IClauseInfo = {
    clause,
    revisions: [revision],
    currentRevision: revision,
    isLoading: false,
    hasData: true,
  };

  if (isBusinessUnitPS) {
    createNewClauseInfo.psCategoryLabelInfo = {
      psCategoryLabels: allPsCategoryLabels || [],
      clauseLabels: [],
    }
  }

  const createNewClauseContentInfo: IClauseContentInfo = {
    isLoading: false,
    hasData: true,
  };

  const setCurrentRevision = () => {}; // Create new Clause has revision menu disabled
  const clausePlaceholderContent: IClauseContentInfo = {
    isLoading: false,
    hasData: true,
  };
  return {
    clauseInfo: createNewClauseInfo,
    clauseContentInfo: createNewClauseContentInfo,
    setCurrentRevision,
    clausePlaceholderContent,
  };
};

const useNewRevisionClauseInfoProvider = (
  existingClauseInfo: IProvisionedClauseInfo
): IProvisionedClauseInfo => {
  const { updatePanel } = usePanel(PanelType.Clause);

  const newRevisionProvisionedInfo =
    _.cloneDeep<IProvisionedClauseInfo>(existingClauseInfo);
  newRevisionProvisionedInfo.setCurrentRevision = (
    revision: IRevision | undefined
  ) => {
    // Updating the panel info to leverage useClauseInfoProvider() hook's current revision management
    // Changing the selected revision guarantees the user has selected an existing revision
    // As the user cannot select "new revision" while currently in "new revision" editing mode
    updatePanel({
      agreementObjectIds: { revisionId: revision?.id },
      editState: AgreementObjectEditState.Default,
    });
  };

  const targetCloneRevision =
    newRevisionProvisionedInfo.clauseInfo.currentRevision;
  const revisionsCount =
    newRevisionProvisionedInfo.clauseInfo.revisions?.length || 0;

  if (targetCloneRevision) {
    const newRevision: IRevision = { ...targetCloneRevision };

    newRevision.name = "";
    newRevision.status = RevisionStatus.Draft;
    newRevision.isCloned = true;
    newRevision.number = revisionsCount + 1;
    newRevisionProvisionedInfo.clauseInfo.revisions?.unshift(newRevision);
    newRevisionProvisionedInfo.clauseInfo.currentRevision = newRevision;
  }

  return newRevisionProvisionedInfo;
};

const useClausePanelInfoProvider = (panelInfo: IClausePanelInfo) => {
  const newClauseClauseInfo = useNewClauseInfoProvider();
  const existingClauseInfo = useClauseInfoProvider(
    panelInfo.clauseId,
    panelInfo.revisionId
  );
  const newRevisionClauseInfo =
    useNewRevisionClauseInfoProvider(existingClauseInfo);

  const editStateToUse = panelInfo.editState as Exclude<
    AgreementObjectEditState,
    AgreementObjectEditState.NewTemplate
  >;

  const clauseInfoProvider = {
    [AgreementObjectEditState.NewClause]: newClauseClauseInfo,
    [AgreementObjectEditState.NewRevision]: newRevisionClauseInfo,
    [AgreementObjectEditState.Default]: existingClauseInfo,
  }[editStateToUse];

  return clauseInfoProvider;
};

export default useClausePanelInfoProvider;
