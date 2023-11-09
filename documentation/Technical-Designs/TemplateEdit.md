# Edit Template

## Structure

See [TemplateStructureEdit](./TemplateStructureEdit.md)

## Translations

This is implemented in `translation\index.tsx` and utilizes the fluent detailList. We also need to be able to open clause from this tab so that is the only option.

### groups

Rows are custom rendered to use the Group component which contains a toggle to open close the groups contents or the default component which contains the clause name and the list of translations

### translations/index.tsx

The translations are figured out by finding the live revision and doing a content call to return all languages. These are then passed into the `ColumnDisplay` component with a show/hide set for over 15 translations

## Properties tab

The created template's properties (Template name, version name and description) can be edit through properties tab. TemplatePropertiesForm.tsx is the main component holding all the implementation.
**templateFormsSlice.ts** is the slice created to store the template data and the form is first loaded, it fetches the template's data from the store.

All the updates are performed on blur event of the text field. **useUpdateRevisionMutation** is the hook to update the version property and for other properties **useUpdateTemplatePropertiesMutation** hook is used.

The data in the store is updated on change event of properties.

## Preview

### TemplateEditPreview.tsx

This uses the current id and revision from the passed in `TemplateInfo` prop.
Need to check if no slots to render `TemplateEditEmptyContentDisplay`
If slots then need to fire a preview call. Need to convert the date to utc and zeroed out to the start of the chosed day. The constraints to be passed to the preview api and retrieved from the templateEditPreview state. The preview api returns an id that is used to create a filename to be passed to `DocumentViewer` to render the word doc.

### TemplateEditPreviewError.tsx

If we get an error returned from the api then we pass it into the error component. We split the errors into 2. One error is if the template contains more than one header/footer. We work out which are the slots with the header/footer and list them. The other error is dealing with the more general errors we get back from the service like if a clause does not the correct translation.

### Preview Panel

See which constraints are attached to the slots
If they contain multiple values then render a dropdown
If contains a single value then it becomes a checkbox under an Include heading
if businessUnitFeatureFlagging = true dont show dont render the constraints without values.
show no constraints text if no constraints added to any clauses/slots
