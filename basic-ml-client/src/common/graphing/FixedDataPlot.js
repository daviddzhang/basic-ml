import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  axisBottom,
  axisLeft,
} from "d3";
import useResizeObserver from "./resize_observer";
import { renderScatter, getDomains, renderLines, renderLegend } from "./plot_utils"
import "./Plot.css";

function FixedDataPlot({ data, id, xLabel, yLabel }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const colors = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const domains = getDomains(data);

    // scales + line generator
    const xScale = scaleLinear().domain(domains.x).range([0, width]);

    const yScale = scaleLinear().domain(domains.y).range([height, 0]);

    // axes
    const xAxis = axisBottom(xScale)

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);

    svg
      .select(".y-axis")
      .call(yAxis);


    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + 40) + ")")
      .style("text-anchor", "middle")
      .attr("class", "axis-label")
      .text(xLabel);

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 60)
      .attr("x",0 - (height / 2))
      .style("text-anchor", "middle")
      .attr("class", "axis-label")
      .text(yLabel);  

    renderScatter(data, xScale, yScale, svgContent);

    renderLines(data, xScale, yScale, svgContent, colors);

    renderLegend(data, svgContent, width, colors)

  }, [data, dimensions]);

  return (
    <React.Fragment>
      <div
      className={id}
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

export default FixedDataPlot;
