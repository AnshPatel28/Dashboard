import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const REGION_COLORS = {
  "North America": "#7684dfff",
  Europe: "#4b4fc8ff",
  Asia: "#2819d1ff",
};

const RoundedBar = (props) => {
  const { x, y, width, height, fill, opacity } = props;
  const radius = 10;
  return (
    <g>
      <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#888" floodOpacity="0.25" />
      </filter>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        fill={fill}
        opacity={opacity}
        filter="url(#barShadow)"
      />
    </g>
  );
};

function getBarCellOpacity(region, selectedRegion) {
  if (selectedRegion === "All") return 1;
  return region === selectedRegion ? 1 : 0.3;
}

export default function BarChartComponent({ data, selectedRegion }) {
  // Prepare Bar chart data: each entry is a unique (region, year) pair
  const barChartData = [];
  const yearsForBar = [2022, 2023, 2024];
  ["North America", "Europe", "Asia"].forEach((region) => {
    yearsForBar.forEach((year) => {
      const entry = data.find(
        (d) => d.region === region && d.year === year
      );
      barChartData.push({
        region,
        year,
        revenueGrowth: entry ? entry.revenueGrowth : 0,
        label: `${region} ${year}`,
      });
    });
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
      <h2 className="font-semibold text-lg mb-3 text-gray-700">
        Bar Chart (Revenue Growth by Region & Year)
      </h2>
      <ResponsiveContainer width="100%" height={350} className="-ml-4">
        <BarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenueGrowth" >
            {barChartData.map((entry, index) => (
              <Cell
                key={`cell-bar-${index}`}
                fill={REGION_COLORS[entry.region] || "#8884d8"}
                opacity={getBarCellOpacity(entry.region, selectedRegion)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
