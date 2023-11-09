import { mergeStyles, Spinner, SpinnerSize } from "@fluentui/react";
import DocumentViewer from "components/shared/DocumentViewer";
import stringsConst from "consts/strings";
import { RootState } from "store";
import { ITemplateInfo } from "models/templates";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetTemplatePreviewMutation } from "services/preview";
import customTheme from "helpers/customTheme";
import { useGetSlotTreeQuery } from "services/slot";
import _ from "lodash";
import { ItemplatePreviewConfig } from "models/templateMutation";
import { getAsZeroedOutUtcDate } from "helpers/dates";
import TemplateEditPreviewError from "./TemplateEditPreviewError";
import TemplateEditEmptyContentDisplay, {
  errorTextStyling,
} from "../TemplateEditEmptyContentDisplay";

const getUtcNormalizedPreviewConfig = (previewConfig: ItemplatePreviewConfig) => {
  const clonePreviewConfig = _.cloneDeep(previewConfig);
  const asOfDate = getAsZeroedOutUtcDate(new Date(clonePreviewConfig.asofdate));
  clonePreviewConfig.asofdate = asOfDate.toISOString();

  return clonePreviewConfig;
};

const containerClass = mergeStyles({
  height: "calc(100vh - 180px)",
  ...customTheme.templateEditTabsContainer,

  ".loading-area": {
    textAlign: "center",
    padding: "120px 10px 10px",
    margin: "0 auto",
    width: 250,
    lineHeight: 20,
  },
});

interface TemplateEditPreviewProps {
  templateInfo: ITemplateInfo;
}

function TemplateEditPreview({ templateInfo }: TemplateEditPreviewProps) {
  const { template, currentRevision } = templateInfo;
  const [getPreviewData, { data: previewData, error, isLoading, isError }] =
    useGetTemplatePreviewMutation();
  const previewState = useSelector(
    (state: RootState) => state.templateEditPreview
  );

  const slotTreeQueryInfo = {
    templateId: template!.id,
    revisionId: currentRevision!.id,
  };
  const { currentData: slotTree } = useGetSlotTreeQuery(slotTreeQueryInfo);
  const isEmptySlotTree =
    slotTree && Object.values(slotTree.nodes).length === 0;
  const PreviewFileName = `Preview~${stringsConst.common.previewZeros}~${previewState.languagelocale}~${previewData?.id}`;

  useEffect(() => {
    if (!isEmptySlotTree) {
      getPreviewData({
        templateId: template!.id,
        revisionId: currentRevision!.id,
        config: getUtcNormalizedPreviewConfig(previewState),
      });
    }
  }, [previewState, isEmptySlotTree]);

  if (isLoading)
    return (
      <div className={containerClass}>
        <div className="loading-area">
          <Spinner size={SpinnerSize.large} />
        </div>
      </div>
    );

  return (
    <div
      className={containerClass}
      data-automation-id="Preview-document-content"
    >
      {isEmptySlotTree && (
        <TemplateEditEmptyContentDisplay
          message={
            stringsConst.templateEdit.messages.EmptyTemplateGenericMessage
          }
        />
      )}
      {isError && (
        <TemplateEditPreviewError
          error={error}
          templateId={template!.id}
          revisionId={currentRevision!.id}
        />
      )}
      {!isError && previewData?.id && (
        <DocumentViewer
          frameHeight="100%"
          fileName={PreviewFileName}
          errorTextStyle={errorTextStyling}
        />
      )}
    </div>
  );
}

export default TemplateEditPreview;
