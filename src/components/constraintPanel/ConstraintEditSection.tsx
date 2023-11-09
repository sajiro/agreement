import { CSSProperties, ReactNode } from "react";

function ConstraintEditSection({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return <div style={{ ...style, marginBottom: 36 }}>{children}</div>;
}

export default ConstraintEditSection;
