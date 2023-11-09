# Telemetry

`TrackingContext.tsx` is the context created for tracking various events over the application. To track any action "useTrackingContext" hook can be called. "trackEvent" is the function that tracks any action. Event description is passed as an argument to the function.

Currently, the event tracking is implemented for Business unit selection, standard clauses, templates and few dialogs.

Action covered for standard clause:

- new clause creation
- clause panel open
- clause panel save button
- editing
- deleting
- testing
- creating new revison (from button and drop down)
- selecting files for translations

Action covered for templates:

- new template creation
- template edit
- deleting
- testing
- creating new revison (from button and drop down)
- add clause, open clause, edit constraint, moving up and down button click
- add to top and add to bottom button click of add clause panel

Action covered for business unit:

- on load, currently selected business unit
- on change of business unit

Dialogs covered:

- deletion and testing dialog for clause
- deletion and testing dialog for template
