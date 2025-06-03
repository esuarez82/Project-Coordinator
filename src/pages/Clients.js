import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Clients({ clients, setClients }) {
  const navigate = useNavigate();
  const [selectedClients, setSelectedClients] = useState([]);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updated = [...clients];
        updated[index].logo = reader.result;
        setClients(updated);
        localStorage.setItem("clients", JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  const addClient = () => {
    const name = prompt("Enter client name:");
    if (!name) return;
    const newClient = {
      id: Date.now().toString(),
      name,
      logo: "",
      address: [],
      contacts: [],
      projects: [],
      serviceCalls: [],
    };
    const updated = [...clients, newClient];
    setClients(updated);
    localStorage.setItem("clients", JSON.stringify(updated));
  };

  const editClient = (id) => {
    const newName = prompt("Enter new client name:");
    if (!newName) return;
    const updated = clients.map((c) =>
      c.id === id ? { ...c, name: newName } : c
    );
    setClients(updated);
    localStorage.setItem("clients", JSON.stringify(updated));
  };

  const toggleClientSelection = (id) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deleteClients = () => {
    const updated = clients.filter((c) => !selectedClients.includes(c.id));
    setClients(updated);
    localStorage.setItem("clients", JSON.stringify(updated));
    setSelectedClients([]);
  };

  const archiveClients = () => {
    const updated = clients.map((c) =>
      selectedClients.includes(c.id) ? { ...c, archived: true } : c
    );
    setClients(updated);
    localStorage.setItem("clients", JSON.stringify(updated));
    setSelectedClients([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img
          src="/logos/cjd-logo.png"
          alt="CJD Logo"
          style={{ maxHeight: 100 }}
          onError={(e) => (e.target.style.display = "none")}
        />
        <h1 style={{ margin: 0 }}>Field Coordinator</h1>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>{" "}
          <button onClick={addClient}>➕ Add Client</button>{" "}
          <button onClick={deleteClients} disabled={!selectedClients.length}>🗑 Delete</button>{" "}
          <button onClick={archiveClients} disabled={!selectedClients.length}>📁 Archive</button>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
        {clients.filter(c => !c.archived).map((client, index) => (
          <div
            key={client.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              width: 180,
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              position: "relative",
            }}
          >
            <div onClick={() => navigate(`/client/${client.id}`)} style={{ cursor: "pointer" }}>
              {client.logo ? (
                <img
                  src={client.logo}
                  alt="Client Logo"
                  style={{ maxHeight: 80, maxWidth: "100%", marginBottom: 10 }}
                />
              ) : (
                <div style={{
                  height: 80,
                  background: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10
                }}>
                  No Logo
                </div>
              )}
              <h3 style={{ margin: "10px 0" }}>{client.name}</h3>
            </div>

            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={selectedClients.includes(client.id)}
                onChange={() => toggleClientSelection(client.id)}
              />
              <label htmlFor={`file-${index}`} style={{ cursor: "pointer", fontSize: "0.85em" }}>
                Upload Logo
              </label>
              <input
                type="file"
                id={`file-${index}`}
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, index)}
              />
              <button
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1em",
                  marginLeft: 5,
                }}
                onClick={() => editClient(client.id)}
              >
                ✏️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clients;
