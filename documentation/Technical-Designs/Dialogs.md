# Dialogs

This is set up in the Overlays.tsx component. With fluent UI you have the panel and the dialog fluent ui controls that utilize an overlay which can block interacting with anything in the background. Therefore when you have a panel open which you want to blocking any interaction the background and also want to open a dialogue then we need to quickly set the panel's overlay to be non blocking so we can interact with the dialog. Then when you close the dialog the panel can become blocking again.

We use one main dialog component `Dialog.tsx` that has its open close/close state stored in redux.
The hook `useDialog.tsx` is used in conjunction and `openDialog` function is the base function that dispatches to the redux store.
The hook exports a variation of dialogs we use like success, error and 404. We then import these functions and call them passing in additional information that we use further down the line. Depending on the type of dialog we render the corresponding component in the Dialog component like the `Error404Dialog.tsx`. The additional info is passed through to the Error404Dialog and used to render out certain information, for example determining which agreement item it is, clause or template.
