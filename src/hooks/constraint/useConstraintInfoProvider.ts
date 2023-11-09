import { skipToken } from "@reduxjs/toolkit/dist/query";
import { IConstraintInfo } from "models/constraints";
import { useGetConstraintQuery, useGetConstraintValuesQuery } from "services/constraint";

const useConstraintInfoProvider = (constraintId: string|undefined): IConstraintInfo => {
  const constraintInfoResponse = useGetConstraintQuery(constraintId ?? skipToken);
  const constraintValuesResponse = useGetConstraintValuesQuery(constraintId ?? skipToken);
  const hasData = !!constraintInfoResponse.data && !!constraintValuesResponse.data;
  const isLoading = constraintInfoResponse.isFetching || constraintValuesResponse.isFetching || !hasData;

  return {
    constraint: constraintInfoResponse.data,
    constraintValues: constraintValuesResponse.data,
    isLoading
  }
};

export default useConstraintInfoProvider;