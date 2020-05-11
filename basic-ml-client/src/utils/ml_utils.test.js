import { generateCoefficientsFunc } from "./ml_utils";

test("having one coefficient should be a constant", () => {
  expect(generateCoefficientsFunc([-3]).evaluate({x: 2})).toBe(-3);
});

test("having multiple coefficients should lead to ascending degrees", () => {
    expect(generateCoefficientsFunc([-3.5, 1, 2]).evaluate({x: 2})).toBe(6.5);
  });

  test("negative coefficients with +", () => {
    expect(generateCoefficientsFunc([-3.5, -1, 2]).evaluate({x: 3})).toBe(11.5);
  });
