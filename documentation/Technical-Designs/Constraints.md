# Constraints

The layout works the same as [Clauses](Technical-Designs/Clauses.md) with the Search bar, details list and an info panel. The info panel has a modified action bar that provides an edit and delete option. With constraints the idea is to have a key name and an optional display name. We will show the display name when available else show the key name or in some parts show Display name(Key name)

## Constraint Panels

Use React Context here to maintain the errors. `ConstraintEditTracker.tsx`.
Also, first time open the panel, whether edit or new, the panel will show a message about the constraint process. Once you hit the "Got it" button then it triggers a dispatch to update the panel slice that this panel has been viewed. The next time a constraint panel opens it checks the persistantInfo prop which contains a reference to that panel state and therefore doesn't show it again and instead shows the regular constraint panel.

`useConstraintInfoProvider` and `useConstraintEditor.tsx` are the main hooks.

` const constraintInfo = useConstraintInfoProvider( constraintPanelInfo.constraintId ); const constraintEditor = useConstraintEditor( constraintInfo, isPanelOpen, constraintPanelInfo.editState );`

`useConstraintInfoProvider` retrieves the info for the contraint including the name and its values

`useConstraintEditor` retrieves the info for the constraint via `useConstraintInfoEditor` hook and for the constraint's values via `useConstraintValuesEditor` hook

`useConstraintInfoEditor` retrieves the constraint's info and ability to set its name
`useConstraintValuesEditor` gets the constraints various value states and ability to update them

We extract out from the hooks what we need and pass that into the ConstraintEditor component

```
    <ConstraintEditor
    constraintInfoEditor={constraintInfoEditor}
    constraintValuesEditor={constraintValuesEditor}
    isNewConstraint={isNewConstraint}
    isSubmitting={constraintEditTracker.isSubmitting}
    />
```

The `ConstraintEditor` then has checks if a new or existing constraint

## New Constraint

This is made up of `ConstraintCreator.tsx` which is the 2 textfields to add the key name and the display name.
`ConstraintValuesCreator.tsx` is a split button that allows you to add the constraint values. Again you must add a key name but have the ability to add an optional name.

## Edit Constraint

`ConstraintValuesRemover.tsx` which is used to remove any existing constraint values that can be removed

`LockedConstraintValuesDisplay.tsx` are constraint values that we check to see if used by templates so we are unable to remove them until they are no longer attached to the template. This is via a propertry from the back end

## Saving Constraints

Use the `useConstraintMutator(constraintId)` hook to either save a new constraint (`createNewConstraint`) or update an exisiting one(`triggerConstraintValueMutations`).

`createNewConstraint` will use RTKQuery to post to the server and then on return will provide a success of failure error message in the panel. The only reason it should fail is if the constraint already exists.

`triggerConstraintValueMutations` will add new or delete values to the server. When we get the result back then need to provide an update via the `PanelMessenger` component we have in the footer. Same PanelMessenger we use for Clauses which shows the success/error message. If a particular value is unable to be deleted then we use the `ConstraintEditTracker` context wrapper to be able to update the particular value that wasn't able to be deleted and provide the correct message in that spot.
