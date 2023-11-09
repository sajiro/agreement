import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { isMutationCompleted } from "helpers/mutation";
import useRouter from "hooks/useRouter";
import { IMutationResult } from "models/constraintMutation";
import { IConstraintValue } from "models/constraints";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { routeDefinitions } from "router";
import { invalidateConstraintCache, useDeleteConstraintMutation, useDeleteConstraintValuesMutation } from "services/constraint";

const useDeleteCompleteConstraintMutation = () => {
  const dispatch = useDispatch();
  const { goToRoute } = useRouter();
  const [deleteConstraintValues, deleteConstraintValuesResult] = useDeleteConstraintValuesMutation();
  const [deleteConstraint, deleteConstraintResult] = useDeleteConstraintMutation();
  const constraintIdRef = useRef<string>("");
  const [deletionResult, setDeletionResult] = useState<IMutationResult>({ isSuccess: false, isError: false, status: QueryStatus.uninitialized })

  useEffect(() => {
    if (deleteConstraintValuesResult.isSuccess) {
      deleteConstraint({ allowRetry: true, constraintId: constraintIdRef.current });
    }

    if (deleteConstraintValuesResult.isError) {
      setDeletionResult({ isSuccess: false, isError: true, status: QueryStatus.rejected });
    }
  }, [deleteConstraintValuesResult, deleteConstraint, setDeletionResult]);

  useEffect(() => {
    if (isMutationCompleted(deleteConstraintResult)) {
      setDeletionResult({ isSuccess: deleteConstraintResult.isSuccess, isError: deleteConstraintResult.isError, status: deleteConstraintResult.status });
      if (deleteConstraintResult.isSuccess) {
        goToRoute(routeDefinitions.Constraints.getRouteInfo({ isNothingSelected: true }));
        dispatch(invalidateConstraintCache());
      }
    }
  }, [deleteConstraintResult, setDeletionResult, dispatch, goToRoute]);

  const deleteCompleteConstraint = useCallback((constraintId: string, constraintValues: IConstraintValue[]) => {
    constraintIdRef.current = constraintId;
    if (constraintValues.length > 0) {
      deleteConstraintValues({
        allowRetry: true,
        constraintId,
        constraintValueInfos: constraintValues.map(v => ({ id: v.id, name: v.name, display: v.display }))
      });

      return;
    }

    deleteConstraint({ allowRetry: true, constraintId });
  }, [deleteConstraintValues, deleteConstraint]);

  const resetDeletionResult = () => {
    setDeletionResult({ isSuccess: false, isError: false, status: QueryStatus.uninitialized });
  };

  return { deletionResult, deleteCompleteConstraint, resetDeletionResult };
};

export default useDeleteCompleteConstraintMutation;