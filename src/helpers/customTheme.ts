import { getTheme } from "@fluentui/react";

const theme = getTheme();

const borderColor = theme.semanticColors.variantBorder;
const modalBorderColor = theme.semanticColors.buttonBorder;
const secondaryGrey130 = theme.semanticColors.bodySubtext;

const customTheme = {
  white: theme.semanticColors.bodyBackground,
  secondaryGrey130,
  bodySubText: secondaryGrey130,
  disabledGrey: theme.semanticColors.disabledText,
  bodyColor: theme.semanticColors.bodyText,
  divBorderColor: borderColor,
  errorColor: theme.semanticColors.errorText,
  focusColor: theme.semanticColors.inputFocusBorderAlt,
  secondaryIcon: theme.semanticColors.infoIcon,
  linkSemanticColor: theme.semanticColors.link,
  disabledSemanticColor: theme.semanticColors.disabledBodyText,
  menuItemBgPressed: theme.semanticColors.menuItemBackgroundPressed,
  menuItemBgHovered: theme.semanticColors.menuItemBackgroundHovered,
  menuDividerSemanticColor: theme.semanticColors.menuDivider,
  bodyDividerSemanticColor: theme.semanticColors.bodyDivider,
  errorTextSemanticColor: theme.semanticColors.errorText,
  successBackground: theme.semanticColors.successBackground,
  messageLink: theme.semanticColors.messageLink,
  largeSpacing: theme.spacing.l2,
  mediumSpacing: theme.spacing.m,
  smallSpacing: theme.spacing.s1,
  listItemBackgroundCheckedHovered:
    theme.semanticColors.listItemBackgroundCheckedHovered,
  blueIconColor: theme.semanticColors.primaryButtonBackgroundHovered,
  errorIcon: theme.semanticColors.errorIcon,
  frame: {
    border: `1px solid ${borderColor}`,
  },

  modalBorder: {
    height: 1,
    background: modalBorderColor,
    margin: 0,
  },

  listRowCss: {
    position: "relative",
    borderLeft: "3px solid transparent",
    borderTop: `1px solid ${borderColor}`,
    borderBottom: "1px solid transparent",
    // borderBottom: `1px solid ${borderColor}`,
    borderRight: `1px solid transparent`,
    "-webkit-touch-callout": "none" /* iOS Safari */,
    "-webkit-user-select": "none" /* Safari */,
    "-khtml-user-select": "none" /* Konqueror HTML */,
    "-moz-user-select": "none" /* Old versions of Firefox */,
    "-ms-user-select": "none" /* Internet Explorer/Edge */,
    "user-select": "none" /* Non-prefixed version, currently */,
    "&:hover": {
      background: theme.semanticColors.menuItemBackgroundHovered,
    },
    "&.is-selected": {
      background: theme.semanticColors.menuItemBackgroundPressed,
      borderLeft: `3px solid ${theme.palette.themePrimary}`,
    },
    "&.is-dragging": {
      opacity: 0.5,
      // background: theme.palette.themePrimary,
      // color: theme.palette.white,
    },
    "&.can-drop-up": {
      borderUp: `1px solid ${theme.palette.themePrimary}`,
    },
    "&.can-drop-down": {
      borderBottom: `1px solid ${theme.palette.themePrimary}`,
    },
  },

  isSelected: {
    background: theme.semanticColors.menuItemBackgroundPressed,
    borderLeft: `3px solid ${theme.palette.themePrimary}`,
  },

  nodeCellCss: {
    display: "flex",
    position: "relative",
    marginTop: 11,
    zIndex: 1,
  },

  nodeCell1Css: {
    // flex: "0 0 55%",
    width: 362,
    marginLeft: "-3px",
  },

  nodeCell2Css: {
    display: "flex",
    width: "55%",
    alignItems: "center",
    padding: "7px 0px",
    color: secondaryGrey130,
  },

  focusHoverColor: theme.semanticColors.listItemBackgroundCheckedHovered,
  gridPaneBackgroundColor: "#F2F2F2",

  actionsBackgroundColor: theme.semanticColors.defaultStateBackground,

  previewPrimaryBtn: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: "12px!important",
  },
  previewSecondaryBtn: {
    background: "transparent",
  },
  titleOne: {
    fontSize: 20,
    marginBottom: 28,
  },
  titleTwo: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 600,
  },
  errorMessage: {
    color: theme.semanticColors.errorText,
    fontSize: "12px",
    margin: "0 0 12px 0",
  },
  editTemplateHeading: {
    alignItems: "center",
    display: "flex",
    height: 48,
    background: theme.semanticColors.bodyBackground,
    borderBottom: `1px solid ${borderColor}`,
  },
  groupedListContainer: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  clauseTemplatePanelActions: {
    display: "flex",
    alignItems: "center",
  },
  templateEditTabsContainer: {
    width: 850,
    marginTop: 3,
    boxShadow:
      "0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)",
    backgroundColor: theme.palette.white,
  },
};

export default customTheme;
