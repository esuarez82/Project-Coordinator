// src/pages/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

function Dashboard({ clients = [] }) {
  const tasks = [];

  clients.forEach(client => {
    (client.projects || []).forEach(project => {
      try {
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);

        if (!isNaN(start) && !isNaN(end)) {
          tasks.push({
            id: project.id,
            name: project.name,
            start,
            end,
            type: "task",
            progress: project.progress || 0,
            isDisabled: false,
          });
        }
      } catch (e) {
        console.warn(`Skipping project ${project.name}: Invalid date format.`);
      }
    });
  });

  return (
    <div style={{ padding: "20px" }}>
      <LogoHeader />
      <h2 style={{ textAlign: "center" }}>Dashboard Overview</h2>

      <div style={{ marginTop: "40px" }}>
        <h3>Active Projects Gantt Chart</h3>
        {tasks.length > 0 ? (
          <div style={{ height: "500px" }}>
            <Gantt
              tasks={tasks}
              viewMode="Week"
              listCellWidth="155px"
              columnWidth={65}
            />
          </div>
        ) : (
          <p>No projects found with valid start and end dates.</p>
        )}
      </div>
    </div>
  );
}

function LogoHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <img src="/logos/cjd-logo.png" alt="CJD Logo" style={{ maxHeight: 100 }} />
      <h1 style={{ margin: 0 }}>Field Coordinator</h1>
      <div style={{ marginTop: 10 }}>
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/clients">Clients</Link> |{" "}
        <Link to="/projects">Projects</Link> |{" "}
        <Link to="/service-calls">Service Calls</Link> |{" "}
        <Link to="/inventory">Inventory</Link> |{" "}
        <Link to="/reports">Reports</Link> |{" "}
        <Link to="/archive">Archive</Link>
      </div>
    </div>
  );
}

export default Dashboard;
