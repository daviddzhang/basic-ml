import * as nj from "numjs"

/**
 * 
 * @param {number} x value of x 
 * @param {array of number} coefficients coefficients of function where [a, b, c] gets applied as a + bx + cx^2
 */
function evalCoefficients(x, coefficients) {
    const length = coefficients.length
    const xArray = nj.array(Array(length).fill(x))
    const expArray = nj.arange(0, length)
    const coefficientArray = nj.array(coefficients)

    return xArray.pow(expArray, false).multiply(coefficientArray, false).sum()
}

export { evalCoefficients }