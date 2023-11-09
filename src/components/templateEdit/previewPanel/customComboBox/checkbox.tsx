import { Checkbox, mergeStyles, Spinner, SpinnerSize } from "@fluentui/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { IConstraintValue } from "models/constraints";
import { ISlotConstraint } from "models/slot";
import { useEffect } from "react";
import { useGetConstraintValuesQuery } from "services/constraint";

export interface ICustomCheckBox {
  item: ISlotConstraint;
  checked: boolean;
  label: string | undefined;
  onChangeCheckbox?: (
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    isChecked?: boolean
  ) => void;
  id?: string;
  title?: string;
  triggerNoValues: (itemId?: ISlotConstraint, isInclude?: boolean) => void;
}

const spinnerClass = mergeStyles({
  width: "100%",
  marginBottom: 10,
  height: 60,
  paddingTop: 20,
});

function CustomCheckBox({
  item,
  checked,
  label,
  title,
  onChangeCheckbox = () => {},
  id,
  triggerNoValues = () => {},
}: ICustomCheckBox) {
  const { currentData, isLoading, isError } = useGetConstraintValuesQuery(
    id ?? skipToken
  );

  useEffect(() => {
    if (!isLoading) {
      const opts = currentData?.map((value: IConstraintValue) => ({
        id: value.id,
        key: value.name,
        text: value.display === "" ? value.name : value.display,
      }));
      if (!opts) triggerNoValues(item, true);
    }
  }, [isLoading]);

  if (isLoading)
    return (
      <div className={spinnerClass}>
        <Spinner size={SpinnerSize.small} />
      </div>
    );

  if (isError) return null;
  return (
    <Checkbox
      label={label}
      checked={checked}
      key={id}
      id={id}
      onChange={onChangeCheckbox}
      title={title}
    />
  );
}

export default CustomCheckBox;
