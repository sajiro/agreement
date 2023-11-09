import getDisplayColumns from "./columnDisplay";

describe("getDisplayColumns function", () => {
  it.each([
    [[], 1, 1, []],
    [["x1"], 1, 1, [["x1"]]],
    [["x1", "x2", "x3"], 3, 3, [["x1", "x2", "x3"]]],
    [["x1", "x2", "x3"], 3, 1, [["x1"], ["x2"], ["x3"]]],
    [["x1", "x2", "x3", "x4", "x5"], 3, 1, [["x1", "x2"], ["x3", "x4"], ["x5"]]],
    [["x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9"], 5, 10, [["x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9"]]],
    [["x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9"], 3, 5, [["x1", "x2", "x3", "x4", "x5"], ["x6", "x7", "x8", "x9"]]]
  ])("divides data into correct number of columns %#", (
    values: string[],
    maxColumnCount: number,
    minValuesPerColumn: number,
    expectedResult: string[][]
  ) => {
    const columns = getDisplayColumns(values, maxColumnCount, minValuesPerColumn);
    expect(columns).toEqual(expectedResult);
  });
});