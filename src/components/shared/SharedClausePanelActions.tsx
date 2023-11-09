import { useSelector } from "react-redux";
import { DefaultButton, PrimaryButton } from "@fluentui/react";

import PanelActions, {
  commitButtonStyle,
} from "components/shared/panel/PanelActions";
import PanelMessenger from "components/shared/panel/PanelMessenger";
import WithLoading from "components/shared/WithLoading";
import { hasChanges } from "helpers/forms";
import { isDraftRevisionVariant } from "helpers/revisions";
import useClauseMutationActionTrigger from "hooks/clause/mutation/useClauseMutationActionTrigger";
import useCustomClauseMutationActionTrigger from "hooks/customClause/mutation/useCustomClauseMutationActionTrigger";
import { AgreementObjectEditState } from "models/agreements";
import { IClauseInfo, IProvisionedClauseInfo } from "models/clauses";
import {
  ICustomClauseInfo,
  IProvisionedCustomClauseInfo,
} from "models/customClauses";
import { RootState } from "store";
import customTheme from "helpers/customTheme";
import stringsConst from "consts/strings";
import useSharedClausePanelController from "hooks/useSharedClausePanelController";
import { IClausePanelInfo } from "models/clausePanel";
import { ICustomClausePanelInfo } from "models/customClausePanel";
import { useTrackingContext } from "./TrackingContext";

type ClausePanelActionsProps = {
  isCustomClause: boolean;
  clauseInfoProvider: IProvisionedClauseInfo | IProvisionedCustomClauseInfo;
  panelInfo: IClausePanelInfo | ICustomClausePanelInfo;
};

function SharedClausePanelActions({
  isCustomClause,
  clauseInfoProvider,
  panelInfo,
}: ClausePanelActionsProps) {
  const { onClosePanel } = useSharedClausePanelController(
    isCustomClause,
    clauseInfoProvider,
    panelInfo
  );
  const formInfo = useSelector((state: RootState) =>
    isCustomClause ? state.customClausePanelForms : state.clausePanelForms
  );
  const { trackEvent } = useTrackingContext();

  const { propertiesForm, translationsForm, isSubmitting, hasSubmitted } =
    formInfo;
  const { clauseInfo } = clauseInfoProvider;
  const { editState } = panelInfo;
  const { triggerMutation } = isCustomClause
    ? useCustomClauseMutationActionTrigger(
        clauseInfo as ICustomClauseInfo,
        propertiesForm,
        translationsForm
      )
    : useClauseMutationActionTrigger(
        clauseInfo as IClauseInfo,
        propertiesForm,
        translationsForm
      );

  const commitButtonText =
    editState === AgreementObjectEditState.NewClause
      ? stringsConst.common.create
      : stringsConst.common.save;

  const closeButtonText =
    editState === AgreementObjectEditState.NewClause
      ? stringsConst.common.cancel
      : stringsConst.common.close;

  const hasValidChanges =
    propertiesForm?.isValid &&
    translationsForm?.isValid &&
    !hasSubmitted &&
    hasChanges(propertiesForm, translationsForm, editState);

  if (!isDraftRevisionVariant(clauseInfo.currentRevision?.status)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <PanelActions>
      <div 
        data-automation-id="panel-actionButtons"
        style={customTheme.clauseTemplatePanelActions}
      >
        <PrimaryButton
          data-automation-id="panel-saveButton"
          text={commitButtonText}
          style={commitButtonStyle}
          onClick={() => {
            triggerMutation(editState);
            trackEvent(
              `${commitButtonText} ${
                isCustomClause ? `custom` : `standard`
              } clause button clicked`
            );
          }}
          disabled={!hasValidChanges}
        />
        <DefaultButton
          data-automation-id="panel-cancelButton"
          text={closeButtonText}
          onClick={() => {
            onClosePanel(true);
          }}
        />
        <PanelMessenger isSubmitting={isSubmitting} />
      </div>
    </PanelActions>
  );
}

export const SharedClausePanelActionsWithLoading = WithLoading(
  SharedClausePanelActions
);

export default SharedClausePanelActions;
