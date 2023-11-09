import { mergeStyles, Pivot, PivotItem } from "@fluentui/react";
import { useEffect, useState } from "react";
import customTheme from "helpers/customTheme";
import TemplatePropertiesForm from "components/template/TemplatePropertiesForm";
import { TemplateEditState } from "models/templatePanel";
import { ITemplateInfo } from "models/templates";
import { TemplateEditPanelType } from "store/templateEditPanelManagementSlice";
import useTemplateEditPanelManager from "hooks/template/useTemplateEditPanelManager";
import useTemplatePreview from "hooks/template/useTemplatePreview";
import PreviewPanel from "./previewPanel";
import TemplateEditStructure from "./structure/TemplateEditStructure";
import TemplateEditPreview from "./preview/TemplateEditPreview";
import TemplateTranslation from "./translation";

const STRUCTURE_PIVOT_NAME = "Structure";
const TRANSLATION_PIVOT_NAME = "Translations";
const PROPERTIES_PIVOT_NAME = "Properties";
const PREVIEW_PIVOT_NAME = "Preview";

const layerClass = mergeStyles({
  height: "calc(100vh - 98px)",
  overflow: "hidden",
  padding: "30px 40px",
  backgroundColor: customTheme.gridPaneBackgroundColor,
});

function TemplateEditPivot({ templateInfo }: { templateInfo: ITemplateInfo }) {
  const [headerText, setHeaderText] = useState(STRUCTURE_PIVOT_NAME);
  const { openedPanel, openPanel, closePanel } = useTemplateEditPanelManager();
  const { resetConfig } = useTemplatePreview();
  useEffect(
    () => () => {
      closePanel();
      resetConfig();
    },
    []
  );

  useEffect(() => {
    const shouldShowPreview =
      headerText === STRUCTURE_PIVOT_NAME || headerText === PREVIEW_PIVOT_NAME;
    const isPanelOpened = openedPanel !== undefined;
    if (shouldShowPreview && !isPanelOpened) {
      openPanel(TemplateEditPanelType.Preview);
    }

    if (!shouldShowPreview && openedPanel === TemplateEditPanelType.Preview) {
      closePanel();
    }
  }, [headerText, openedPanel, openPanel, closePanel]);

  return (
    <div className={layerClass}>
      <PreviewPanel
        isPanelOpen={openedPanel === TemplateEditPanelType.Preview}
        templateId={templateInfo.template!.id}
        revisionId={templateInfo.currentRevision!.id}
        pivotName={headerText}
      />
      <Pivot
        onLinkClick={(item?: PivotItem) => {
          setHeaderText(item?.props.headerText ?? "");
        }}
      >
        <PivotItem headerText={STRUCTURE_PIVOT_NAME}>
          <TemplateEditStructure
            templateId={templateInfo.template!.id}
            revisionId={templateInfo.currentRevision!.id}
            revisionStatus={templateInfo.currentRevision!.status}
          />
        </PivotItem>
        <PivotItem headerText={TRANSLATION_PIVOT_NAME}>
          <TemplateTranslation
            templateId={templateInfo.template!.id}
            revisionId={templateInfo.currentRevision!.id}
          />
        </PivotItem>
        <PivotItem headerText={PROPERTIES_PIVOT_NAME}>
          <TemplatePropertiesForm
            editState={TemplateEditState.NewRevision}
            templateInfo={templateInfo}
          />
        </PivotItem>
        <PivotItem headerText="Preview">
          <TemplateEditPreview templateInfo={templateInfo} />
        </PivotItem>
      </Pivot>
    </div>
  );
}

export default TemplateEditPivot;
