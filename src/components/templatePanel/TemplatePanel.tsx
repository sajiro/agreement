import { Panel, PanelType as FluentPanelType } from "@fluentui/react";

import PanelHeader from "components/shared/panel/PanelHeader";
import TemplatePropertiesForm from "components/template/TemplatePropertiesForm";
import TemplatePanelActions from "components/templatePanel/TemplatePanelActions";
import stringsConst from "consts/strings";
import useNewTemplateInfoProvider from "hooks/template/useNewTemplateInfoProvider";
import useNewTemplateInitializer from "hooks/template/useNewTemplateInitializer";
import { IPanel, IPanelProps, PanelType } from "models/panel";
import { ITemplatePanelInfo, TemplateEditState } from "models/templatePanel";

const getTemplatePanelInfo = (panelInfo: IPanel): ITemplatePanelInfo => ({
  editState:
    (panelInfo.additionalInfo.templateEditState as TemplateEditState) ||
    TemplateEditState.Default,
  templateId: panelInfo.agreementObjectIds.templateId,
  revisionId: panelInfo.agreementObjectIds.revisionId,
});

/* 
  TemplatePanel is only used for creating a new template
*/
// eslint-disable-next-line react/function-component-definition
const TemplatePanel = ({ panelInfo, isBlocking }: IPanelProps) => {
  const templatePanelInfo = getTemplatePanelInfo(panelInfo);
  const isPanelOpen = panelInfo.panelType === PanelType.Template;
  const templateInfoProvider = useNewTemplateInfoProvider();

  const { onClosePanel } = useNewTemplateInitializer(
    templateInfoProvider,
    templatePanelInfo,
    isPanelOpen
  );

  const panelStyles = {
    content: {
      maxHeight: "calc(100vh - 130px)",
      paddingTop: "20px",
    },
  };
  const panelTitle = stringsConst.templatePanel.TemplatePanel.createNewTemplate;

  return (
    <Panel
      styles={panelStyles}
      hasCloseButton={false}
      isFooterAtBottom
      type={FluentPanelType.custom}
      customWidth="500px"
      isOpen={isPanelOpen}
      closeButtonAriaLabel={stringsConst.common.closeButtonAriaLabel}
      isBlocking={isBlocking}
      // eslint-disable-next-line react/no-unstable-nested-components
      onRenderHeader={() => (
        <PanelHeader title={panelTitle} onClosePanel={onClosePanel} />
      )}
      // eslint-disable-next-line react/no-unstable-nested-components
      onRenderFooter={() => (
        <TemplatePanelActions
          templateInfo={templateInfoProvider.templateInfo}
          editState={templatePanelInfo.editState}
          onClosePanel={onClosePanel}
        />
      )}
    >
      <TemplatePropertiesForm
        editState={templatePanelInfo.editState}
        templateInfo={templateInfoProvider.templateInfo}
      />
    </Panel>
  );
};

export default TemplatePanel;
