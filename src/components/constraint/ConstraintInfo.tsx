import {
  ConstraintActionBarShimmer,
  ConstraintInfoShimmer,
  ConstraintValuesShimmer,
} from "components/loadingSkeletons/ConstraintLoadingSkeletons";
import { TitleShimmer } from "components/loadingSkeletons/GeneralLoadingSkeletons";
import { InfoPageTitleWithLoading } from "components/shared/InfoPageTitle";
import { ConstraintActionBarWithLoading } from "components/constraint/ConstraintActionBar";
import { ConstraintInfoCardWithLoading } from "components/constraint/ConstraintInfoCard";
import { ConstraintGroupedListWithLoading } from "components/constraint/ConstraintGroupedList";
import NoItemSelectedDisplay from "components/shared/NoItemSelectedDisplay";
import useConstraintInfoProvider from "hooks/constraint/useConstraintInfoProvider";
import { IAgreementObjectId } from "models/agreements";

function ConstraintInfo({
  constraintId,
  isNothingSelected,
}: IAgreementObjectId) {
  const { constraint, constraintValues, isLoading } =
    useConstraintInfoProvider(constraintId);

  return (
    <>
      {isNothingSelected && <NoItemSelectedDisplay itemType="constraint" />}
      {!isNothingSelected && (
        <>
          <InfoPageTitleWithLoading
            isLoading={isLoading}
            LoadingSubstitute={TitleShimmer}
            title={
              constraint?.display !== ""
                ? constraint?.display
                : constraint?.name
            }
          />
          <ConstraintActionBarWithLoading
            isLoading={isLoading}
            LoadingSubstitute={ConstraintActionBarShimmer}
            constraintId={constraintId}
            constraintValues={constraintValues}
          />
          <ConstraintInfoCardWithLoading
            isLoading={isLoading}
            LoadingSubstitute={ConstraintInfoShimmer}
            constraint={constraint}
          />
          <ConstraintGroupedListWithLoading
            isLoading={isLoading}
            LoadingSubstitute={ConstraintValuesShimmer}
            constraintValues={constraintValues}
          />
        </>
      )}
    </>
  );
}

export default ConstraintInfo;
