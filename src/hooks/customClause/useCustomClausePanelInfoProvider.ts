import usePanel from "hooks/usePanel";
import _ from "lodash";
import { AgreementObjectEditState } from "models/agreements";
import { ICustomClausePanelInfo } from "models/customClausePanel";
import {
  CustomClauseCategory,
  ICustomClause,
  ICustomClauseContentInfo,
  ICustomClauseInfo,
  ICustomClauseRevision,
  IProvisionedCustomClauseInfo,
} from "models/customClauses";
import { PanelType } from "models/panel";
import { IRevision, RevisionStatus } from "models/revisions";
import useCustomClauseInfoProvider from "./useCustomClauseInfoProvider";

const useNewClauseInfoProvider = (): IProvisionedCustomClauseInfo => {
  const clause: ICustomClause = {
    category: CustomClauseCategory.Content,
    createdBy: "",
    createdDate: "",
    description: "",
    etag: "",
    id: "",
    modifiedBy: "",
    modifiedDate: "",
    name: "",
    revisionsUri: "",
    templateId: "",
    templateName: "",
  };

  const revision: ICustomClauseRevision = {
    id: "",
    name: "V1",
    effectiveDate: "",
    status: RevisionStatus.Unpublished,
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    etag: "",
    number:0
  };

  const createNewClauseInfo: ICustomClauseInfo = {
    clause,
    revisions: [revision],
    currentRevision: revision,
    isLoading: false,
    hasData: true,
  };
  const createNewClauseContentInfo: ICustomClauseContentInfo = {
    isLoading: false,
    hasData: true,
  };

  const setCurrentRevision = () => {}; // Create new Clause has revision menu disabled

  return {
    clauseInfo: createNewClauseInfo,
    clauseContentInfo: createNewClauseContentInfo,
    setCurrentRevision
  };
};

const useNewRevisionClauseInfoProvider = (
  existingClauseInfo: IProvisionedCustomClauseInfo
): IProvisionedCustomClauseInfo => {
  const { updatePanel } = usePanel(PanelType.CustomClause);

  const newRevisionProvisionedInfo = _.cloneDeep<IProvisionedCustomClauseInfo>(existingClauseInfo);

  newRevisionProvisionedInfo.setCurrentRevision = (
    revision: IRevision | undefined
  ) => {
    // Updating the panel info to leverage useCustomClauseInfoProvider() hook's current revision management
    // Changing the selected revision guarantees the user has selected an existing revision
    // As the user cannot select "new revision" while currently in "new revision" editing mode
    updatePanel({
      agreementObjectIds: { revisionId: revision?.id },
      editState: AgreementObjectEditState.Default,
    });
  };

  const targetCloneRevision = newRevisionProvisionedInfo.clauseInfo.currentRevision;
  const revisionsCount =
    newRevisionProvisionedInfo.clauseInfo.revisions?.length || 0;

  if (targetCloneRevision) {
    const newRevision: IRevision = { ...targetCloneRevision };
    
    newRevision.name = `V${revisionsCount + 1}`;
    newRevision.status = RevisionStatus.Draft;
    newRevision.isCloned = true;
    newRevisionProvisionedInfo.clauseInfo.revisions?.unshift(newRevision);
    newRevisionProvisionedInfo.clauseInfo.currentRevision = newRevision;
  }

  return newRevisionProvisionedInfo;
};

const useCustomClausePanelInfoProvider = (panelInfo: ICustomClausePanelInfo) => {
  const newClauseClauseInfo = useNewClauseInfoProvider();

  const existingClauseInfo = useCustomClauseInfoProvider(
    panelInfo.templateId,
    panelInfo.clauseId,
    panelInfo.revisionId
  );
  const newRevisionClauseInfo = useNewRevisionClauseInfoProvider(existingClauseInfo);

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

export default useCustomClausePanelInfoProvider;
