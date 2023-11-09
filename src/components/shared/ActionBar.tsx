import { CommandBar, ICommandBarItemProps, IRawStyle } from "@fluentui/react";
import customTheme from "helpers/customTheme";
import { CSSProperties } from "react";

const defaultCommandBarStyles = {
  root: {
    padding: 0,
    height: "auto",
  },
};

const defaultActionBarStyles = {
  marginTop: customTheme.mediumSpacing,
  marginBottom: customTheme.mediumSpacing,
};

export interface ICustomCommandBarStyles {
  root?: CSSProperties;
  commandBar?: IRawStyle;
}

type ActionBarProps = {
  items: ICommandBarItemProps[];
  overflowItems: ICommandBarItemProps[] | undefined;
  additionalStyles?: ICustomCommandBarStyles;
};

function ActionBar({ items, overflowItems, additionalStyles }: ActionBarProps) {
  const actionBarStyles = additionalStyles?.root || defaultActionBarStyles;
  const additionalCommandBarStyles = additionalStyles?.commandBar || {
    marginTop: customTheme.mediumSpacing,
  };

  return (
    <div style={{ ...actionBarStyles }}>
      <CommandBar
        data-cy="command-bar"
        items={items}
        overflowItems={overflowItems}
        styles={{ ...defaultCommandBarStyles, ...additionalCommandBarStyles }}
      />
    </div>
  );
}

export default ActionBar;
