# Clause Panel

## Reference

[Figma design](https://www.figma.com/proto/hpWdhnEsdysA0iiCqDwVv8/Port-to-Dynamics?node-id=3621%3A78238&scaling=min-zoom&page-id=260%3A23617&starting-point-node-id=276%3A24161)

## Implementation

When ready to save, use the `triggerMutation` from `useClauseMutationActionTrigger` hook

The actions would contain a type and argument property. Depending on the edit state (New Clause, New Revision or Updating current revision) we would build up a `mutationActions` array that we would pass to the `setMutationActions` function we get from the `useClauseMutator` hook

A create New Clause would just use
`CreateClause`

Saving a current revision would apply depending if the 'propertiesFrom' and/or 'translationsFrom' has changed

- UpdateProperties
- DeleteTranslations
- UploadTranslations

A 'Create New Revision' save would use the additional action

- CreateRevision
- CopyTranslations

### useClauseMutator.ts

This file does all the verification of the mutations we make to the apis.

It is broken down into these functions

- processNextAction
- resetResults
- sendUpdates
- processActionResult
- setMutationActions

Then we have a series of useEffects that are triggered when we get the results of the mutations from RTKQuery.

The process starts with `setMutationActions` that dispatches a panel submitting state, adds all the actions into a queue array and then calls the `processNextAction` function.

The `processNextAction` function will call the relevant RTKQuery mutation based on the action in the queue and pass in the `actionArgument`

When the result comes back it will trigger the relevant useEffect which calls `processActionResult` passing in the result, success and error messages

In `processActionResult` we pass in the message to the actionMessagesRef array. We check the mutationAction queue to see if we have any further actions. If we do then we call the `processNextAction` again otherwise we call `sendUpdates`

In `sendUpdates` we would update the panel on success and update the route so the ClauseInfo component is updateded in the background. This is where we build out what message to provide based on the figma rules in link above. This is done with help of a redux slice which is created using the `setClausePanelMessage` function from the `usePanelMessenger` hook. The SharedClausePanelActions component we have then reacts to the update and displays the relevant message. Based on the figma rules if we have partial success, for example we updated the properties but translations were unable to be copied over, we would need to provide `subMessages` that would be an array of the messages from each step of the process both success and error.
