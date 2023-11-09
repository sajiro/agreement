import { ActionButton, Checkbox, FontIcon, Separator } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import icons from "components/shared/Icons";
import getDisplayColumns from "helpers/columnDisplay";
import { getDisplayNameForLanguage } from "helpers/translations";
import _ from "lodash";
import { ITranslationInfo } from "models/clauses";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";

type TranslationsListingProps = {
  disabled: boolean;
  translationInfos: ITranslationInfo[];
  onSelected: (language: string, isSelected: boolean) => void;
};

// eslint-disable-next-line react/function-component-definition
const TranslationListing = ({
  disabled,
  translationInfos,
  onSelected,
}: TranslationsListingProps) => {
  const translationColumns = getDisplayColumns<ITranslationInfo>(
    translationInfos,
    3,
    5
  );

  return (
    <div
      style={{
        display: "flex",
        maxHeight: "100%",
        transition: "initial",
      }}
    >
      {translationColumns.length !== 0 ? (
        translationColumns.map((translationColumn, columnIndex) => (
          <div
            key={`column_${columnIndex}`}
            style={{ minWidth: 174, marginRight: 10 }}
          >
            {translationColumn.map((translationInfo, index) => {
              const backgroundColor = translationInfo.isNewlyUploaded
                ? customTheme.successBackground
                : customTheme.white;
              const checkBoxStyling = translationInfo.deleted
                ? { text: { textDecoration: "line-through" } }
                : { checkbox: { backgroundColor: customTheme.white } };

              if (translationInfo.isSuccessfullyDeleted) {
                return "";
              }

              return (
                <div
                  data-automation-id="translation-to-delete"
                  key={`translationCheckBox_${index}`}
                  style={{ marginBottom: 2 }}
                >
                  <div
                    style={{
                      padding: "5px",
                      backgroundColor,
                    }}
                  >
                    <Checkbox
                      styles={checkBoxStyling}
                      disabled={disabled}
                      label={getDisplayNameForLanguage(translationInfo.value)}
                      checked={translationInfo.deleted}
                      // eslint-disable-next-line @typescript-eslint/no-shadow
                      onChange={(_, checked) => {
                        const isSelected = checked || false;
                        onSelected(translationInfo.value, isSelected);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}
    </div>
  );
};

type ClauseTranslationRemoverProps = {
  disabled: boolean;
  existingTranslations: string[] | undefined;
  removedTranslations: string[] | undefined;
  successfullyRemovedTranslations: string[] | undefined;
  successfullyUploadedTranslations: string[] | undefined;
  updateRemovedTranslations: (removedTranslations: string[]) => void;
};

// eslint-disable-next-line react/function-component-definition
const ClauseTranslationRemover = ({
  disabled,
  existingTranslations,
  removedTranslations,
  successfullyRemovedTranslations,
  successfullyUploadedTranslations,
  updateRemovedTranslations,
}: ClauseTranslationRemoverProps) => {
  const translationInfos =
    existingTranslations?.map((t) => {
      const isDeleted: boolean = !!removedTranslations?.find((rt) => rt === t);
      const isSuccessfullyDeleted: boolean =
        !!successfullyRemovedTranslations?.find((srt) => srt === t);
      const isNewlyUploaded: boolean = !!successfullyUploadedTranslations?.find(
        (st) => st === t
      );

      return {
        deleted: isDeleted,
        isSuccessfullyDeleted,
        isNewlyUploaded,
        value: t,
      };
    }) || [];

  const isAllSelected = translationInfos.every((ti) => ti.deleted);
  const toggleText = isAllSelected
    ? stringsConst.clausePanel.ClauseTranslationRemover.unselectAll
    : stringsConst.clausePanel.ClauseTranslationRemover.selectAll;

  const onSelected = (language: string, isSelected: boolean) => {
    const removedTranslationsClone = _.cloneDeep<string[]>(
      removedTranslations!
    );
    const selectedTranslationIndex = removedTranslationsClone.findIndex(
      (t) => t === language
    );

    if (isSelected && selectedTranslationIndex === -1) {
      removedTranslationsClone.push(language);
    }
    if (!isSelected && selectedTranslationIndex !== -1) {
      removedTranslationsClone.splice(selectedTranslationIndex, 1);
    }

    updateRemovedTranslations(removedTranslationsClone);
  };

  const onToggleAll = () => {
    const translationsToRemove = isAllSelected ? [] : existingTranslations!;
    updateRemovedTranslations(translationsToRemove);
  };

  return (
    <div data-automation-id="delete-translations" style={{ marginTop: 40 }}>
      <Text block style={{ fontWeight: 600, marginBottom: 5 }}>
        <FontIcon iconName="Delete" />{" "}
        {
          stringsConst.clausePanel.ClauseTranslationRemover
            .deleteExistingTranslations
        }
      </Text>
      <Text
        block
        style={{ marginBottom: 12, color: customTheme.secondaryGrey130 }}
      >
        {
          stringsConst.clausePanel.ClauseTranslationRemover
            .selectTranslationsDesc
        }
      </Text>
      {translationInfos.length > 3 ? (
        <div>
          <ActionButton
            data-automation-id="select-all"
            style={{ height: 30 }}
            iconProps={icons.accept}
            text={toggleText}
            onClick={onToggleAll}
            disabled={disabled}
          />
          <Separator styles={{ root: { height: 9, paddingTop: 0 } }} />
        </div>
      ) : null}
      <TranslationListing
        disabled={disabled}
        translationInfos={translationInfos}
        onSelected={onSelected}
      />
    </div>
  );
};

export default ClauseTranslationRemover;
