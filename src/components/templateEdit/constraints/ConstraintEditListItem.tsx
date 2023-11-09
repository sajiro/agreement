import {
  IComboBoxOption,
  IconButton,
  IIconProps,
  mergeStyleSets,
} from "@fluentui/react";
import CustomComboBox from "components/shared/constraints/CustomComboBox";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";
import useConstraintInfoProvider from "hooks/constraint/useConstraintInfoProvider";
import _ from "lodash";
import {
  ConstraintOperator,
  IConstraintTemplateEditPanel,
} from "models/constraints";
import { ISlotConstraint } from "models/slot";
import { useEffect, useState } from "react";

const ConstraintEditListItemStyle = mergeStyleSets({
  valueCombo: {
    input: {
      color: customTheme.secondaryGrey130,
    },
  },
  list: {
    fontSize: 12,
    color: customTheme.secondaryGrey130,
    display: "flex",
    flexWrap: "wrap",
    ".constraintName": {
      marginTop: -7,
      width: 200,
      color: customTheme.bodyColor,
      fontSize: 14,
    },
    ".constraintOperator": {
      marginTop: -7,
      marginRight: 5,
      width: 56,
      textAlign: "center",
    },
    ".constraintValues": {
      marginTop: -7,
      flex: 1,
      marginRight: 10,
    },
    ".remove": {
      textAlign: "center",
      marginRight: 10,
      marginTop: -7,
    },
    ".onlyOne": {
      fontSize: 14,
      marginTop: 7,
      marginLeft: 9,
    },
  },
});

interface IConstraintEditPanelOpts extends IComboBoxOption {
  name: string;
}

const constraintOperatorOptions: IConstraintEditPanelOpts[] = [
  {
    key: ConstraintOperator.Include.toString(),
    text: "=",
    name: stringsConst.templateEdit.constraint.equals,
  },
  {
    key: ConstraintOperator.Exclude.toString(),
    text: "!=",
    name: stringsConst.templateEdit.constraint.doesNotEqual,
  },
];

export interface IConstraintEditListProps {
  constraint: ISlotConstraint;
  constraintIndex: number;
  usedConstraints: string[];
  onConstraintUpdated: (
    constraint: ISlotConstraint,
    constraintIndex: number,
    isRemoved?: boolean
  ) => void;
  onConstraintNoValues: (constraintIndex: number) => void;
  constraintsList: IConstraintTemplateEditPanel[] | undefined;
}

const CancelIcon: IIconProps = {
  iconName: "Cancel",
  styles: { root: { fontSize: 12 } },
};

function ConstraintEditListItem({
  constraint,
  constraintIndex,
  usedConstraints,
  constraintsList,
  onConstraintUpdated,
  onConstraintNoValues,
}: IConstraintEditListProps) {
  const [constraintValueOptions, setConstraintValueOptions] = useState<
    IComboBoxOption[]
  >([]);
  const [constraintOptions, setConstraintOptions] = useState<IComboBoxOption[]>(
    []
  );
  const { constraintValues } = useConstraintInfoProvider(constraint.keyId);

  useEffect(() => {
    setConstraintOptions(
      constraintsList!.map((kvp) => {
        const isDisabled = !!usedConstraints.find((c) => c === kvp.key);
        return {
          key: kvp.name,
          text: kvp.display ? kvp.display : kvp.name,
          disabled: isDisabled,
        };
      })
    );
  }, [constraintsList, usedConstraints]);

  useEffect(() => {
    if (constraintValues?.length === 0) {
      onConstraintNoValues(constraintIndex);
      const clonedConstraint = _.cloneDeep(constraint);
      onConstraintUpdated(clonedConstraint, constraintIndex, true);
    }
    if (constraintValues) {
      setConstraintValueOptions(
        constraintValues.map((v) => ({
          key: v.name,
          text: v.display ? v.display : v.name,
        }))
      );
    }
  }, [constraintValues]);

  useEffect(() => {
    if (constraintValueOptions.length === 1) {
      const clonedConstraint = { ...constraint };
      clonedConstraint.value = constraintValueOptions[0].key as string;
      onConstraintUpdated(clonedConstraint, constraintIndex);
    }
  }, [constraintValueOptions]);

  const selectedConstraintValues = constraint.value.split(",");
  const selectedConstraintDisplayName = constraintOptions.find(
    (co) => co.key === constraint.key
  )?.text;

  const onConstraintKeyChanged = (option?: IComboBoxOption) => {
    if (option) {
      const clonedConstraint = _.cloneDeep(constraint);

      if (constraintsList) {
        const selectedConstraint = constraintsList?.find(
          (i) => i.name === option.key
        );
        if (selectedConstraint) {
          clonedConstraint.keyId = selectedConstraint.key;
        }
      }
      clonedConstraint.keyDisplay = option.text;

      clonedConstraint.key = option.key as string;
      clonedConstraint.value = "";

      clonedConstraint.valueDisplay = "";
      onConstraintUpdated(clonedConstraint, constraintIndex);
    }
  };

  const onConstraintOperatorChanged = (option?: IComboBoxOption) => {
    if (option) {
      const clonedConstraint = _.cloneDeep(constraint);
      clonedConstraint.operator = option.key as string as ConstraintOperator;

      onConstraintUpdated(clonedConstraint, constraintIndex);
    }
  };

  const onConstraintValuesChanged = (option?: IComboBoxOption) => {
    if (option) {
      const clonedConstraint = _.cloneDeep(constraint);

      if (option.selected) {
        const constraintValuesChanged = [
          ...selectedConstraintValues,
          option.key as string,
        ].filter((v) => v !== "");
        clonedConstraint.value = constraintValuesChanged.join(",");

        if (clonedConstraint!.valueDisplay) {
          const selectedConstraintValuesDisplay =
            clonedConstraint!.valueDisplay!.split(",");

          const constraintDisplayValuesChanged = [
            ...selectedConstraintValuesDisplay,
            option.text ? option.text : (option.key as string),
          ].filter((v) => v !== "");
          clonedConstraint.valueDisplay =
            constraintDisplayValuesChanged.join(",");
        } else {
          clonedConstraint.valueDisplay = constraintValuesChanged.join(",");
        }
      } else {
        const targetIndex = selectedConstraintValues.findIndex(
          (v) => v === (option.key as string)
        );

        selectedConstraintValues.splice(targetIndex, 1);
        clonedConstraint.value = selectedConstraintValues
          .filter((v) => v !== "")
          .join(",");

        clonedConstraint.valueDisplay = selectedConstraintValues.join(",");
      }

      onConstraintUpdated(clonedConstraint, constraintIndex);
    }
  };

  const onRenderOption = (item: any) => <span>{item.name}</span>;
  return (
    <div className={ConstraintEditListItemStyle.list}>
      <div className="constraintName" title={selectedConstraintDisplayName}>
        <CustomComboBox
          options={constraintOptions}
          onOptionSelected={onConstraintKeyChanged}
          defaultKey={constraint.key}
          noStyleChange={false}
          placeholder={stringsConst.common.selectValuesPlaceholder}
        />
      </div>
      <div className="constraintOperator">
        <CustomComboBox
          options={constraintOperatorOptions}
          onOptionSelected={onConstraintOperatorChanged}
          defaultKey={constraint.operator.toString()}
          onRenderOption={onRenderOption}
          noStyleChange={false}
        />
      </div>
      <div
        className="constraintValues"
        title={constraintValueOptions[0]?.text || constraint.value}
      >
        {constraintValueOptions.length === 1 ? (
          <p className="onlyOne">{constraintValueOptions[0].text ?? ""}</p>
        ) : (
          <CustomComboBox
            className={ConstraintEditListItemStyle.valueCombo}
            options={constraintValueOptions}
            onOptionSelected={onConstraintValuesChanged}
            defaultKey={selectedConstraintValues}
            noStyleChange={false}
            multiSelect
            placeholder={stringsConst.common.selectValuesPlaceholder}
            hasDelimiter
          />
        )}
      </div>
      <div className="remove">
        <IconButton
          data-automation-id="remove-added-constraint"
          iconProps={CancelIcon}
          title={stringsConst.common.remove}
          ariaLabel={stringsConst.common.remove}
          onClick={() => {
            onConstraintUpdated(constraint, constraintIndex, true);
          }}
        />
      </div>
    </div>
  );
}

export default ConstraintEditListItem;
