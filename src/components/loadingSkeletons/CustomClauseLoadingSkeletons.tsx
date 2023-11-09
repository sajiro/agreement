import { Shimmer, ShimmerElementType } from "@fluentui/react";
import { shimmerSectionStyles } from "./GeneralLoadingSkeletons";

/*
  Shimmers shared by Clause and CustomClause are in
  ClauseLoadingSkeletons
*/

// eslint-disable-next-line
export const CustomClauseActionBarShimmer = () => {
  const shimmerElements = [
    { type: ShimmerElementType.line, width: "40%", height: 28 },
    { type: ShimmerElementType.gap, width: "5%" },
    { type: ShimmerElementType.line, height: 28 },
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
export const CustomClausePivotShimmer = () => 
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
        shimmerElements={[{ type: ShimmerElementType.line, height: 400 }]}
      />
    </>
  );

// eslint-disable-next-line
export const CustomClauseTranslationsShimmer = () => 
  (
    <Shimmer
      style={{ marginTop: "5px", marginBottom: "20px" }}
      width="45%"
      shimmerElements={[{ type: ShimmerElementType.line, height: 50 }]}
    />
  );

// eslint-disable-next-line
export const CustomClauseTranslationsFormShimmer = () => 
  (
    <Shimmer
      style={shimmerSectionStyles}
      width="500px"
      shimmerElements={[{ type: ShimmerElementType.line, height: 200 }]}
    />
  );
