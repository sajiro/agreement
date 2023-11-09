import { PrimaryButton } from '@fluentui/react/lib/Button';
import {
    Dialog,
    DialogType,
    DialogFooter
  } from "@fluentui/react/lib/Dialog";
  import { FontIcon } from "@fluentui/react";

function ErrorTitle() {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FontIcon
            style={{ marginRight: 5, color: "#A80000" }}
            iconName="ErrorBadge"
          />
        <span>Error</span>
        </div>
    )
}


function ErrorMessage() {

    const dialogContentProps = {
        type: DialogType.normal,
        title: <ErrorTitle />,
        showCloseButton: false,
        closeButtonAriaLabel: 'Close',
        subText: 'Something went wrong, please refresh and try again. If problem persists please close your browser and start over.',
    };

    const modalProps = {
          isBlocking: true,
        }
        

    return (
        <Dialog
        hidden={false}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
          <DialogFooter>
          <PrimaryButton onClick={() => window.location.reload()} text="Refresh" />
        </DialogFooter>
        </Dialog>
    
    )
}

export default ErrorMessage