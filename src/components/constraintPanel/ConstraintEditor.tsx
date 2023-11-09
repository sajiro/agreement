import {
  IConstraintInfoEditor,
  IConstraintValuesEditor,
} from "models/constraintMutation";
import { Text } from "@fluentui/react";
import customTheme from "helpers/customTheme";
import stringsConst from "consts/strings";
import ConstraintCreator from "./ConstraintCreator";
import ConstraintValuesCreator from "./ConstraintValuesCreator";
import ConstraintValuesRemover from "./ConstraintValuesRemover";
import LockedConstraintValuesDisplay from "./LockedConstraintValuesDisplay";

export type ConstraintEditorProps = {
  constraintInfoEditor: IConstraintInfoEditor;
  constraintValuesEditor: IConstraintValuesEditor;
  isNewConstraint: boolean;
  isSubmitting: boolean;
};

function ConstraintEditor({
  constraintInfoEditor,
  constraintValuesEditor,
  isNewConstraint,
  isSubmitting,
}: ConstraintEditorProps) {
  return (
    <div
    // style={{ backgroundColor: "pink" /*  height: "calc(100vh - 180px)"  */ }}
    >
      {isNewConstraint && (
        <ConstraintCreator
          constraintInfoEditor={constraintInfoEditor}
          isSubmitting={isSubmitting}
        />
      )}
      <ConstraintValuesCreator
        constraintValuesEditor={constraintValuesEditor}
        isSubmitting={isSubmitting}
        isNewConstraint={isNewConstraint}
      />

      {!isNewConstraint && (
        <ConstraintValuesRemover
          constraintValuesEditor={constraintValuesEditor}
          isSubmitting={isSubmitting}
        />
      )}
      {isNewConstraint && (
        <Text style={{ color: customTheme.secondaryGrey130 }}>
          {stringsConst.constraintPanel.ConstraintEditor.optionalClauseInfo}
        </Text>
      )}
      {!isNewConstraint && (
        <LockedConstraintValuesDisplay
          lockedConstraintValues={constraintValuesEditor.lockedConstraintValues}
        />
      )}
    </div>
  );
}

export default ConstraintEditor;
