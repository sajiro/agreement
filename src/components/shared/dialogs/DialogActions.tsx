import { DefaultButton, DialogFooter, PrimaryButton } from "@fluentui/react";
import customTheme from "helpers/customTheme";

function DialogActions({
  proceedButtonText,
  cancelButtonText,
  onProceed,
  onCancel,
  isProceeding,
  noCancelButton,
}: {
  proceedButtonText: string;
  cancelButtonText: string;
  onProceed: () => void;
  onCancel: () => void;
  isProceeding?: boolean;
  noCancelButton?: boolean;
}) {
  return (
    <DialogFooter
      styles={{
        actions: {
          borderTop: `1px solid ${customTheme.divBorderColor}`,
          lineHeight: "auto",
        },
        actionsRight: { marginRight: 0 },
      }}
    >
      <div style={{ padding: 10 }}>
        <PrimaryButton
          data-automation-id="dialog-proceedButton"
          text={proceedButtonText}
          onClick={onProceed}
          style={{ margin: 5 }}
          disabled={isProceeding}
        />
        {!noCancelButton && (
          <DefaultButton
            data-automation-id="dialog-cancelButton"
            text={cancelButtonText}
            onClick={onCancel}
            style={{ margin: 5 }}
            disabled={isProceeding}
          />
        )}
      </div>
    </DialogFooter>
  );
};

export default DialogActions;
