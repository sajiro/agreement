import {
  convertToEditableConstraint,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateConstraintObject,
} from "helpers/constraint";
import _ from "lodash";
import {
  IConstraintInfoEditor,
  IFailedConstraintEdits,
  IMutableConstraint,
} from "models/constraintMutation";
import { IConstraint } from "models/constraints";
import { useCallback, useEffect, useState } from "react";

const useConstraintInfoEditor = (
  constraint: IConstraint | undefined,
  failedConstraintEdits: IFailedConstraintEdits
): IConstraintInfoEditor => {
  const [constraintInfo, setConstraintInfo] = useState<IMutableConstraint>();
  const { failedConstraintInfo } = failedConstraintEdits;

  useEffect(() => {
    if (constraint) {
      const constraintInfoToUse =
        failedConstraintInfo || convertToEditableConstraint(constraint);
      setConstraintInfo(constraintInfoToUse);
    }
  }, [constraint, failedConstraintInfo]);

  const setConstraintName = useCallback(
    (name: string, what: string) => {
      setConstraintInfo((previousConstraintInfo) => {
        const newConstraintInfo = _.cloneDeep(previousConstraintInfo);

        updateConstraintObject(name, newConstraintInfo!, undefined, what);
        return newConstraintInfo;
      });
    },
    [setConstraintInfo]
  );

  const clear = useCallback(() => {
    // Reset back to empty constraint as only create new will use the constraint info editor
    setConstraintInfo((previousConstraintInfo) => {
      const newConstraintInfo = _.cloneDeep(previousConstraintInfo);
      if (newConstraintInfo) {
        newConstraintInfo.name = newConstraintInfo.originalContent.name;
        newConstraintInfo.display = newConstraintInfo.originalContent.display;
        newConstraintInfo.isModified = false;
        newConstraintInfo.isValid = true;
      }

      return newConstraintInfo;
    });
  }, [setConstraintInfo]);

  return { constraintInfo, setConstraintName, clear };
};

export default useConstraintInfoEditor;
