import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProjectGanttChart({ projects }) {
  const today = new Date();

  const labels = projects.map(p => p.name);
  const durations = projects.map(p => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    const daysTotal = (end - start) / (1000 * 60 * 60 * 24);
    return daysTotal;
  });

  const daysElapsed = projects.map(p => {
    const start = new Date(p.startDate);
    const diff = (today - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.min(diff, (new Date(p.endDate) - start) / (1000 * 60 * 60 * 24)) : 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Completed",
        data: daysElapsed,
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderRadius: 4,
      },
      {
        label: "Remaining",
        data: durations.map((d, i) => d - daysElapsed[i]),
        backgroundColor: "rgba(192, 192, 192, 0.5)",
        borderRadius: 4,
      }
    ]
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Active Projects Timeline" }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ProjectGanttChart;
