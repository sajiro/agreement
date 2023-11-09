import { IIconProps } from "@fluentui/react";
import customTheme from "helpers/customTheme";

const icons: { [key: string]: IIconProps } = {
  upload: { iconName: "Upload" },
  delete: { iconName: "Delete" },
  edit: { iconName: "Edit" },
  open: { iconName: "OpenFile" },
  publish: { iconName: "PublishContent" },
  more: { iconName: "More" },
  externalLink: { iconName: "NavigateExternalInline" },
  add: { iconName: "Add" },
  undo: { iconName: "Undo" },
  uploadFile: { iconName: "OpenFile" },
  help: { iconName: "help" },
  cancel: { iconName: "cancel" },
  accept: { iconName: "Accept" },
  info: { iconName: "Info" },
  error: { iconName: "ErrorBadge", color: customTheme.errorIcon },
  test: { iconName: "TestBeaker" },
  pageEdit: { iconName: "PageEdit" },
  clock: { iconName: "Clock" },
  archive: { iconName: "Archive" },
  back: { iconName: "Back" },
  group: { iconName: "GroupObject" },
  up: { iconName: "Up" },
  down: { iconName: "Down" },
  openFile: { iconName: "OpenFile" },
  expand: { iconName: "ChevronRightMed" },
  addToTop: { iconName: "ChevronUpEnd6" },
  addToBottom: { iconName: "ChevronDownEnd6" },
};

export default icons;
