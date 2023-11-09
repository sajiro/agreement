/* import { Stack } from "@fluentui/react"; */
import customTheme from "helpers/customTheme";
import { ReactNode } from "react";

export const commitButtonStyle = { marginRight: 12 };
// eslint-disable-next-line
const PanelActions = ({ children }: { children: ReactNode }) => {
  const footerStyles = {
    padding: 24,
    background: customTheme.white,
    borderTop: `1px solid ${customTheme.divBorderColor}`,
    zIndex: 1,
  };

  return <div style={footerStyles}>{children}</div>;
};

export default PanelActions;
