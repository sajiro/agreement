import { ITextFieldStyles, TextField, Text } from "@fluentui/react";
import _ from "lodash";
import { IClauseContent } from "models/clauses";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import flat from "flat";
import { contentPlaceholdersActions } from "store/contentPlaceholdersSlice";
import { useCallback, useEffect, useState } from "react";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";

const { unflatten } = require("flat");

const textFieldStyles: Partial<ITextFieldStyles> = {
  root: {
    marginTop: "12px",
    marginBottom: "12px",
  },
};

const textFieldStylesSpace: Partial<ITextFieldStyles> = {
  root: {
    marginTop: "32px",
    marginBottom: "12px",
  },
};

const textHeadingStyles: Partial<ITextFieldStyles> = {
  root: {
    fontSize: "18px",
    marginTop: "32px",
    marginBottom: "7px",
  },
};

export type ClauseDynamicValueFormProps = {
  clauseId: string | undefined;
  revisionId: string | undefined;
  dynamicPlaceholderContentInfo: IClauseContent | undefined;
};

const hasIdLengthChanged = (id: string, oldId: string) =>
  id.split(".").length !== oldId.split(".").length &&
  id.split(".").length < oldId.split(".").length;

const displayFieldHeader = (keysWithIndexArray: string[]): string =>
  keysWithIndexArray.reverse().join("").replace(/[0-9]/g, "-").slice(1);

const isExistingClause = (
  placeholders: any,
  clauseId: string,
  revisionId: string
) => {
  const hasClause = placeholders.some(
    (item: any) => item === `${clauseId}.${revisionId}`
  );

  return hasClause;
};

const DynamicForm = ({
  contents,
  clauseId,
  revisionId,
}: {
  contents: any;
  clauseId: string;
  revisionId: string;
}): JSX.Element => {
  const dispatch = useDispatch();
  const contentPlaceHolderInfo = useSelector((state: RootState) => state);

  const [placeHolder, setPlaceHolder] = useState<any[]>([]);

  const oldKey: string[] = [];
  const recursiveRender = useCallback(
    (keys: string[], dynamicValuesObject?: any) => {
      const onPropertyChangedHandler = (id: string, value: string) => {
        dispatch(
          contentPlaceholdersActions.updateRevision({
            clauseId,
            revisionId,
            id,
            value,
          })
        );
      };

      Object.entries(dynamicValuesObject).forEach(
        ([key, value] /* index */) => {
          const newKeys = [...keys];
          newKeys.push(key);
          if (Array.isArray(value)) {
            value.forEach((subValue, index) => {
              const keysWithIndex = [...newKeys];
              keysWithIndex.push(index.toString());

              setPlaceHolder((arr) => [
                ...arr,
                <Text
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${key}.${index}`}
                  id={`${key}.${index}`}
                  block
                  styles={textHeadingStyles}
                >
                  {displayFieldHeader([...keysWithIndex])}
                </Text>,
              ]);
              if (
                Object.values(subValue).every(
                  (item) => Array.isArray(item) && typeof item !== "string"
                )
              ) {
                setPlaceHolder((prevActions) =>
                  // Filter out the item with the matching index
                  prevActions.filter((i) => i < prevActions.length - 1)
                );
              }
              recursiveRender(keysWithIndex, subValue);
              // if (index === value.length - 1) {
              //   endOfArray = true;
              // }
            });
            return;
          }
          if (typeof value === "object") {
            recursiveRender([...newKeys], value);
            return;
          }

          const keyPrefix = keys.join(".");
          // need to check if the id length has changed so add more spacing if an input is part of an object but comes after an array
          const idChange = hasIdLengthChanged(keyPrefix, oldKey.pop() || "");
          oldKey.push(keyPrefix);
          setPlaceHolder((arr) => [
            ...arr,
            <TextField
              key={`${keyPrefix}.${key}`}
              id={keyPrefix ? `${keyPrefix}.${key}` : `${key}`}
              label={key.toString()}
              styles={idChange ? textFieldStylesSpace : textFieldStyles}
              value={value as string}
              // eslint-disable-next-line @typescript-eslint/no-shadow
              onChange={(_, newValue?: string) => {
                onPropertyChangedHandler(
                  keyPrefix ? `${keyPrefix}.${key}` : `${key}`,
                  newValue!
                );
              }}
            />,
          ]);
        }
      );
    },
    [clauseId, dispatch, revisionId]
  );

  useEffect(() => {
    if (!_.isEmpty(contentPlaceHolderInfo.contentPlaceholders)) {
      if (
        isExistingClause(
          Object.keys(contentPlaceHolderInfo.contentPlaceholders),
          clauseId,
          revisionId
        )
      ) {
        const allClausePlaceholders = Object.entries(
          contentPlaceHolderInfo.contentPlaceholders
        );
        // loop through entries
        // find the right clause and find the value
        const currentClause = allClausePlaceholders.filter(
          (item) => item[0] === `${clauseId}.${revisionId}`
        );
        const unflat = unflatten(currentClause[0][1]);
        setPlaceHolder([]);
        recursiveRender([], unflat);
      } else {
        const flats = flat(contents.contents) as { key: string; value: string };
        Object.entries(flats).forEach(([key]) => {
          dispatch(
            contentPlaceholdersActions.updateRevision({
              clauseId,
              revisionId,
              id: key,
              value: "",
            })
          );
        });
      }
    } else {
      const flats = flat(contents.contents) as { key: string; value: string };
      Object.entries(flats).forEach(([key]) => {
        dispatch(
          contentPlaceholdersActions.updateRevision({
            clauseId,
            revisionId,
            id: key,
            value: "",
          })
        );
      });
    }
  }, [
    clauseId,
    contentPlaceHolderInfo.contentPlaceholders,
    contents.contents,
    dispatch,
    recursiveRender,
    revisionId,
  ]);

  return placeHolder as any;
};

// eslint-disable-next-line react/function-component-definition
const ClauseDynamicValuesForm = ({
  clauseId,
  revisionId,
  dynamicPlaceholderContentInfo,
}: ClauseDynamicValueFormProps) => (
  <div style={{ maxWidth: "50%" }}>
    <p style={{ color: customTheme.secondaryGrey130 }}>
      {stringsConst.clausePanel.ClauseDynamicValuesForm.intro}
    </p>
    <DynamicForm
      contents={dynamicPlaceholderContentInfo}
      clauseId={clauseId as string}
      revisionId={revisionId as string}
    />
  </div>
);

export default ClauseDynamicValuesForm;
