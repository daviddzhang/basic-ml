import { range } from "d3";

const FUNC_POINTS = 1000;
// for determining how many indices to buffer when cutting off large y values
const INDEX_OFFSET = 4;

/**
 * Generates plot data using supplied function based on FUNC_POINTS and x and y domains.
 * 
 * @param {function} evalFunc function to evaluate - takes in a number and returns a number
 * @param {Array} xDomain pair of numbers representing lower and upper x bounds
 * @param {Array} yDomain pair of numbers representing lower and upper y bounds
 */
function generatePlotData(evalFunc, xDomain, yDomain) {
  return createData(evalFunc, xDomain[0], xDomain[1], yDomain[0], yDomain[1]);
}

/**
 * Returns an array of pairs representing points to plot
 *
 * @param {*} func function to plot
 * @param {*} from lower bound of function
 * @param {*} to upper bound of function
 */
function createData(func, from, to, low, high) {
  const step = (to - from) / FUNC_POINTS;
  const xVals = range(from, to, step);
  const pts = xVals.map((val) => [val, func(val)]);

  const cutoffIndexes = getUnnecessaryIndexes(pts, low, high);

  return pts.filter(
    (pt, index) => index >= cutoffIndexes[0] && index <= cutoffIndexes[1]
  );
}

/**
 * Finds the cutoff point to filter off the points. This is to prevent D3 from having to render crazy y values in functions that
 * go far off the screen
 */
function getUnnecessaryIndexes(pts, low, high) {
  var lowIdx = null;
  var highIdx = null;

  for (let i = 0; i < pts.length; ++i) {
    const curPoint = pts[i];
    // if the current point is in y domain make low index the current index - INDEX_OFFSET. Leave loop to make sure low is the first earliest possible
    if (curPoint[1] >= low && curPoint[1] <= high) {
      lowIdx = Math.max(0, i - INDEX_OFFSET);
      break;
    }
  }

  for (let j = pts.length - 1; j >= 0; --j) {
    const curPoint = pts[j];
    // same thing as above, but from the right/last
    if (curPoint[1] >= low && curPoint[1] <= high) {
      highIdx = Math.min(j + INDEX_OFFSET, pts.length);
      break;
    }
  }

  return [lowIdx, highIdx];
}

export default generatePlotData;
