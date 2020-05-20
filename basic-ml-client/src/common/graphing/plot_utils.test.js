import { getDomains, X_BUFFER, Y_BUFFER, zipXY } from "./plot_utils";

const SCATTER1 = [
  [-1, 1],
  [-10, 20],
  [-20, -1],
  [41, -2],
  [21, 3],
];

const SCATTER2 = [
  [-100, -100],
  [-10, 20],
  [-20, -1],
  [41, -2],
  [21, 3],
];

const SCATTER3 = [
  [100, 100],
  [-10, 20],
  [-20, -1],
  [41, -2],
  [21, 3],
];

const SCATTER4 = [
  [100, -100],
  [-10, 20],
  [-20, -1],
  [41, -2],
  [21, 3],
];

const SCATTER5 = [
  [-100, 100],
  [-10, 20],
  [-20, -1],
  [41, -2],
  [21, 3],
];

const LINE1 = [
  {
    data: [
      [-1, 1],
      [-10, 20],
      [-20, -1],
      [41, -2],
      [21, 3],
    ],
  },
  {
    data: [
      [-100, 100],
      [-10, 20],
      [-20, -1],
      [40, -7],
      [21, 3],
    ],
  },
];

const LINE2 = [
  {
    data: [
      [-101, 1],
      [-10, 20],
      [1000, -9],
      [41, 200],
      [21, 3],
    ],
  },
  {
    data: [
      [-100, 100],
      [-10, 20],
      [-20, -1],
      [40, -7],
      [21, 3],
    ],
  },
];

test("returns correct x and y domains in scatter - min/max in middle", () => {
  expect(getDomains({ scatter: SCATTER1 })).toEqual({
    x: [-20 - X_BUFFER, 41 + X_BUFFER],
    y: [-2 - Y_BUFFER, 20 + Y_BUFFER],
  });
});

test("returns correct x and y domains in scatter - min at start", () => {
  expect(getDomains({ scatter: SCATTER2 })).toEqual({
    x: [-100 - X_BUFFER, 41 + X_BUFFER],
    y: [-100 - Y_BUFFER, 20 + Y_BUFFER],
  });
});

test("returns correct x and y domains in scatter - max at start", () => {
  expect(getDomains({ scatter: SCATTER3 })).toEqual({
    x: [-20 - X_BUFFER, 100 + X_BUFFER],
    y: [-2 - Y_BUFFER, 100 + Y_BUFFER],
  });
});

test("returns correct x and y domains in scatter - max x min y at start", () => {
  expect(getDomains({ scatter: SCATTER4 })).toEqual({
    x: [-20 - X_BUFFER, 100 + X_BUFFER],
    y: [-100 - Y_BUFFER, 20 + Y_BUFFER],
  });
});

test("returns correct x and y domains in scatter - min x max y at start", () => {
  expect(getDomains({ scatter: SCATTER5 })).toEqual({
    x: [-100 - X_BUFFER, 41 + X_BUFFER],
    y: [-2 - Y_BUFFER, 100 + Y_BUFFER],
  });
});

test("return correct x and y domains in line", () => {
  expect(getDomains({ lines: LINE1 })).toEqual({
    x: [-100 - X_BUFFER, 41 + X_BUFFER],
    y: [-7 - Y_BUFFER, 100 + Y_BUFFER],
  });
});

test("return correct x and y domains in line - properly updates", () => {
  expect(getDomains({ lines: LINE2 })).toEqual({
    x: [-101 - X_BUFFER, 1000 + X_BUFFER],
    y: [-9 - Y_BUFFER, 200 + Y_BUFFER],
  });
});

test("no data default", () => {
  expect(getDomains({})).toEqual({
    x: [-3 - X_BUFFER, 3 + X_BUFFER],
    y: [-5 - Y_BUFFER, 5 + Y_BUFFER],
  });
});

test("throw error if no scatter is defined", () => {
  expect(() => getDomains({ scatter: [] })).toThrow(Error);
});

test("throw error if no lines are defined", () => {
  expect(() => getDomains({ lines: [] })).toThrow(Error);
});

test("zip empty array", () => {
  expect(zipXY([], [])).toEqual([]);
});

test("zip two arrays array", () => {
  expect(zipXY([1, 2, 3], [3, 2, 1])).toEqual([
    [1, 3],
    [2, 2],
    [3, 1],
  ]);
});
