import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Only use colors for Asia, Europe, North America, Other, +1 more
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#a78bfa", "#f472b6"];

const REGION_LABELS = [
  { name: "North America", color: COLORS[0] },
  { name: "Europe", color: COLORS[1] },
  { name: "Asia", color: COLORS[2] },
  // Add more if needed
];

function getPieSliceProps(region, selectedRegion) {
  if (selectedRegion === "All") return {};
  if (region === selectedRegion) {
    return {
      stroke: "#222",
      strokeWidth: 3,
      opacity: 1,
    };
  }
  return {
    opacity: 0.3,
  };
}

export default function PieChartComponent({ data, selectedRegion }) {
  // Prepare Donut chart data: launches by region
  const donutChartData = Object.values(
    data.reduce((acc, d) => {
      if (!acc[d.region]) {
        acc[d.region] = { name: d.region, value: 0 };
      }
      acc[d.region].value += d.launches;
      return acc;
    }, {})
  );

  // Calculate total
  const total = donutChartData.reduce((sum, d) => sum + d.value, 0);

  // Only show Asia, Europe, North America in legend
  const legendData = donutChartData.filter((d) =>
    ["Asia", "Europe", "North America"].includes(d.name)
  );

  // Calculate total for only North America, Europe, Asia
  const mainTotal = legendData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-row items-center">
      <div className="flex-1">
        <h2 className="font-semibold text-lg mb-3 text-gray-700">
          Launches by Region
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={donutChartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              stroke="none"
              label={false}
              isAnimationActive={true}
              paddingAngle={4} // Add gap between pie slices
            >
              {donutChartData.map((entry, index) => (
                <Cell
                  key={`cell-pie-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  {...getPieSliceProps(entry.name, selectedRegion)}
                />
              ))}
            </Pie>
            {/* Center label: only sum of North America, Europe, Asia */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold text-4xl fill-gray-700"
            >
              {mainTotal >= 1000 ? `${(mainTotal / 1000).toFixed(0)}K` : mainTotal}
            </text>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col ml-6 min-w-[120px]">
        {legendData.map((entry, idx) => (
          <div key={entry.name} className="flex items-center mb-2">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ background: COLORS[idx % COLORS.length] }}
            />
            <span className="text-gray-700 text-md">{entry.name}</span>
            <span className="ml-2 font-extrabold text-gray-800 text-base">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}