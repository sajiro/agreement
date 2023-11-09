import {
  ComboBox,
  IComboBox,
  IComboBoxOption,
  IComboBoxStyles,
  IRefObject,
  IRenderFunction,
  ISelectableOption,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import customTheme from "helpers/customTheme";
import { CSSProperties } from "react";

const comboBoxStylesBottomBorder: IComboBoxStyles = {
  container: {
    marginBottom: "20px",
  },
  rootFocused: {},
  rootPressed: {},
  root: {
    "&::after": {
      borderRadius: "0",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderBottom: `1px solid ${customTheme.bodySubText}`,
    },
    borderBottom: "none",
  },
  label: undefined,
  labelDisabled: undefined,
  rootError: undefined,
  rootDisallowFreeForm: undefined,
  rootHovered: {},
  rootDisabled: undefined,
  input: {},
  inputDisabled: undefined,
  errorMessage: undefined,
  callout: undefined,
  optionsContainerWrapper: undefined,
  optionsContainer: undefined,
  header: undefined,
  divider: undefined,
  screenReaderText: undefined,
};

const comboBoxStylesNoBorder: IComboBoxStyles = {
  container: {
    marginBottom: "20px",
  },
  rootFocused: {
    border: `1px solid ${customTheme.bodySubText}`,
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",

    button: {
      display: "inline-block",
    },
  },
  rootPressed: {
    borderBottom: `1px solid ${customTheme.bodySubText}`,
    button: {
      display: "inline-block",
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
    borderBottom: "none",
    button: {
      display: "none",
      backgroundColor: "transparent",
    },
  },
  label: undefined,
  labelDisabled: undefined,
  rootError: undefined,
  rootDisallowFreeForm: undefined,
  rootHovered: {
    borderBottom: `1px solid ${customTheme.bodySubText}`,
    button: {
      display: "inline-block",
    },
  },
  rootDisabled: undefined,
  input: {},
  inputDisabled: undefined,
  errorMessage: undefined,
  callout: undefined,
  optionsContainerWrapper: undefined,
  optionsContainer: undefined,
  header: undefined,
  divider: undefined,
  screenReaderText: undefined,
};

const comboBoxStyles: IComboBoxStyles = {
  container: {
    marginBottom: "20px",
  },
  rootFocused: {
    border: `1px solid ${customTheme.bodySubText}`,
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    button: {
      opacity: 1,
    },
  },
  rootPressed: {},
  root: {
    "&::after": {
      borderRadius: "0",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderBottom: "none",
    },
    button: {
      backgroundColor: "transparent",
      opacity: 0,
    },
  },
  label: undefined,
  labelDisabled: undefined,
  rootError: undefined,
  rootDisallowFreeForm: undefined,
  rootHovered: {
    borderBottom: `1px solid ${customTheme.bodySubText}`,
    button: {
      opacity: 1,
    },
  },
  rootDisabled: undefined,
  input: {},
  inputDisabled: undefined,
  errorMessage: undefined,
  callout: undefined,
  optionsContainerWrapper: undefined,
  optionsContainer: undefined,
  header: undefined,
  divider: undefined,
  screenReaderText: undefined,
};

const comboBoxStylesBordered: IComboBoxStyles = {
  container: {
    marginBottom: "20px",
  },
  rootFocused: {},
  rootPressed: {},
  root: {},
  label: undefined,
  labelDisabled: undefined,
  rootError: undefined,
  rootDisallowFreeForm: undefined,
  rootHovered: {},
  rootDisabled: undefined,
  input: {},
  inputDisabled: undefined,
  errorMessage: undefined,
  callout: undefined,
  optionsContainerWrapper: undefined,
  optionsContainer: undefined,
  header: undefined,
  divider: undefined,
  screenReaderText: undefined,
};

type CustomComboBoxProps = {
  options: IComboBoxOption[];
  noStyleChange?: boolean;
  onOptionSelected: (option: IComboBoxOption | undefined) => void;
  label?: string;
  setOriginal?: boolean;
  defaultKey?: string | string[];
  multiSelect?: boolean;
  borderBottomFixed?: boolean;
  onMenuDismissed?: () => void;
  componentRef?: IRefObject<IComboBox>;
  className?: string;
  onRenderOption?: IRenderFunction<ISelectableOption>;
  style?: CSSProperties | undefined;
  placeholder?: string;
  hasDelimiter?: boolean;
};

function CustomComboBox({
  options,
  onOptionSelected,
  setOriginal = false,
  noStyleChange = false,
  defaultKey,
  borderBottomFixed = false,
  label,
  multiSelect = false,
  onMenuDismissed,
  componentRef,
  className,
  onRenderOption,
  style,
  placeholder,
  hasDelimiter,
}: CustomComboBoxProps) {
  const [isComboBoxSelected, { setTrue: startSelection }] = useBoolean(
    !!defaultKey
  );

  const getStyles = () => {
    if (borderBottomFixed) {
      return comboBoxStylesBottomBorder;
    }

    const selectedStyling = setOriginal
      ? comboBoxStylesBordered
      : comboBoxStylesNoBorder;

    if (noStyleChange) {
      return comboBoxStyles;
    }

    if (isComboBoxSelected) {
      return selectedStyling;
    }

    return comboBoxStyles;
  };

  return (
    <ComboBox
      data-automation-id="custom-combo-box"
      className={className}
      componentRef={componentRef}
      label={label}
      options={options}
      selectedKey={defaultKey}
      placeholder={placeholder ?? "Select an option"}
      styles={getStyles()}
      multiSelect={multiSelect}
      onChange={(_event, option) => {
        startSelection();
        onOptionSelected(option);
      }}
      onRenderOption={onRenderOption}
      onMenuDismissed={onMenuDismissed}
      style={style}
      multiSelectDelimiter={
        defaultKey?.length === 2 && hasDelimiter ? " or " : ", "
      }
    />
  );
}

export default CustomComboBox;
