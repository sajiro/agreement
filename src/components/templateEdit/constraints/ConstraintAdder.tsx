import { ActionButton, IComboBox, IComboBoxOption } from "@fluentui/react";
import CustomComboBox from "components/shared/constraints/CustomComboBox";
import icons from "components/shared/Icons";
import { useTrackingContext } from "components/shared/TrackingContext";
import stringsConst from "consts/strings";
import { IConstraintTemplateEditPanel } from "models/constraints";
import { useCallback, useEffect, useRef, useState } from "react";

export type ConstraintEditAdderProps = {
  usedConstraints: string[];
  onConstraintSelected: (option?: IComboBoxOption) => void;
  constraintsList: IConstraintTemplateEditPanel[] | undefined;
};

function ConstraintAdder({
  usedConstraints,
  onConstraintSelected,
  constraintsList,
}: ConstraintEditAdderProps) {
  const comboBoxRef = useRef<IComboBox>(null);
  const [addConstraints, setAddConstraints] = useState(false);
  const { trackEvent } = useTrackingContext();

  const constraintOptions: IComboBoxOption[] = constraintsList!.map((kvp) => ({
    key: kvp.key,
    text: kvp.display ? kvp.display : kvp.name,
  }));

  const onOpenClick = useCallback(
    (what: boolean) => comboBoxRef.current?.focus(what),
    []
  );

  useEffect(() => {
    if (addConstraints) {
      onOpenClick(true);
    }
  }, [addConstraints]);

  return (
    <div>
      {!addConstraints ? (
        <ActionButton
          data-automation-id="constraint-adder-add-constraint-button"
          iconProps={icons.add}
          allowDisabledFocus
          onClick={() => {
            setAddConstraints(true);
            trackEvent("Template add constraint clicked");
          }}
        >
          {stringsConst.templateEdit.constraint.addConstraints}
        </ActionButton>
      ) : (
        <CustomComboBox
          componentRef={comboBoxRef}
          options={constraintOptions}
          onOptionSelected={(option?: IComboBoxOption) => {
            if (option) {
              onConstraintSelected(option);
            }
          }}
          defaultKey={usedConstraints}
          noStyleChange={false}
          multiSelect
          onMenuDismissed={() => {
            setTimeout(() => {
              setAddConstraints(false);
            }, 0);
          }}
        />
      )}
    </div>
  );
}

export default ConstraintAdder;
