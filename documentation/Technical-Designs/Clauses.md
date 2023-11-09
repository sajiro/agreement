# Clauses

Entry point - src\components\clause\Clauses.tsx

All the pivot items from AppContent use the ListingsLayout component for its structure. This is split into a few components which includes components passed in as props:

- Add New Clause
- the Fluent UI DetailsList with a Search bar
- Details Pane

```
    <ListingsLayout
      listingColumns={listingColumns}
      type={RouteComponent.Clauses}
      useGetAllQuery={useGetAllClausesQuery}
      InfoComponent={ClauseInfo}
      addNew={() => {
        openClausePanel({}, AgreementObjectEditState.NewClause);
      }}
    />
```

- listingColumns - the config for the columns used in the DetailsList
- InfoComponent - the component used for the Details Pane on the right hand side of the layout
- useGetAllQuery - the RTK query hook to get all items to use in the detail list
- addNew - this function is used by the 'Add Button' in the ListingsLayout component to open a panel to add a new item

## Listings Layout

This uses the useFetch hook that you pass the useGetAllQuery prop into and returns functions that are used by the Search and the DetailsList component.

```
    onFilterChangedHandler,
    setCurrentItem,
    items: filteredItems,
    currentItem,
    isLoading,
```

Includes the `InfoComponent` that the 'currentItem', which would be the item's id, is passed into as a prop.

The search component uses 'onFilterChangedHandler' which updates the items and returns the filtered items to be passed into the DetailsList component

The DetailList which is a customized version of the fluent ui DetailList with changes to match the figma designs

## ClauseInfo component

Here we have 3 main components

`InfoPageTitle` - This contains the title and a pop out icon to open panel

`SharedActionBar` - This contains the version menu button, edit button, delete, test and publish

This component is used by Clauses, Custom Clauses and Templates with checks for each throughout. Contains the RevisionMenu function used to create the button that shows the different revisions for each item. This is also used in the panels and in the Edit Template page.

`SharedClausePivot` - This is shared by Clauses and Custom Clauses and contains a pivot for Properties, Translations(Panel Only), Content Placeholders (Clause Only) and Preview. Also used in the panel.

If there is a broken clause then a DeleteOrphan component is shown

## ClausePanel component

This uses the Fluent UI Panel. We have a custom header and footer.
Custom header is used to add in an icon and by using a custom header we need to add in a custom close panel button.

We pass in 'panelInfo' prop that contains the type (Clause, Template etc), the 'clause id' and 'revision id' and 'additionalInfo' that has property clauseEditState that is either NewClause or Default

This is passed into the useClausePanelInfoProvider hook which returns

```
clauseContentInfo
clauseInfo
clausePlaceholderContent
setCurrentRevision
```

each of these properties is an object that contains info for each...so clauseContent has translations data, clauseInfo has properties data and clausePlaceholder has placeholder data if applicable

That gets passed into `useSharedClausePanelInitializer` hook which retrieves functions for 'onClose' and 'setCurrentRevision' and more importantly this hook also initializes the forms used in the panel.

Once the form is initialized in redux then we can track all the changes and see if a save can be made

### SharedClausePanelActions.tsx

This is the custom footer component for the panel we use that also includes a custom messaging component that stores the Save/Create button functionality which is enabled/disabled depending on Saves pending.

`hasValidChanges` is a constant here that we use to check if we should save or not. It uses the `hasChanges` function that checks the redux slices for the propertiesForm and translationsForm and sees if the `hasChanges` flag is true or false. It also separately checks the state of the propertiesForm and translationsForm slices to make sure those forms are valid or have errors in the form that need solving.

If we have valid changes then we can 'Save/Create' which fires the `triggerMutation`

## Properties

This utilizes the `Form.tsx` component which is meant to be reusable by the different items where you pass an array of data that includes properties to specify if a dropdown or input is required and also props like placeholder text and values and default values so the form would then be built out using the relevant Fluent UI form controls. There is inline error handling at the form element level to make sure if required or not and then each change is hooked up to the redux slice for the clause panel form so you can tell if changes have been made to allow you to save.

## Translations

`ClauseTranslationsForm.tsx` has the logic for the translations and is split into two main components.
`SharedClauseTranslationUploader.tsx` and `ClauseTranslationRemover.tsx`. `SharedClauseTranslationUploader.tsx` deals with the uploading and display of the ready to upload files. The `FileUploader.tsx` file deals with uploading files whether by os dialog or a drag and drop. Once uploaded the `UploadedFileDisplay.tsx` will process and flag any uploaded files on the client if they wouldn't be accepted by the server. This includes: Max file size, incorrect naming, incorrect mime type and a language that is not accepted. Even if an erroneous file slips through it would be stopped by the server.

This is tied to the TranslationsForm property in the redux slice too so if there are any errors flagged after upload then the `isValid` flag is false so won't be able to save.

The `ClauseTranslationRemover.tsx` will just list out your translations and give you the ability to delete. Any translations selected for delete will be added to the `translationsForm.removedTranslations` property in redux and when we 'Save' then it reads from that array of removed translations in `useClauseMutationActionTrigger.ts`

## ContentPlaceholders
`ClauseDynamicValuesForm.tsx` is the component having the logic related to content placeholders. This component consumes the dynamic placeholder content API's data as a prop. `recursiveRender` is the function that recursively renders the form fields. When user enters any data in form's field, the data is stored in redux store. The data json is first flatten and then stored in the slice. `contentPlaceholdersSlice.ts` is the slice for storing the values that user enters. This store data is then passed to preview API when user click on preview tab.

The preview document API returns the document with the data that user has entered. While passing the data to preview API, we must ensure that only those form fields which have values must be sent. `removeEmptyPlaceHolders` is the function to ensure this.

## Preview

This previews the English(US) version by default but if that isn't present will pick the first language in the array.
