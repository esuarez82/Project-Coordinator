// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import RoomDetails from "./pages/RoomDetails";
import ServiceCalls from "./pages/ServiceCalls";
import ServiceCallDetails from "./pages/ServiceCallDetails";
import Inventory from "./pages/Inventory";
import ProjectInventory from "./pages/ProjectInventory";
import InternalInventory from "./pages/InternalInventory";
import Reports from "./pages/Reports";
import Archive from "./pages/Archive";

function App() {
  const [clients, setClients] = useState(() => {
    const stored = localStorage.getItem("clients");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const saveClient = (updatedClient) => {
    const newClients = clients.map((c) =>
      c.id === updatedClient.id ? updatedClient : c
    );
    setClients(newClients);
    localStorage.setItem("clients", JSON.stringify(newClients));
  };

  return (
    <Router>
      <Routes>
        {/* General Navigation */}
        <Route path="/" element={<Dashboard clients={clients} />} />
        <Route path="/dashboard" element={<Dashboard clients={clients} />} />

        {/* Clients */}
        <Route
          path="/clients"
          element={<Clients clients={clients} setClients={setClients} saveClient={saveClient} />}
        />
        <Route
          path="/clients/:clientId"
          element={<ClientDetails clients={clients} setClients={setClients} saveClient={saveClient} />}
        />

        {/* Projects */}
        <Route
          path="/projects"
          element={<Projects clients={clients} setClients={setClients} saveClient={saveClient} />}
        />
        <Route
          path="/projects/:projectId"
          element={<ProjectDetails clients={clients} setClients={setClients} saveClient={saveClient} />}
        />
        <Route
          path="/projects/:projectId/rooms/:roomId"
          element={<RoomDetails clients={clients} setClients={setClients} saveClient={saveClient} />}
        />

        {/* Service Calls */}
        <Route
          path="/service-calls"
          element={<ServiceCalls clients={clients} setClients={setClients} saveClient={saveClient} />}
        />
        <Route
          path="/service-calls/:serviceCallId"
          element={<ServiceCallDetails clients={clients} setClients={setClients} saveClient={saveClient} />}
        />

        {/* Inventory */}
        <Route path="/inventory" element={<Inventory />} />
        <Route
          path="/inventory/internal"
          element={<InternalInventory clients={clients} setClients={setClients} saveClient={saveClient} />}
        />
        <Route
          path="/inventory/project"
          element={<ProjectInventory clients={clients} setClients={setClients} saveClient={saveClient} />}
        />

        {/* Reports / Archive */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </Router>
  );
}

export default App;
