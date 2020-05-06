import { range } from "d3"

const FUNC_POINTS = 400

function generatePlotData(evalFunc, xScale) {
    return createData(evalFunc, xScale[0], xScale[1])
}

/**
 * Returns an array of pairs representing points to plot
 * 
 * @param {*} func function to plot 
 * @param {*} from lower bound of function
 * @param {*} to upper bound of function
 */
function createData(func, from, to) {
    const step = (to - from) / FUNC_POINTS
    const xVals = range(from, to, step)
    const pts = xVals.map(val => [val, func(val)])

    return pts
}

export default generatePlotData