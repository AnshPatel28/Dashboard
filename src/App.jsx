import React, { useState } from "react";
import masterData from "./Components/Data";
import BarChartComponent from "./Components/BarChart";
import LineChartComponent from "./Components/LineChart";
import PieChartComponent from "./Components/PieChart";

export default function Dashboard() {
  // Filters for each chart
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  // Highlighted state for charts
  const [highlightedRegion, setHighlightedRegion] = useState("All");
  const [highlightedYear, setHighlightedYear] = useState("All");

  // Data for each chart
  const [barData, setBarData] = useState(masterData);
  const [lineData, setLineData] = useState(masterData);
  const [donutData, setDonutData] = useState(masterData);

  const regions = ["All", ...new Set(masterData.map((d) => d.region))];
  const years = ["All", ...new Set(masterData.map((d) => d.year))];

  // Filtering logic for each chart
  const handleFilter = () => {
    // Set highlight to match selected filters
    setHighlightedRegion(selectedRegion);
    setHighlightedYear(selectedYear);

    const onlyRegion = selectedRegion !== "All" && selectedYear === "All";
    const onlyYear = selectedYear !== "All" && selectedRegion === "All";
    const multipleFilters =
      [selectedRegion, selectedYear].filter((v) => v !== "All").length > 1;

    // Bar Chart: Filter by Region
    if (onlyRegion) {
      setBarData(masterData.filter((d) => d.region === selectedRegion));
    } else if (multipleFilters) {
      setBarData(
        masterData.filter(
          (d) =>
            (selectedRegion === "All" || d.region === selectedRegion) &&
            (selectedYear === "All" || d.year === Number(selectedYear))
        )
      );
    } else {
      setBarData(masterData);
    }

    // Line Chart: Filter by Year
    if (onlyYear) {
      setLineData(masterData.filter((d) => d.year === Number(selectedYear)));
    } else if (multipleFilters) {
      setLineData(
        masterData.filter(
          (d) =>
            (selectedRegion === "All" || d.region === selectedRegion) &&
            (selectedYear === "All" || d.year === Number(selectedYear))
        )
      );
    } else {
      setLineData(masterData);
    }

    // Donut Chart: Filter by Region/Year
    if (onlyRegion) {
      setDonutData(masterData.filter((d) => d.region === selectedRegion));
    } else if (onlyYear) {
      setDonutData(masterData.filter((d) => d.year === Number(selectedYear)));
    } else if (multipleFilters) {
      setDonutData(
        masterData.filter(
          (d) =>
            (selectedRegion === "All" || d.region === selectedRegion) &&
            (selectedYear === "All" || d.year === Number(selectedYear))
        )
      );
    } else {
      setDonutData(masterData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center mb-2 gap-2">
        📊 Growth Dashboard
      </h1>
      <h3 className="text-2xl font-semibold text-gray-600 mb-8 flex items-center justify-center">Business performance data (2022–2024) showing regional revenue growth, customers, and product launches.</h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-center mb-10">
        {/* Region Filter */}
        <select
          className="p-2 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          className="p-2 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Button */}
        <button
          onClick={handleFilter}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition duration-200"
        >
          Show on Graph
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BarChartComponent
          data={barData}
          selectedRegion={highlightedRegion}
          selectedYear={highlightedYear}
        />
        <LineChartComponent
          data={lineData}
          selectedRegion={highlightedRegion}
          selectedYear={highlightedYear}
        />
        <PieChartComponent
          data={donutData}
          selectedRegion={highlightedRegion}
          selectedYear={highlightedYear}
        />
      </div>
    </div>
  );
}