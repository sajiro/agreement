import _ from "lodash";
import { IConstraintEditTracker, IFailedConstraintEdits, IMutableConstraint, IMutableConstraintValue } from "models/constraintMutation";
import { useCallback, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";

const useConstraintEditTracker = (): IConstraintEditTracker => {
  const [failedEdits, setFailedEdits] = useState<IFailedConstraintEdits>({});
  const [isSubmitting, { toggle: toggleIsSubmitting }] = useBoolean(false);

  const setFailedConstraintCreation = useCallback((constraintInfo: IMutableConstraint) => {
    setFailedEdits(previousFailedEdits => {
      const newFailedEdits = _.cloneDeep(previousFailedEdits);
      newFailedEdits.failedConstraintInfo = constraintInfo;
      return newFailedEdits;
    });
  }, [setFailedEdits]);

  const setFailedValueCreations = useCallback((constraintValues: IMutableConstraintValue[]) => {
    setFailedEdits(previousFailedEdits => {
      const newFailedEdits = _.cloneDeep(previousFailedEdits);
      newFailedEdits.failedConstraintValueCreations = constraintValues;
      return newFailedEdits;
    });
  }, [setFailedEdits]);

  const setFailedValueDeletions = useCallback((constraintValues: IMutableConstraintValue[]) => {
    setFailedEdits(previousFailedEdits => {
      const newFailedEdits = _.cloneDeep(previousFailedEdits);
      newFailedEdits.failedConstraintValueDeletions = constraintValues;
      return newFailedEdits;
    });
  }, [setFailedEdits]);

  const clear = useCallback(() => {
    setFailedEdits({});
  }, [setFailedEdits]);

  return { 
    failedEdits,
    isSubmitting,
    setFailedConstraintCreation,
    setFailedValueCreations,
    setFailedValueDeletions,
    toggleIsSubmitting,
    clear
  };
};

export default useConstraintEditTracker;