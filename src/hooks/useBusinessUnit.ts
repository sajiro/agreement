import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetBusinessGroupsQuery } from "services/businessUnit";
import { businessUnitActions } from "store/businessUnitSlice";
import { RootState } from "store";
import stringsConst from "consts/strings";
import { useTrackingContext } from "components/shared/TrackingContext";
import { clauseApi } from "services/clause";
import { constraintApi } from "services/constraint";
import { templateApi } from "services/template";
import { customClauseApi } from "services/customClause";
import { slotApi } from "services/slot";
import { clauseLabelApi } from "services/clauseLabel";
import { IRouteInfo } from "router";
import useDialog from "./useDialog";
import useRouter from "./useRouter";

const useBusinessUnit = (ifInitialize?: boolean) => {
  const {
    data: businessUnits,
    error,
    isLoading,
    isFetching,
  } = useGetBusinessGroupsQuery();

  const { openErrorDialog } = useDialog();

  const dispatch = useDispatch();
  const { trackEvent } = useTrackingContext();
  const { updateRoute, getRouteInfo } = useRouter();
  const businessUnitName = useSelector((state: RootState) => state.businessUnit);

  useEffect(() => {
    const hasLoaded = !isLoading && !isFetching;
    const hasValidBusinessUnit = businessUnits && businessUnits.length > 0;

    if (hasLoaded && hasValidBusinessUnit && ifInitialize) {
      trackEvent(`${businessUnitName}- Current Business unit`);
      dispatch(businessUnitActions.setBusinessUnit(businessUnits[0]));
    }

    if (error || (hasLoaded && !hasValidBusinessUnit)) {
      const errorMessage = error ? stringsConst.dialogs.Error403.message : stringsConst.dialogs.ErrorNoRole.message;
      openErrorDialog(errorMessage);
    }
  }, [businessUnits, error, isLoading, isFetching, ifInitialize, trackEvent, openErrorDialog]);

  const setBusinessUnit = (bu: string) => {
    const routeInfo = getRouteInfo();
    const newRouteInfo: IRouteInfo = { component: routeInfo!.component, objectIdInfo: { isNothingSelected: true } };
    updateRoute(newRouteInfo, () => {
      dispatch(businessUnitActions.setBusinessUnit(bu));
      trackEvent(`${bu} Business unit selected`);
  
      // Trigger re-fetch for cached data tied to previous business unit
      dispatch(clauseApi.util.resetApiState());
      dispatch(constraintApi.util.resetApiState());
      dispatch(templateApi.util.resetApiState());
      dispatch(customClauseApi.util.resetApiState());
      dispatch(slotApi.util.resetApiState());
      dispatch(clauseLabelApi.util.resetApiState());
    });
  };

  const isProfessionalServices = (): boolean =>
    businessUnitName === "Professional Services" || businessUnitName === "New Commerce";

  return {
    businessUnits,
    businessUnitName,
    setBusinessUnit,
    isProfessionalServices,
  };
};

export default useBusinessUnit;
