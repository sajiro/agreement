import customTheme from "../helpers/customTheme";

export const maxFileSize = 5000000;
export const mimeTypes = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// template edit related
export const APP_BANNER_HEIGHT = 50;
export const TEMPLATE_ACTION_BAR = 48;
export const TEMPLATE_EDIT_PADDING = 30;
export const TEMPLATE_EDIT_PIVOT = 44;
export const TEMPLATE_EDIT_STRUCTURE_HEADER_HEIGHT = 50;
export const NODE_INDENT_BLOCK_WIDTH = 12;
export const DEFAULT_NODE_HEIGHT = 41;
export const TEMPLATE_EDIT_HEADING = 41;
export const VTREE_EXPECTED_HEIGHT = `calc(100vh - ${
  APP_BANNER_HEIGHT +
  TEMPLATE_ACTION_BAR +
  TEMPLATE_EDIT_PADDING +
  TEMPLATE_EDIT_PIVOT +
  TEMPLATE_EDIT_STRUCTURE_HEADER_HEIGHT +
  TEMPLATE_EDIT_HEADING
}px)`;

export const TEMPLATE_EDIT_TABS_CONTAINER = {
  width: 828,
  marginTop: 3,
  boxShadow:
    "0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)",
  backgroundColor: customTheme.white,
};

// For Slots
export const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";
export const ROOT_NODE_ID = EMPTY_GUID;

// Template Preview
export const MultipleHeaderFooterPartFoundErrorCode = "4507";

// Business Unit Mappings
export const businessGroupDetails = [
  {
    businessGroup: "Commerce",
    tenant: "New Commerce",
  },
  {
    businessGroup: "OEM",
    tenant: "OEM",
  },
  {
    businessGroup: "ProfessionalServices",
    tenant: "Professional Services",
  }
];