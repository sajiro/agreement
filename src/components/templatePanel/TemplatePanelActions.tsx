import { useSelector } from "react-redux";
import { DefaultButton, PrimaryButton } from "@fluentui/react";
import { RootState } from "store";

import PanelActions, {
  commitButtonStyle,
} from "components/shared/panel/PanelActions";
import PanelMessenger from "components/shared/panel/PanelMessenger";
import {
  hasChangesTemplateProperties,
  isValidTemplateProperties,
} from "helpers/templateForm";
import useTemplateMutationActionTrigger from "hooks/template/mutation/useTemplateMutationActionTrigger";
import { TemplateEditState } from "models/templatePanel";
import { ITemplateInfo } from "models/templates";
import customTheme from "helpers/customTheme";

export type TemplatePanelActionsProps = {
  templateInfo: ITemplateInfo;
  editState: TemplateEditState;
  onClosePanel: (ignoreUnsavedChanges: boolean) => void;
};

function TemplatePanelActions({
  templateInfo,
  editState,
  onClosePanel,
}: TemplatePanelActionsProps) {
  const { propertiesForm, isSubmitting } = useSelector(
    (state: RootState) => state.templateForms
  );

  const { triggerMutation } = useTemplateMutationActionTrigger(
    templateInfo,
    propertiesForm
  );
  const hasValidChanges =
    hasChangesTemplateProperties(propertiesForm) &&
    isValidTemplateProperties(propertiesForm);

  return (
    <PanelActions>
      <div style={customTheme.clauseTemplatePanelActions}>
        <PrimaryButton
          data-automation-id="templatepanel-saveButton"
          text="Create"
          style={commitButtonStyle}
          onClick={() => {
            triggerMutation(editState);
          }}
          disabled={!hasValidChanges}
        />
        <DefaultButton
          data-automation-id="templatepanel-cancelButton"
          text="Cancel"
          onClick={() => {
            onClosePanel(true);
          }}
        />
        <PanelMessenger isSubmitting={isSubmitting} />
      </div>
    </PanelActions>
  );
}

export default TemplatePanelActions;
