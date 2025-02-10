import * as d3 from "d3";
import { useState } from "react";

export function Chart({ data }) {
  const marginLeft = 100;
  const width = 800;
  const height = 600;
  const marginRight = 40;
  const marginTop = 20;
  const marginBottom = 20;

  const heightBound = height - marginTop - marginBottom;
  const widthBound = width - marginLeft - marginRight;

  const pop_data = data
    .map((d) => {
      return {
        species: d["Common_name"],
        year: d["Year"],
        population: d["Population"],
      };
    })
    .sort((a, b) => b.area - a.area);

  const years = pop_data.map((d) => d.year);
  const pops = pop_data.map((d) => d.population);
  const bySpecies = d3.group(pop_data, (d) => d.species);
  const species = Array.from(bySpecies, ([name, datapoints]) => ({
    name,
    datapoints,
  }));

  // const hake = bySpecies.get("South Pacific hake / Peruvian hake");

  const filtered = species.filter(
    (d) => d.name !== "South Pacific hake / Peruvian hake"
  );
  console.log(filtered);
  const show = true;

  // const [hovered, setHovered] = useState(null);

  const xAxis = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([marginLeft, width - marginRight]);

  const yAxis = d3
    .scaleLinear()
    .domain([d3.max(pops), d3.min(pops)])
    .range([marginTop, heightBound]);

  const lineBuilder = d3
    .line()
    .x((d) => xAxis(d.year))
    .y((d) => yAxis(d.population));

  // const linePath = lineBuilder(pop_data);

  return (
    <div>
      <h2>Species that have increased their population since 2010</h2>
      <svg width={width} height={height}>
        {/* Render/ Draw the visualization */}
        <g transform={`translate(0,0)`}>
          {species.map((d) => {
            if (show) {
              return (
                <path
                  width={widthBound}
                  height={heightBound}
                  key={d.name}
                  d={lineBuilder(d.datapoints)}
                  stroke="#000000"
                  fill="none"
                  strokeWidth={2}
                />
              );
            } else {
              if (d.name !== "South Pacific hake / Peruvian hake")
                return (
                  <path
                    width={widthBound}
                    height={heightBound}
                    key={d.name}
                    d={lineBuilder(d.datapoints)}
                    stroke="#000000"
                    fill="none"
                    strokeWidth={2}
                  />
                );
            }
          })}
        </g>
        {/* X Axis (Bottom) */}
        <g transform={`translate(0, ${heightBound})`}>
          {xAxis.ticks().map((tick) => {
            return (
              <g key={tick}>
                <line
                  x1={xAxis(tick)}
                  x2={xAxis(tick)}
                  y1={-heightBound}
                  y2={10}
                  stroke="#49af8b"
                  opacity={0.3}
                  strokeDasharray="4 8"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="black"
                  x={xAxis(tick)}
                  y={30}
                  key={tick}
                >
                  {tick}
                </text>
              </g>
            );
          })}
        </g>
        {/* Y Axis (Left) */}
        <g transform={`translate(${marginLeft}, 0)`}>
          {yAxis.ticks().map((tick) => {
            return (
              <g key={tick}>
                <line
                  x1={-10}
                  x2={widthBound}
                  y1={yAxis(tick)}
                  y2={yAxis(tick)}
                  stroke="#49af8b"
                  opacity={0.3}
                  strokeDasharray="4 8"
                />
                <text
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="black"
                  x={-30}
                  y={yAxis(tick)}
                  key={tick}
                >
                  {tick}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
