import * as math from "mathjs";

/**
 * Returns a string representation of the function given by the coefficients.
 *
 * @param {array of number} coefficients coefficients of function where [a, b, c] gets applied as a + bx + cx^2
 */
function generateCoefficientsFunc(coefficients) {
  const nums = coefficients.map((num, index) => num + "x^" + index);
  const res = nums.join(" + ");

  return math.compile(res);
}

export { generateCoefficientsFunc };
