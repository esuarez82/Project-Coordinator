// src/pages/Projects.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";

function Projects({ clients = [], setClients }) {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const navigate = useNavigate();

  const client = clients.find(c => c.id === selectedClientId);

  const handleProjectSelect = (id) => {
    setSelectedProjects(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const updateClient = (updated) => {
    const newList = clients.map(c => c.id === updated.id ? updated : c);
    setClients(newList);
    localStorage.setItem("clients", JSON.stringify(newList));
  };

  const deleteProjects = () => {
    if (!client) return;
    const updated = {
      ...client,
      projects: (client.projects || []).filter(p => !selectedProjects.includes(p.id))
    };
    updateClient(updated);
    setSelectedProjects([]);
  };

  const archiveProjects = () => {
    if (!client) return;
    const updated = {
      ...client,
      projects: (client.projects || []).map(p =>
        selectedProjects.includes(p.id) ? { ...p, status: "Archived" } : p
      )
    };
    updateClient(updated);
    setSelectedProjects([]);
  };

  const addProject = () => {
    const name = prompt("Enter project name:");
    const code = prompt("Enter project code:");
    if (!name || !code) return;
    const newProject = {
      id: Date.now().toString(),
      name,
      code,
      status: "Active",
      rooms: []
    };
    const updated = {
      ...client,
      projects: [...(client.projects || []), newProject]
    };
    updateClient(updated);
  };

  return (
    <div style={{ padding: 20 }}>
      <LogoHeader />
      {!selectedClientId ? (
        <>
          <h2>Select a Client</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {clients.filter(c => !c.archived).map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedClientId(c.id)}
                style={{
                  cursor: "pointer",
                  padding: 10,
                  border: "1px solid #ccc",
                  width: 180,
                  textAlign: "center",
                  backgroundColor: "#f7f7f7"
                }}
              >
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt={c.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 80,
                      objectFit: "contain",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 80,
                      background: "#eee",
                      lineHeight: "80px"
                    }}
                  >
                    No Logo
                  </div>
                )}
                <h3 style={{ fontSize: 16, marginTop: 10 }}>{c.name}</h3>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedClientId(null)}>← Back to Clients</button>
          <h2>{client.name} – Projects</h2>
          <div style={{ marginBottom: 10 }}>
            <button onClick={addProject}>➕ Add Project</button>
            <button onClick={archiveProjects} disabled={!selectedProjects.length}>📁 Archive</button>
            <button onClick={deleteProjects} disabled={!selectedProjects.length}>🗑 Delete</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {(client.projects || [])
              .filter(p => p.status !== "Archived")
              .map(p => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #ccc",
                    width: 200,
                    padding: 10,
                    textAlign: "center",
                    position: "relative",
                    backgroundColor: "#f9f9f9"
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ position: "absolute", top: 10, left: 10 }}
                    checked={selectedProjects.includes(p.id)}
                    onChange={() => handleProjectSelect(p.id)}
                  />
                  <div onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor: "pointer" }}>
                    <h4 style={{ margin: 0 }}>{p.name}</h4>
                    <p style={{ margin: 0, fontSize: 14, color: "#555" }}>Code: {p.code}</p>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Projects;
