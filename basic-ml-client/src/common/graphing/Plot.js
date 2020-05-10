import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  axisBottom,
  axisLeft,
  zoom,
  zoomTransform
} from "d3";
import useResizeObserver from "./resize_observer";
import { renderFunction, renderPoint, renderScatter } from "./plot_utils"
import "./Plot.css";

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
    
    const funcLineGenerator = line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));


    renderFunction(data, xScale.domain(), yScale.domain(), svgContent, funcLineGenerator);

    renderScatter(data, xScale, yScale, svgContent);
    
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
