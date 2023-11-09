import { Shimmer, ShimmerElementType } from "@fluentui/react";
import { shimmerSectionStyles } from "./GeneralLoadingSkeletons";

// eslint-disable-next-line
export const TemplateActionBarShimmer = () => {
  const shimmerElements = [
    { type: ShimmerElementType.line, width: "15%", height: 28 },
    { type: ShimmerElementType.gap, width: "2.5%" },
    { type: ShimmerElementType.line, width: "20%", height: 28 },
  ];

  return (
    <Shimmer
      style={shimmerSectionStyles}
      width="50%"
      shimmerElements={shimmerElements}
    />
  );
};

// eslint-disable-next-line
export const TemplatePropertiesViewShimmer = () => {
  const shimmerElements = [
    { type: ShimmerElementType.line, width: "100%", height: 300 },
  ];

  return (
    <Shimmer
      style={shimmerSectionStyles}
      width="400px"
      shimmerElements={shimmerElements}
    />
  );
};
