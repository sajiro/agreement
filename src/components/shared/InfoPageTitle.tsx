import { ActionButton, Text } from "@fluentui/react";
import icons from "./Icons";
import WithLoading from "./WithLoading";

const titleSectionStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const buttonStyles = {
  action: {
    icon: {
      fontSize:"18px"
    }
  }
};
function TruncateText({ dataAutomationId, title }: {
  dataAutomationId?: string;
  title: string;
}) {
  return (
    <Text
      data-automation-id={dataAutomationId}
      variant="xLarge"
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "block",
      }}
      title={title}
    >
      {title}
    </Text>
  );
}

// eslint-disable-next-line
const InfoPageTitle = ({
  title,
  onInfoPagePopOut,
}: {
  title: string;
  onInfoPagePopOut?: () => void;
}) =>
  onInfoPagePopOut ? (
    <div
      data-automation-id="panel-header" 
      style={titleSectionStyles}
    >
      <TruncateText 
        dataAutomationId="panel-headerText" 
        title={title} 
      />
      {onInfoPagePopOut && (
        <ActionButton
          data-automation-id="panel-popupButton" 
          title="Pop out panel"
          iconProps={icons.externalLink}
          onClick={onInfoPagePopOut}
          styles={buttonStyles.action}
        />
      )}
    </div>
  ) : (
    <TruncateText 
      dataAutomationId="panel-headerText" 
      title={title} 
    />
  );

export const InfoPageTitleWithLoading = WithLoading(InfoPageTitle);

export default InfoPageTitle;
