import {
  convertToEditableConstraintValues,
  getNewConstraintValue,
  setConstraintObjectValidity,
  updateConstraintObject,
} from "helpers/constraint";
import _ from "lodash";
import {
  IConstraintValuesEditor,
  IFailedConstraintEdits,
  IMutableConstraintValue,
} from "models/constraintMutation";
import { IConstraintValue } from "models/constraints";
import { useCallback, useEffect, useMemo, useState } from "react";

const useConstraintValuesEditor = (
  constraintValues: IConstraintValue[] | undefined,
  failedConstraintEdits: IFailedConstraintEdits
): IConstraintValuesEditor => {
  const [newConstraintValues, setNewConstraintValues] = useState<
    IMutableConstraintValue[]
  >([]);
  const [removableConstraintValues, setRemovableConstraintValues] = useState<
    IMutableConstraintValue[]
  >([]);
  const [lockedConstraintValues, setLockedConstraintValues] = useState<
    IConstraintValue[]
  >([]);
  const { failedConstraintValueCreations, failedConstraintValueDeletions } =
    failedConstraintEdits;

  const allConstraintValues = useMemo(
    () => [
      ...newConstraintValues,
      ...removableConstraintValues,
      ...lockedConstraintValues,
    ],
    [newConstraintValues, removableConstraintValues, lockedConstraintValues]
  );

  useEffect(() => {
    if (constraintValues) {
      const lockedValues = constraintValues.filter((v) => v.inUse);
      const removableValues = _.cloneDeep(
        constraintValues.filter((v) => !v.inUse)
      );
      const editableRemovableValues =
        convertToEditableConstraintValues(removableValues);
      const newValues = failedConstraintValueCreations || [];
      failedConstraintValueDeletions?.forEach((failedValue) => {
        const value = editableRemovableValues.find(
          (v) => v.id === failedValue.id
        );
        value!.errorMessage = failedValue!.errorMessage;
        value!.isDeleted = true;
      });

      setNewConstraintValues(newValues);
      setRemovableConstraintValues(editableRemovableValues);
      setLockedConstraintValues(lockedValues);
    }
  }, [
    constraintValues,
    failedConstraintValueCreations,
    failedConstraintValueDeletions,
  ]);

  const updateNewConstraintValue = useCallback(
    (id: string, newValue: any, what: string) => {
      setNewConstraintValues((previousNewValues) => {
        const newValues = _.cloneDeep(previousNewValues);

        const valueToUpdate = newValues!.find((v) => v.id === id);
        updateConstraintObject(
          newValue,
          valueToUpdate!,
          allConstraintValues,
          what
        );
        return newValues;
      });
    },
    [setNewConstraintValues, allConstraintValues]
  );

  const addConstraintValues = useCallback(
    (values: string[]) => {
      setNewConstraintValues((previousNewValues) => {
        const constraintValuesToAdd: IMutableConstraintValue[] = values.map(
          (value, index) =>
            getNewConstraintValue(value, `${performance.now()}_${index}`) // Need to ensure ID is unique
        );

        const newValues = _.cloneDeep(previousNewValues);

        newValues!.push(...constraintValuesToAdd);
        newValues!.forEach((v) =>
          setConstraintObjectValidity(v, allConstraintValues, true)
        );
        return newValues;
      });
    },
    [setNewConstraintValues, allConstraintValues]
  );

  const removeNewConstraintValue = useCallback(
    (id: string) => {
      setNewConstraintValues((previousNewValues) => {
        const newValues = _.cloneDeep(previousNewValues);
        const indexToRemove = newValues!.findIndex((v) => v.id === id);
        newValues.splice(indexToRemove, 1);
        return newValues;
      });
    },
    [setNewConstraintValues]
  );

  const toggleConstraintValueDeletion = useCallback(
    (valueId: string) => {
      setRemovableConstraintValues((previousRemovableValues) => {
        const removableValues = _.cloneDeep(previousRemovableValues);
        const value = removableValues.find((v) => v.id === valueId);
        value!.isDeleted = !value!.isDeleted;
        if (value?.errorMessage) {
          value.errorMessage = undefined;
        }

        return removableValues;
      });
    },
    [setRemovableConstraintValues]
  );

  const clear = useCallback(() => {
    setNewConstraintValues([]);

    // Need to reset the removable value changes back to "clean" state
    setRemovableConstraintValues((previousRemovableValues) => {
      const removableValues = _.cloneDeep(previousRemovableValues);

      // eslint-disable-next-line no-param-reassign
      removableValues.forEach((v) => {
        // eslint-disable-next-line no-param-reassign
        v.isDeleted = false;
      });
      return removableValues;
    });
  }, [setNewConstraintValues, setRemovableConstraintValues]);

  return {
    newConstraintValues,
    removableConstraintValues,
    lockedConstraintValues,
    updateNewConstraintValue,
    addConstraintValues,
    removeNewConstraintValue,
    toggleConstraintValueDeletion,
    clear,
  };
};

export default useConstraintValuesEditor;
