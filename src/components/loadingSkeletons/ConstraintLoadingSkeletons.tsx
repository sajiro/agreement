import { Shimmer, ShimmerElementType } from "@fluentui/react";
import { shimmerSectionStyles } from "./GeneralLoadingSkeletons";
// eslint-disable-next-line
export const ConstraintActionBarShimmer = () => {
  const shimmerElements = [
    { type: ShimmerElementType.line, width: "10%", height: 28 },
    { type: ShimmerElementType.gap, width: "2.5%" },
    { type: ShimmerElementType.line, width: "10%", height: 28 },
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
export const ConstraintInfoShimmer = () => 
 (
    <Shimmer
      style={shimmerSectionStyles}
      width="40%"
      shimmerElements={[{ type: ShimmerElementType.line, height: 96 }]}
    />
  );

// eslint-disable-next-line
export const ConstraintValuesShimmer = () => 
  (
    <Shimmer
      style={shimmerSectionStyles}
      width="60%"
      shimmerElements={[{ type: ShimmerElementType.line, height: 400 }]}
    />
  );
