// src/pages/Inventory.js
import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Inventory() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <LogoHeader />
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Inventory Section</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
        <button onClick={() => navigate("/inventory/internal")} style={buttonStyle}>
          🛠 Internal Inventory
        </button>
        <button onClick={() => navigate("/inventory/project")} style={buttonStyle}>
          📦 Project Inventory
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "15px 30px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  cursor: "pointer",
  backgroundColor: "#f5f5f5",
};

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

export default Inventory;
