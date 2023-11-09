import { TagPicker, ITag, IBasePickerSuggestionsProps } from '@fluentui/react/lib/Pickers';
import { useBoolean } from '@fluentui/react-hooks';
import { Label } from '@fluentui/react/lib/Label';
import { ICustomFormFieldProps } from "../../../models/properties";
import { useGetTagsQuery, useSaveTagsMutation, useDeleteTagsMutation } from "../../../services/tags";

/**
 * Tag picker for Template tags
 * Not in use
 */
function CustomPickerField({
  label,
  selectedTags,
  ownerObjectId: templateId,
}: ICustomFormFieldProps) {
  const { currentData } = useGetTagsQuery({ id: templateId });
  
  const [saveTag] = useSaveTagsMutation();
  const [deleteTag] = useDeleteTagsMutation();
  const [tagPicker] = useBoolean(false);

  const tags = currentData || []
  const testTags: ITag[] = tags.map(item => ({ key: item.id, name: item.name }));

  const listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
    if (!tagList || !tagList.length || tagList.length === 0) {
      return false;
    }
    return tagList.some(compareTag => compareTag.key === tag.key);
  };
  const filterSuggestedTags = (filterText: string, tagList: ITag[] | undefined): ITag[] =>
    filterText
      ? testTags.filter(
        tag => tag?.name?.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList),
      )
      : [];

  const getTextFromItem = (item: ITag) => item.name;
  const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested tags',
    noResultsFoundText: 'No tags found',
  };
  const itemChangeHandler = (items?: ITag[]) => {
    if (templateId && selectedTags && items) {
      if (selectedTags.length >= items.length) {
        const tempArray = selectedTags.filter(item => !(items?.includes(item)));
        deleteTag({ "templateId": templateId, "labelId": tempArray[0].key.toString() })
      }
      else {
        const tempArray = items.filter(item => !selectedTags.includes(item))
        saveTag({ "name": tempArray[0].name, "id": tempArray[0].key.toString(), "templateId": templateId });
      }
    }
  }
  return (
    <>
      <Label htmlFor="tagsPicker">
        {label}
      </Label>
      <TagPicker
        aria-label={label}
        removeButtonAriaLabel="Remove"
        selectionAriaLabel="Selected Tags"
        onResolveSuggestions={filterSuggestedTags}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={pickerSuggestionsProps}
        disabled={tagPicker}
        selectedItems={selectedTags}
        onChange={itemChangeHandler}
      />
    </>
  );
}

export default CustomPickerField;
