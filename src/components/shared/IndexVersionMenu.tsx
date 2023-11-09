import { DefaultButton, IButtonProps, IIconProps } from "@fluentui/react";
import {
  ContextualMenu,
  IContextualMenuItem,
  IContextualMenuProps,
} from "@fluentui/react/lib/ContextualMenu";
import {
  revisionIconColors,
  revisionIconMapping,
  revisionStatusMenuColors,
} from "helpers/revisions";
import { RevisionStatus } from "models/revisions";
import { CSSProperties } from "react";

const CONTEXTUAL_MENU_ITEM_HEIGHT_IN_PIXELS = 36;
const MAX_CONTEXTUAL_MENU_ITEMS_IN_VIEW = 10;

export type CurrentItemInfo = {
  text?: string;
  status?: RevisionStatus;
  id?: string;
};
export type IndexVersionMenuProps = {
  menuItems: IContextualMenuItem[];
  currentItem: CurrentItemInfo;
  additionalStyles?: CSSProperties;
  isCommandBarItem?: boolean;
};

// eslint-disable-next-line
const RevisionMenu = (props: IContextualMenuProps) => (
  <ContextualMenu {...props} />
);

// eslint-disable-next-line
const IndexVersionMenu = (props: IndexVersionMenuProps) => {
  const { currentItem, menuItems, additionalStyles, isCommandBarItem } = props;

  const currentItemStatus = currentItem.status || RevisionStatus.Draft;
  const currentItemIcon: IIconProps = {
    iconName: revisionIconMapping[currentItemStatus],
    style: { color: revisionIconColors[currentItemStatus] },
  };
  // const menuItemsFiltered = menuItems.filter(
  //   (items) => items.key !== currentItem.id
  // );

  const versionMenuProps: IButtonProps = {
    styles: { label: { fontWeight: 500 } },
    style: {
      border: "none",
      background: revisionStatusMenuColors[currentItem.status!],
      ...additionalStyles,
    },
    text: currentItem.text,
    iconProps: currentItemIcon,
    allowDisabledFocus: true,
    disabled: true,
  };

  if (menuItems.length > 1) {
    versionMenuProps.disabled = false;
    versionMenuProps.menuAs = RevisionMenu;
    versionMenuProps.menuProps = {
      items: menuItems,
      calloutProps: {
        calloutMaxHeight:
          CONTEXTUAL_MENU_ITEM_HEIGHT_IN_PIXELS *
          MAX_CONTEXTUAL_MENU_ITEMS_IN_VIEW,
      },
    };
  }

  /* 
    Accessibility fix: 
      If IndexVersionMenu is in a CommandBar (via SharedActionBar), it does not get the "menuitem" role automatically.
      
      This throws an accessibility error when the CommandBar has no other item, since the CommandBar has no children with "menuitem" role. 
  */
  if (isCommandBarItem) {
    versionMenuProps.role = "menuitem";
  }

  return  <DefaultButton
            data-automation-id="revision-menu" 
            {...versionMenuProps} 
          />;
};

export default IndexVersionMenu;
