import { range } from "d3"

const FUNC_SAMPLES = 100

function generatePlotData(evalFunc, xScale) {
    return createData(evalFunc, [xScale[0], xScale[1], FUNC_SAMPLES])
}

/**
 * Returns an array of pairs representing points to plot
 * 
 * @param {*} func function to plot
 * @param {*} t an array of format [min, max, numSamples]
 */
function createData(func, t) {
    const x = (x) => x
    var dt = (t[1] - t[0]) / t[2];
    var ts = range(t[0], t[1] + dt, dt);
    var t0 = ts.shift();
  
    var pts = [[x(t0), func(t0)]];
    for (var i = 1; i < ts.length; i++) {
        var t1 = ts[i];
        function_pts(x, func, pts, t0, t1, dt * Math.sqrt(2));
        t0 = t1;
    }

    return pts
}

function function_pts(x, y, pts, t0, t1, ds) {
    if (Math.abs(t0 - t1) < 1e-5) return;
    var x1 = x(t1), y1 = y(t1);
    var x0 = pts[pts.length - 1][0], y0 = pts[pts.length - 1][1];
    if ((x1 - x0)*(x1 - x0) + (y1 - y0)*(y1 - y0) > ds*ds) {
        function_pts(x, y, pts, t0, (t0 + t1)/2, ds);
        function_pts(x, y, pts, (t0 + t1)/2, t1, ds);
    } else {
        pts.push([x1, y1]);
    }
}

export default generatePlotData