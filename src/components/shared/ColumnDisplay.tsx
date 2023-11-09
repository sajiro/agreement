import { css, mergeStyleSets } from "@fluentui/react";
import getDisplayColumns from "helpers/columnDisplay";
import { CSSProperties } from "react";

export interface IColumnDisplayProps {
  values: string[];
  maxColumnCount: number;
  minValuesPerColumn: number;
  noValuesMessage: string;
  isSmallSection?: boolean;
  minWidth?: number | string;
  styled?: CSSProperties;
}

const styles = mergeStyleSets({
  noContent: {
    // color: theme.semanticColors.errorText,
  },
  cell: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    zIndex: 1,
  },
  translationsSection: {
    display: "flex",
    flex: "0 0 45%",
    flexDirection: "column",
    lineHeight: 20,
    alignItems: "start",
    paddingTop: 11,
    paddingBottom: 11,
  },
});

// eslint-disable-next-line
const NoValuesDisplay = ({ noValuesMessage }: { noValuesMessage: string }) => (
  <span 
    data-automation-id="columnDisplay-noValue"
    className={styles.noContent}
  >
    {noValuesMessage}
  </span>
);

// eslint-disable-next-line
const ValuesDisplay = ({
  values,
  maxColumnCount,
  minValuesPerColumn,
  minWidth,
}: {
  values: string[];
  maxColumnCount: number;
  minValuesPerColumn: number;
  minWidth: number | string;
}) => {
  const displayColumns = getDisplayColumns<string>(
    values,
    maxColumnCount,
    minValuesPerColumn
  );
  return (
    <>
      {displayColumns.map((column, columnIndex) => (
        <div
          key={`values_display_column_${columnIndex}`}
          style={{ minWidth, marginRight: "24px" }}
        >
          {column.map((value, valueIndex) => (
            <div data-automation-id="listingsLayout-info-columndisplay" key={`values_display_${columnIndex}_${valueIndex}`}>
              {value}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

// eslint-disable-next-line
const ColumnDisplay = ({
  values,
  maxColumnCount,
  minValuesPerColumn,
  noValuesMessage,
  isSmallSection,
  minWidth = 160,
  styled = {},
}: IColumnDisplayProps) => {
  const hasValues = values.length > 0;

  return (
    <div
      className={css(styles.cell, styles.translationsSection)}
      style={isSmallSection ? { paddingTop: 1 } : styled || {}}
    >
      <div style={{ display: "flex", overflow: "hidden" }}>
        {hasValues && (
          <ValuesDisplay
            values={values}
            maxColumnCount={maxColumnCount}
            minValuesPerColumn={minValuesPerColumn}
            minWidth={minWidth}
          />
        )}
        {!hasValues && <NoValuesDisplay noValuesMessage={noValuesMessage} />}
      </div>
    </div>
  );
};

export default ColumnDisplay;
