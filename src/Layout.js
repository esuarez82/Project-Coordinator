import React from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children, toggleTheme, darkMode }) => {
  return (
    <div className={`layout-container ${darkMode ? "dark" : "light"}`}>
      <header className="layout-header">
        <div className="branding">
          <img src="/logo192.png" alt="CJD Logo" className="logo" />
          <h1>CJD Field Coordinator</h1>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>
      <nav className="layout-nav">
        <Link to="/">Dashboard</Link>
        <Link to="/clients">Clients</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/service-calls">Service Calls</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/archive">Archive</Link>
      </nav>
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;