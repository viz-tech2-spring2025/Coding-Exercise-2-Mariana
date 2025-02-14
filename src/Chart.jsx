import * as d3 from "d3";
import { useState } from "react";

export function Chart({ data }) {
  const marginLeft = 230;
  const width = 1200;
  const height = 600;
  const marginRight = 230;
  const marginTop = 20;
  const marginBottom = 20;

  const heightBound = height - marginTop - marginBottom;
  const widthBound = width - marginLeft - marginRight;

  const pop_data = data.map((d) => {
    return {
      species: d["Common_name"],
      year: d["Year"],
      population: d["Population"],
    };
  });

  const years = pop_data.map((d) => d.year);
  const pops = pop_data.map((d) => d.population);
  const bySpecies = d3.group(pop_data, (d) => d.species);
  const species = Array.from(bySpecies, ([name, datapoints]) => ({
    name,
    datapoints,
  }));

  // const hake = bySpecies.get("South Pacific hake / Peruvian hake");
  // const filtered = species.filter(
  //   (d) => d.name !== "South Pacific hake / Peruvian hake"
  // );
  const show = true;

  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    text: null,
  });

  const colors = d3.scaleOrdinal(d3.schemeCategory10);

  const xAxis = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([marginLeft, width - marginRight]);

  const yAxis = d3
    .scaleLog()
    .domain([1, d3.max(pops)])
    .range([heightBound, marginTop]);

  const lineBuilder = d3
    .line()
    .x((d) => xAxis(d.year))
    .y((d) => (yAxis(d.population) > 0 ? yAxis(d.population) : yAxis(1)))
    .curve(d3.curveBasis);

  const handleMouseOver = (event, d) => {
    const [mouseX, mouseY] = d3.pointer(event);
    const year = Math.round(xAxis.invert(mouseX));
    const dataPoint = d.find((p) => p.year === year);
    if (dataPoint) {
      console.log(dataPoint);
      setTooltip({
        show: true,
        x: mouseX,
        y: mouseY,
        text: {
          species: dataPoint.species,
          population: Math.round(dataPoint.population),
          year: dataPoint.year,
        },
      });
    }
  };
  const handleMouseMove = (event) => {
    const [mouseX, mouseY] = d3.pointer(event);
    setTooltip((prevTooltip) => ({
      ...prevTooltip,
      x: mouseX,
      y: mouseY,
    }));
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, text: "" });
  };

  return (
    <div>
      <h2>Species that have increased their population since 2010</h2>
      <svg width={width} height={height}>
        {/* Render/ Draw the visualization */}
        <g transform={`translate(0,0)`}>
          {species.map((d, i) => {
            if (show) {
              return (
                <path
                  width={widthBound}
                  height={heightBound}
                  key={d.name}
                  d={lineBuilder(d.datapoints)}
                  stroke={colors(i)}
                  fill="none"
                  strokeWidth={4}
                  strokeOpacity={hovered && d.name !== hovered ? 0.1 : 1}
                  onMouseOver={(e) => {
                    setHovered(d.name);
                    handleMouseOver(e, d.datapoints);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    handleMouseLeave();
                  }}
                  onMouseMove={(e) => handleMouseMove(e)}
                  style={{ cursor: "pointer" }}
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
                  {yAxis.tickFormat(5, "s")(tick)}
                </text>
              </g>
            );
          })}
        </g>
        {/* Tooltip */}
        {tooltip.show && (
          <g transform={`translate(${tooltip.x},${tooltip.y})`}>
            <rect
              x="10"
              y="-32"
              width="200"
              height="100"
              fill="white"
              stroke="black"
              rx="5"
              ry="5"
              pointerEvents="none"
            />
            <text x="15" y="-20" fontSize="11px" pointerEvents="none">
              <tspan x="15" dy="0" stroke="black">
                Species:
              </tspan>{" "}
              <tspan x="15" dy="1.3em">
                {tooltip.text.species}
              </tspan>{" "}
              <tspan x="15" dy="1.4em" stroke="black">
                Population:
              </tspan>{" "}
              <tspan x="15" dy="1.3em">
                {tooltip.text.population}
              </tspan>{" "}
              <tspan x="15" dy="1.4em" stroke="black">
                Year:
              </tspan>{" "}
              <tspan x="15" dy="1.3em">
                {tooltip.text.year}
              </tspan>{" "}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
