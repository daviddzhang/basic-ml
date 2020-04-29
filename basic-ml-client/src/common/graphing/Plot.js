import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  axisBottom,
  axisLeft,
  zoom,
  zoomTransform,
  easeExp,
  interpolate,
} from "d3";
import useResizeObserver from "./resize_observer";
import generatePlotData from "./function_data_gen";
import "./Plot.css";

function renderFunction(data, xScale, svgContent, funcLineGenerator) {
  if (data.functions) {
    const functions = data.functions;
    functions.forEach((func) => {
      const lineData = generatePlotData(func, xScale);
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

function Plot({ data, id = "plot" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  // store the previous zoom state so we can check if we need animations
  const prevZoomStateRef = useRef();
  useEffect(() => {
    prevZoomStateRef.current = currentZoomState;
  });
  const prevZoomState = prevZoomStateRef.current;

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    const xScale = scaleLinear().domain([-3, 3]).range([0, width]);

    const yScale = scaleLinear().domain([-10, 10]).range([height, 0]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());
      const newYScale = currentZoomState.rescaleY(yScale);
      yScale.domain(newYScale.domain());
    }

    const funcLineGenerator = line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    // axes
    const xAxis = axisBottom(xScale)
      .ticks(((width + 2) / (height + 2)) * 10)
      .tickSize(-height);

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .call((g) =>
        g.selectAll(".tick").attr("stroke-opacity", (d) => (d ? 0.25 : 1))
      );

    const yAxis = axisLeft(yScale).ticks(10).tickSize(-width);

    svg
      .select(".y-axis")
      .call(yAxis)
      .call((g) =>
        g.selectAll(".tick").attr("stroke-opacity", (d) => (d ? 0.25 : 1))
      );

    renderFunction(data, xScale.domain(), svgContent, funcLineGenerator);

    renderPoint(
      data,
      xScale,
      yScale,
      svgContent,
      currentZoomState,
      prevZoomState
    );

    // zoom
    const zoomBehavior = zoom()
      .scaleExtent([0.1, 30])
      .on("zoom", () => {
        const zoomState = zoomTransform(svg.node());
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehavior);
  }, [currentZoomState, data, dimensions]);

  return (
    <React.Fragment>
      <div
        className="svg-wrapper"
        ref={wrapperRef}
        style={{ marginBottom: "2rem" }}
      >
        <svg ref={svgRef}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="content" clipPath={`url(#${id})`}></g>
        </svg>
      </div>
    </React.Fragment>
  );
}

export default Plot;
