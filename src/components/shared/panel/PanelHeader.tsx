import { IconButton } from "@fluentui/react";
import { TitleShimmer } from "components/loadingSkeletons/GeneralLoadingSkeletons";
import customTheme from "helpers/customTheme";
import icons from "../Icons";
import { InfoPageTitleWithLoading } from "../InfoPageTitle";

const buttonStyles = {
  color: customTheme.secondaryIcon,
  selectors: { "&:hover": { color: "unset" } },
};
// eslint-disable-next-line
const PanelHeader = ({
  title,
  onClosePanel,
  TitleIcon,
}: {
  title: string | undefined;
  onClosePanel: (ignoreUnsavedChanges: boolean) => void;
  TitleIcon?: () => JSX.Element;
}) => (
  <div
    style={{
      marginLeft: 24,
      marginRight: 24,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flex: "1",
        minWidth: "0",
      }}
    >
      {TitleIcon && <TitleIcon />}
      <InfoPageTitleWithLoading
        LoadingSubstitute={TitleShimmer}
        isLoading={!title}
        title={title}
      />
    </div>
    <div>
      <IconButton
        data-automation-id="close-edit-panel"
        aria-label="Close Panel"
        style={buttonStyles}
        iconProps={icons.cancel}
        onClick={() => {
          onClosePanel(false);
        }}
      />
    </div>
  </div>
);

export default PanelHeader;
