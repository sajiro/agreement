import { Shimmer, ShimmerElementType } from "@fluentui/react";
import { shimmerSectionStyles } from "./GeneralLoadingSkeletons";

// eslint-disable-next-line
export const ClauseActionBarShimmer = () => {
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
export const ClausePivotShimmer = () => 
  (
    <>
      <Shimmer
        style={shimmerSectionStyles}
        width="45%"
        shimmerElements={[{ type: ShimmerElementType.line, height: 30 }]}
      />
      <Shimmer
        style={shimmerSectionStyles}
        width="45%"
        shimmerElements={[{ type: ShimmerElementType.line, height: 500 }]}
      />
    </>
  );

// eslint-disable-next-line
export const TranslationsShimmer = () => 
  (
    <Shimmer
      style={shimmerSectionStyles}
      width="45%"
      shimmerElements={[{ type: ShimmerElementType.line, height: 50 }]}
    />
  );
  
// eslint-disable-next-line
  export const UsedInTemplateShimmer = () => 
  (
    <Shimmer
      style={shimmerSectionStyles}
      width="45%"
      shimmerElements={[{ type: ShimmerElementType.line, height: 50 }]}
    />
  );

// eslint-disable-next-line
export const ClauseLabelsShimmer = () => 
  (
    <Shimmer
      style={shimmerSectionStyles}
      width="45%"
      shimmerElements={[{ type: ShimmerElementType.line, height: 50 }]}
    />
  );

// eslint-disable-next-line
export const TranslationsFormShimmer = () => 
  (
    <>
      <Shimmer
        style={shimmerSectionStyles}
        width="500px"
        shimmerElements={[{ type: ShimmerElementType.line, height: 200 }]}
      />
      <Shimmer
        style={shimmerSectionStyles}
        width="500px"
        shimmerElements={[{ type: ShimmerElementType.line, height: 200 }]}
      />
    </>
  );

// shared by Clause and CustomClause
// eslint-disable-next-line
export const ClausePreviewShimmer = () => 
  (
    <Shimmer
      style={shimmerSectionStyles}
      width="45%"
      shimmerElements={[{ type: ShimmerElementType.line, height: 500 }]}
    />
  );
