// src/components/OverviewBarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverviewBarChart = ({ activeProjects, serviceCalls, completedProjects }) => {
  const data = {
    labels: ["Active Projects", "Service Calls", "Completed Projects"],
    datasets: [
      {
        label: "Total Count",
        data: [activeProjects, serviceCalls, completedProjects],
        backgroundColor: ["#60a5fa", "#fbbf24", "#34d399"],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Current Project & Service Overview",
      },
    },
    scales: {
      x: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default OverviewBarChart;
