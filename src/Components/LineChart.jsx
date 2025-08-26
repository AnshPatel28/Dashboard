import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const REGION_COLORS = {
  "North America": "#63e5f1ff",
  Europe: "#5257ffff",
  Asia: "#e24d72ff",
};

function getAreaProps(region, selectedRegion) {
  if (selectedRegion === "All") {
    return {
      stroke: REGION_COLORS[region],
      fill: REGION_COLORS[region],
      fillOpacity: 0.08,
      strokeWidth: 3,
      opacity: 1,
    };
  }
  if (region === selectedRegion) {
    return {
      stroke: REGION_COLORS[region],
      fill: REGION_COLORS[region],
      fillOpacity: 0.13,
      strokeWidth: 5,
      opacity: 1,
    };
  }
  return {
    stroke: REGION_COLORS[region],
    fill: REGION_COLORS[region],
    fillOpacity: 0.04,
    strokeWidth: 2,
    opacity: 0.3,
  };
}

export default function LineChartComponent({ data, selectedRegion }) {
  // Prepare Line chart data: one entry per year, with customers for each region
  const lineChartData = [];
  const allYears = [...new Set(data.map((d) => d.year))].sort();
  ["North America", "Europe", "Asia"].forEach((region) => {
    allYears.forEach((year) => {
      if (!lineChartData.find((e) => e.year === year)) {
        lineChartData.push({ year });
      }
    });
  });
  ["North America", "Europe", "Asia"].forEach((region) => {
    allYears.forEach((year) => {
      const entry = data.find(
        (d) => d.region === region && d.year === year
      );
      const idx = lineChartData.findIndex((e) => e.year === year);
      lineChartData[idx][region] = entry ? entry.customers : 0;
    });
  });

  // Ensure at least two points for recharts AreaChart
  let chartData = [...lineChartData];
  if (chartData.length === 1) {
    // Add a dummy point before or after the single year
    const year = chartData[0].year;
    const prevYear = (parseInt(year) - 1).toString();
    const dummy = { year: prevYear };
    ["North America", "Europe", "Asia"].forEach((region) => {
      dummy[region] = 0;
    });
    chartData = [dummy, chartData[0]];
  }

  // Custom legend renderer using className instead of style
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex gap-6 mb-3 justify-center">
        {payload.map((entry) => (
          <span
            key={entry.value}
            className="flex items-center font-medium text-gray-700 text-sm"
          >
            <span
              className="inline-block w-3 h-3 rounded-full mr-2 border-2 border-white shadow"
              style={{
                background: entry.color,
                boxShadow: "0 0 0 1px #d1d5db",
              }}
            />
            {entry.value}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col justify-center align-center">
      <h2 className="font-semibold text-lg mb-3 text-gray-700">
        Line Chart (Customers by Year)
      </h2>
      <ResponsiveContainer width="100%" height={350} >
        <AreaChart data={chartData} className="-ml-4">
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend content={renderLegend} />
          <Area
            type="monotone"
            dataKey="North America"
            name="North America"
            {...getAreaProps("North America", selectedRegion)}
            dot={false}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease"
          />
          <Area
            type="monotone"
            dataKey="Europe"
            name="Europe"
            {...getAreaProps("Europe", selectedRegion)}
            dot={false}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease"
          />
          <Area
            type="monotone"
            dataKey="Asia"
            name="Asia"
            {...getAreaProps("Asia", selectedRegion)}
            dot={false}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}