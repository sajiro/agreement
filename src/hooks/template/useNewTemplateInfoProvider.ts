import { RevisionStatus } from "models/revisions";
import { 
  IProvisionedTemplateInfo,
  ITemplate, 
  ITemplateInfo, 
  ITemplateRevision,
} from "models/templates";


const useNewTemplateInfoProvider = (): IProvisionedTemplateInfo => {
  const template: ITemplate = {
    id: "",
    name: "",
    category: "",
    constraints: [],
    createdBy: "",
    createdDate: "",
    description: "",
    etag: "",
    modifiedBy: "",
    modifiedDate: "",
    revisionsUri: "",
    status : ""
  };

  const revision: ITemplateRevision = {
    id: "",
    name: "",
    createdBy: "",
    createdDate: "",
    displayOption: "",
    effectiveDate: "",
    etag: "",
    modifiedBy: "",
    modifiedDate: "",
    status: RevisionStatus.Draft,
    number:0
  };

  const createNewTemplateInfo: ITemplateInfo = { 
    template, 
    revisions: [revision], 
    currentRevision: revision, 
    isLoading: false, 
    hasData: true, 
  };

  const setCurrentRevision = () => {};  // Create new Template has revision menu disabled

  return { 
    templateInfo: createNewTemplateInfo, 
    setCurrentRevision,
    isPublishable: false
  };
};

export default useNewTemplateInfoProvider;