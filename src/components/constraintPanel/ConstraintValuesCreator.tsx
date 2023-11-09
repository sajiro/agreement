import { IConstraintValuesEditor } from "models/constraintMutation";
import {
  DefaultButton,
  IContextualMenuItem,
  IContextualMenuProps,
  Label,
  mergeStyleSets,
  Text,
} from "@fluentui/react";
import icons from "components/shared/Icons";
import { CSSProperties } from "react";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";
import ConstraintEditSection from "./ConstraintEditSection";
import ConstraintCustomTextfield from "./ConstraintCustomTextfield";

const TRUE_FALSE_VALUE_OPTION = "TrueFalse";

const styles = mergeStyleSets({
  LabelContainer: {
    display: "flex",
    borderBottom: `1px solid ${customTheme.divBorderColor}`,
    fontSize: 12,
    justifyContent: "space-between",
    paddingBottom: 3,
    ".ms-Label": {
      width: "100%",
    },
    ".ms-Label:first-child": {
      paddingLeft: 8,
      marginRight: -21,
    },
  },
  textFont: {
    fontWeight: 400,
  },
});

function ConstraintValuesCreator({
  constraintValuesEditor,
  isSubmitting,
  isNewConstraint,
}: {
  constraintValuesEditor: IConstraintValuesEditor;
  isSubmitting: boolean;
  isNewConstraint: boolean;
}) {
  const {
    newConstraintValues,
    addConstraintValues,
    updateNewConstraintValue,
    removeNewConstraintValue,
  } = constraintValuesEditor;

  const onAddConstraintsItemClicked = (constraintValuesInfo: string) => {
    if (constraintValuesInfo === TRUE_FALSE_VALUE_OPTION) {
      addConstraintValues(["true", "false"]);
    } else {
      const constraintValuesRequired = parseInt(constraintValuesInfo, 10);
      const constraintValueNames = new Array(constraintValuesRequired).fill("");
      addConstraintValues(constraintValueNames);
    }
  };

  const getConstraintValueItem = (
    key: string,
    text: string
  ): IContextualMenuItem => ({
    key,
    text,
    onClick: (_ev, item) => {
      _ev?.preventDefault();
      onAddConstraintsItemClicked(item!.key);
    },
  });

  const addConstraintValueItems: IContextualMenuItem[] = Array.from(
    Array(10).keys()
  ).map((v) => getConstraintValueItem((v + 1).toString(), (v + 1).toString()));
  addConstraintValueItems.splice(
    2,
    0,
    getConstraintValueItem(TRUE_FALSE_VALUE_OPTION, "2 - True/False")
  ); // add option for True/False values
  const addConstraintValueOptions: IContextualMenuProps = {
    items: addConstraintValueItems,
  };
  const disabledStyle: CSSProperties = {
    pointerEvents: isSubmitting ? "none" : undefined,
  };

  return (
    <ConstraintEditSection
      style={{ display: "flex", flexDirection: "column", marginTop: 20 }}
    >
      {isNewConstraint ? (
        <Label required>
          {stringsConst.constraint.ConstraintGroupedList.headingValues}
        </Label>
      ) : (
        <Label>
          {stringsConst.constraintPanel.ConstraintValuesCreator.newValues}
        </Label>
      )}

      <div
        style={{
          borderBottom: `1px solid ${customTheme.divBorderColor}`,
          margin: "5px 0px 3px 0px",
        }}
      >
        <div style={{ width: "fit-content", ...disabledStyle }}>
          <DefaultButton
            aria-hidden="true"
            styles={{
              root: {
                border: "none",
                padding: "0px 5px 0px 0px",
              },
              icon: {
                color: customTheme.focusColor,
              },
              splitButtonMenuButton: {
                backgroundColor: "transparent",
                border: "none",
              },
              textContainer: { span: { fontWeight: 400 } },
            }}
            iconProps={icons.add}
            text={
              stringsConst.constraintPanel.ConstraintValuesCreator
                .addSingleValueBtn
            }
            menuProps={addConstraintValueOptions}
            onClick={() => {
              onAddConstraintsItemClicked("1");
            }}
            splitButtonAriaLabel={
              stringsConst.constraintPanel.ConstraintValuesCreator
                .addMultipleValuesAria
            }
            aria-roledescription="split button"
            split
            data-automation-id="constraintvaluesingleadd"
          />
        </div>
      </div>
      <div>
        {newConstraintValues.length !== 0 && (
          <div className={styles.LabelContainer}>
            <Label required>{stringsConst.common.listings.nameValue}</Label>
            <Label>{stringsConst.common.infoItems.friendlyName}</Label>
          </div>
        )}
        {newConstraintValues.length === 0 && (
          <div style={{ paddingTop: "8px" }}>
            <Text style={{ color: customTheme.secondaryGrey130 }}>
              {
                stringsConst.constraintPanel.ConstraintValuesCreator
                  .addOneOrMoreValues
              }
            </Text>
          </div>
        )}

        {newConstraintValues!.map((constraintValue, index) => (
          <div key={`constraintValue_${index}`}>
            <ConstraintCustomTextfield
              isFocused={newConstraintValues.length > 0 && index === 0}
              constraintValue={constraintValue}
              toggleValueDeletion={removeNewConstraintValue}
              onValueUpdated={updateNewConstraintValue}
              disabled={isSubmitting}
              index={index}
            />
          </div>
        ))}
      </div>
    </ConstraintEditSection>
  );
}

export default ConstraintValuesCreator;
