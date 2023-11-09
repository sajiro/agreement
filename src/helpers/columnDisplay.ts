import _ from "lodash";

const getItemsPerColumn = <T>(
  values: T[],
  maxColumnCount: number,
  minValuesPerColumn: number
) => {
  let unallocatedCount = values.length;
  const itemsPerColumn: number[] = Array(maxColumnCount).fill(0);
  let allocationCount = 0;
  while (unallocatedCount > 0) {
    while (
      unallocatedCount > 0 &&
      allocationCount < maxColumnCount * minValuesPerColumn
    ) {
      for (let i = 0; i < maxColumnCount && unallocatedCount > 0; i += 1) {
        const moreUnallocated = unallocatedCount - minValuesPerColumn > 0;
        const itemsForColumn = moreUnallocated
          ? minValuesPerColumn
          : unallocatedCount;
        itemsPerColumn[i] += itemsForColumn;

        unallocatedCount -= itemsForColumn;
        allocationCount += itemsForColumn;
      }
    }

    for (let i = 0; i < maxColumnCount && unallocatedCount > 0; i += 1) {
      itemsPerColumn[i] += 1;
      unallocatedCount -= 1;
      allocationCount += 1;
    }
  }

  return itemsPerColumn;
};

const getDisplayColumns = <T>(
  values: T[],
  maxColumnCount: number,
  minValuesPerColumn: number
) => {
  const valuesClone = _.cloneDeep(values);
  const itemsPerColumn = getItemsPerColumn(
    valuesClone,
    maxColumnCount,
    minValuesPerColumn
  );
  const nonZeroItemsPerColumn = itemsPerColumn.filter((c) => c > 0);
  const valueColumns: T[][] = Array(nonZeroItemsPerColumn.length);
  for (let i = 0; i < valueColumns.length; i += 1) {
    valueColumns[i] = values.splice(0, nonZeroItemsPerColumn[i]);
  }
  return valueColumns;
};

export default getDisplayColumns;
