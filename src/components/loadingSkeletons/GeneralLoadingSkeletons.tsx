import { Shimmer, ShimmerElementType } from "@fluentui/react";

export const shimmerSectionStyles = { marginBottom: "20px", marginTop: "20px" };
// eslint-disable-next-line
export const TitleShimmer = () => 
 (
    <Shimmer
      style={shimmerSectionStyles}
      width="60%"
      shimmerElements={[{ type: ShimmerElementType.line, height: 36 }]}
    />
  );
