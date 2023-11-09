import { getAdditionalNodeIndentWidth } from "helpers/node";

function NodeHeaderGap({ depth }: { depth: number }) {
  const minWidth = getAdditionalNodeIndentWidth(depth);
  return <div style={{ flex: "0 0", minWidth }} />;
}

export default NodeHeaderGap;
