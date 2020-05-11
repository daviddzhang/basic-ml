import { line, easeExp, interpolate, curveLinear } from "d3";
import generatePlotData from "./function_data_gen";

export const X_BUFFER = 1;
export const Y_BUFFER = 1;

function getDomains(data) {
  const domains = { x: Array(2), y: Array(2) };
  const handlePoint = (curVal) => {
    domains.x[0] = Math.min(domains.x[0], curVal[0]);
    domains.x[1] = Math.max(domains.x[1], curVal[0]);
    domains.y[0] = Math.min(domains.y[0], curVal[1]);
    domains.y[1] = Math.max(domains.y[1], curVal[1]);
  };

  if (data.scatter) {
    if (data.scatter.length === 0) {
      throw new Error("Cannot have 0 scatter points");
    }
    const points = data.scatter;
    domains.x = [points[0][0], points[0][0]];
    domains.y = [points[0][1], points[0][1]];
    points.forEach(handlePoint);
  } else if (data.lines) {
    if (data.lines.length === 0) {
      throw new Error("Cannot have 0 lines");
    }
    const lines = data.lines;
    domains.x = [lines[0].data[0][0], lines[0].data[0][0]];
    domains.y = [lines[0].data[0][1], lines[0].data[0][1]];
    lines.forEach((line) => {
      line.data.forEach(handlePoint);
    });
  } else {
    domains.x = [-3, 3];
    domains.y = [-5, 5];
  }

  domains.x = [domains.x[0] - X_BUFFER, domains.x[1] + X_BUFFER];
  domains.y = [domains.y[0] - Y_BUFFER, domains.y[1] + Y_BUFFER];

  return domains;
}

/**
 * Zips array of x and y into array of pairs
 * @param {*} x array of x values
 * @param {*} y array of y values
 */
function zipXY(x, y) {
  return x.map((val, idx) => {
    return [val, y[idx]];
  });
}

function renderFunction(data, xDomain, yDomain, svgContent, funcLineGenerator) {
  if (data.functions) {
    const functions = data.functions;
    functions.forEach((func) => {
      const lineData = generatePlotData(func, xDomain, yDomain);
      svgContent
        .selectAll(".funcLine")
        .data([lineData])
        .join("path")
        .attr("class", "funcLine")
        .attr("stroke", "#00316F")
        .attr("fill", "none")
        .attr("stroke-width", "3")
        .attr("d", funcLineGenerator);
    });
  } else {
    svgContent.selectAll(".funcLine").remove();
  }
}

function renderScatter(data, xScale, yScale, svgContent) {
  if (data.scatter) {
    const scatter = data.scatter;
    svgContent
      .selectAll(".scatter-point")
      .data(scatter)
      .join("circle")
      .attr("class", "scatter-point")
      .attr("fill", "#7BC9FF")
      .attr("r", "3.5")
      .attr("stroke", "black")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]));
  } else {
    svgContent.selectAll("scatter-point").remove();
  }
}

/**
 * Renders points that lie on a function. There is a strict dependency of this function with the existence of a line/function
 * plot. It includes an transition animation if the point is already on the screen and if it's not a zoom event triggering the
 * hook.
 */
function renderPoint(
  data,
  xScale,
  yScale,
  svgContent,
  currentZoomState,
  prevZoomState
) {
  // tweening function that uses the first (and ideally ONLY) function in the data object
  const fnTween = (circle) => {
    return function (d, i, a) {
      const curX = circle.attr("cx");
      const func = data.functions[0];
      const r = interpolate(xScale.invert(curX), d[0]);
      return function (t) {
        const y = func(r(t));
        circle.attr("cx", xScale(r(t))).attr("cy", yScale(y));
      };
    };
  };

  if (data.points) {
    const points = data.points;
    points.forEach((pair) => {
      const circle = svgContent
        .selectAll(".point")
        .data([pair])
        .join("circle")
        .attr("class", "point")
        .attr("fill", "#CB0404")
        .attr("r", 5)
        .on("mouseenter", (d) => {
          circle.transition().attr("r", 7);

          svgContent
            .selectAll(".tooltip-background")
            .data(d)
            .join("rect")
            .attr("class", "tooltip-background")
            .attr("x", xScale(d[0]) + 5)
            .attr("y", yScale(d[1]) - 45)
            .attr("width", 100)
            .attr("height", 30)
            .attr("fill", "white")
            .attr("stroke", "black")
            .transition()
            .attr("opacity", 0.9);

          svgContent
            .selectAll(".tooltip")
            .data(d)
            .join((enter) =>
              enter
                .append("text")
                .attr("class", "tooltip")
                .text(`${d[0].toFixed(3)}, ${d[1].toFixed(3)}`)
                .attr("x", xScale(d[0]) + 55)
                .attr("y", yScale(d[1]) - 25)
            )
            .attr("text-anchor", "middle")
            .transition()
            .duration(100)
            .attr("opacity", 1);
        })
        .on("mouseleave", () => {
          svgContent.selectAll(".tooltip").remove();
          svgContent.selectAll(".tooltip-background").remove();
          circle.transition().attr("r", 5);
        });

      if (circle.attr("cx") && currentZoomState === prevZoomState) {
        circle.transition().ease(easeExp).tween("pathTween", fnTween(circle));
      } else {
        circle.attr("cx", (d) => xScale(d[0])).attr("cy", (d) => yScale(d[1]));
      }

      circle.append("svg:title").text(function (d) {
        return `${d[0]}, ${d[1]}`;
      });
    });
  } else {
    svgContent.selectAll(".point").remove();
  }
}

function renderLines(data, xScale, yScale, svgContent, colors) {
  const funcLineGenerator = line()
    .curve(curveLinear)
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));

  if (data.lines) {
    const lines = data.lines;
    lines.forEach((line, idx) => {
      svgContent
        .append("path")
        .data([line.data])
        .attr("class", "fixedLine")
        .attr("stroke", colors[idx])
        .attr("fill", "none")
        .attr("stroke-width", "1")
        .attr("d", funcLineGenerator);
    });
  } else {
    svgContent.selectAll(".fixedLine").remove();
  }
}

function renderLegend(data, svgContent, width, colors) {
  const legendXPosition = width - 100;
  const legendYPosition = 20;
  const yOffset = 15;

  if (data.lines) {
    const lines = data.lines;
    lines.forEach((line, idx) => {
      svgContent
        .append("circle")
        .attr("fill", colors[idx])
        .attr("r", 5)
        .attr("cx", legendXPosition)
        .attr("cy", legendYPosition + yOffset * idx)
        .attr("class", "legend-circle");

      svgContent
        .append("text")
        .attr("stroke", colors[idx])
        .attr(
          "transform",
          "translate(" +
            (legendXPosition + 6) +
            " ," +
            (legendYPosition + (yOffset * idx) + 4) +
            ")"
        )
        .attr("class", "legend-text")
        .text(line.name)
    });
  }
  else {
      svgContent.selectAll(".legend-circle").remove()
      svgContent.selectAll(".legend-text").remove()
  }
}

export {
  renderFunction,
  renderPoint,
  renderScatter,
  renderLines,
  renderLegend,
  getDomains,
  zipXY,
};
