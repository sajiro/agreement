import {
  ComboBox,
  css,
  IComboBox,
  IComboBoxOption,
  IComboBoxProps,
  IconButton,
  IIconProps,
  mergeStyles,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";
import { IConstraintValue } from "models/constraints";
import { ISlotConstraint } from "models/slot";
import { useCallback, useEffect, useState } from "react";
import { useGetConstraintValuesQuery } from "services/constraint";

const comboBoxStyles = {
  optionsContainerWrapper: {
    maxWidth: "270px",
  },
  rootPressed: {
    button: {
      backgroundColor: "transparent",
    },
  },
  rootFocused: {
    border: `1px solid ${customTheme.secondaryGrey130}`,
    backgroundColor: customTheme.white,
    button: {
      backgroundColor: customTheme.white,
    },
  },
  root: {
    "&::after": {
      borderRadius: "0",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderBottom: "none",
    },
    borderBottom: `1px solid ${customTheme.secondaryGrey130}`,
    backgroundColor: "transparent",
    input: {
      backgroundColor: "transparent",
    },
  },
};

const iconClass = mergeStyles({
  right: 1,
  position: "absolute",
  bottom: 1,
  zIndex: 1,
  width: 32,
  height: 30,
  backgroundColor: customTheme.white,
});

const activeClass = mergeStyles({
  div: {
    border: `1px solid ${customTheme.secondaryGrey130}`,
    backgroundColor: customTheme.white,
  },
});

export interface ICustomComboBox extends IComboBoxProps {
  item: ISlotConstraint;
  clear?: boolean;
  onOptionSelected?: (
    option: IComboBoxOption | undefined,
    id?: string | undefined
  ) => void;
  id?: string;
  idQuery?: string;
  triggerNoValues: (item?: ISlotConstraint) => void;
}

const spinnerClass = mergeStyles({
  width: "100%",
  marginBottom: 10,
  height: 60,
  paddingTop: 20,
});

const containerClass = mergeStyles({
  position: "relative",
});

const clearBtn: IIconProps = {
  iconName: "Cancel",
  styles: { root: { fontSize: 12, color: customTheme.secondaryGrey130 } },
};

const optionStyle = {
  padding: "5px 0",
};

const onRenderOption = (item: any) => (
  <span title={item.text} style={optionStyle}>
    {item.text}
  </span>
);

function CustomComboBox({
  item,
  clear = false,
  label,
  className,
  styles,
  options,
  selectedKey,
  placeholder,
  onOptionSelected = () => {},
  id,
  idQuery,
  triggerNoValues = () => {},
}: ICustomComboBox) {
  const [selectedKeyCustom, setSelectedKeyCustom] = useState(selectedKey);
  const [showClear, setShowClear] = useState(selectedKey !== "");
  const [optionsCustom, setOptionsCustom] = useState(options);

  const { currentData, isLoading, isError } = useGetConstraintValuesQuery(
    idQuery ?? skipToken
  );

  useEffect(() => {
    if (!isLoading) {
      const opts = currentData?.map((value: IConstraintValue) => ({
        key: value.name,
        text: value.display === "" ? value.name : value.display,
      }));
      if (!opts) triggerNoValues(item);
      setOptionsCustom(opts ?? options);
    }
  }, [isLoading]);

  const clearSelected = () => {
    setSelectedKeyCustom("");
    setShowClear(false);
    onOptionSelected(undefined, id);
  };

  const onChange = useCallback(
    (
      event: React.FormEvent<IComboBox>,
      option?: IComboBoxOption,
      index?: number,
      value?: string
    ): void => {
      const key = option?.key;

      if (!option && value) {
        setOptionsCustom((prevOptions) => [
          ...prevOptions,
          { key: key!, text: value },
        ]);
      }
      setShowClear(true);
      setSelectedKeyCustom(key);
      onOptionSelected(option, id);
    },
    []
  );

  const setClearIcon = () => {
    setShowClear(selectedKeyCustom !== "");
  };

  const onMenuOpen = () => {
    setShowClear(false);
  };

  if (isLoading)
    return (
      <div className={spinnerClass}>
        <Spinner size={SpinnerSize.small} />
      </div>
    );

  if (isError) return null;
  return (
    <div className={containerClass}>
      {clear && showClear && (
        <IconButton
          className={iconClass}
          iconProps={clearBtn}
          aria-label={stringsConst.common.clear}
          onClick={clearSelected}
        />
      )}
      <ComboBox
        data-automation-id="customcombobox"
        placeholder={placeholder}
        className={css(className, selectedKeyCustom !== "" && activeClass)}
        styles={styles ?? comboBoxStyles}
        label={label}
        options={optionsCustom}
        selectedKey={selectedKeyCustom}
        onItemClick={setClearIcon}
        onChange={onChange}
        onMenuOpen={onMenuOpen}
        onBlur={setClearIcon}
        onMenuDismiss={setClearIcon}
        onRenderOption={onRenderOption}
      />
    </div>
  );
}

export default CustomComboBox;
