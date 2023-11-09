import { Stack } from "@fluentui/react";
import customTheme from "helpers/customTheme";

// eslint-disable-next-line
const getStackItemStyles = (stackItemProps: StackItemProps) => {
  return {
    root: {
      borderTopStyle: stackItemProps.borderTop ? "solid" : "none",
      borderRightStyle: stackItemProps.borderRight ? "solid" : "none",
      borderBottomStyle: stackItemProps.borderBottom ? "solid" : "none",
      borderLeftStyle: stackItemProps.borderLeft ? "solid" : "none",
      borderColor: `${customTheme.divBorderColor}`,
      borderWidth: 0.5,
    },
  };
};

type StackItemProps = {
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  role?: string;
  dataAutomationId?: string;
};

// eslint-disable-next-line
const StackItem = (stackItemProps: StackItemProps) => {
  const { children, style, role, dataAutomationId } = stackItemProps;
  const stackItemStyles = getStackItemStyles(stackItemProps);

  return (
    <Stack.Item
      data-automation-id={dataAutomationId}
      style={style}
      styles={stackItemStyles}
      role={role}
    >
      {children}
    </Stack.Item>
  );
};

export default StackItem;
