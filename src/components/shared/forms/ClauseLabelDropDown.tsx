import { useDispatch } from "react-redux";
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';

import { getLabelsFromDropdownOptions } from "helpers/clauseForms";
import { ICustomFormFieldProps } from "models/properties";
import { clausePanelFormsActions } from 'store/clausePanelFormsSlice';

const dropdownStyles: Partial<IDropdownStyles> = { 
  dropdown: { 
    marginBottom: 20,
    width: 320,
  } 
};

/**
 * Multi-select drop-down for Clause labels
 * Used by "PS Category" only
 */
function ClauseLabelDropDown({
  label,
  disabled,
  options,
  selectedOptions,
  propertyType,
  propertyName,
  dataAutomationId,
  onPropertyChangedHandler,
}: ICustomFormFieldProps) {
  const dispatch = useDispatch();

  const availableOptions = options || [];
  const currentSelected = selectedOptions || [];
  const selectedKeys = currentSelected.map((option) => option.key.toString());
  
  const itemChangeHandler = (
    event: React.FormEvent<HTMLDivElement>, 
    item?: IDropdownOption
  ) => {
    if (!item) {
      return;
    }
    const selectedItems = item.selected ?
      [...currentSelected, item] :
      currentSelected.filter(selectedItem => selectedItem.key !== item.key);

    const selectedLabels = getLabelsFromDropdownOptions(selectedItems);
    
    dispatch(
      clausePanelFormsActions.updateClauseLabels(selectedLabels)
    );
    onPropertyChangedHandler(propertyType, propertyName, "", "");
  }

  return (
    <Dropdown
      data-automation-id={dataAutomationId}
      label={label}
      selectedKeys={selectedKeys}
      disabled={disabled}
      // eslint-disable-next-line react/jsx-no-bind
      onChange={itemChangeHandler}
      multiSelect
      options={availableOptions}
      styles={dropdownStyles}
    />
  );
}

export default ClauseLabelDropDown;
