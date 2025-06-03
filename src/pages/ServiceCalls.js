// src/pages/ServiceCalls.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function ServiceCalls({ clients, setClients }) {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedCallIds, setSelectedCallIds] = useState([]);
  const navigate = useNavigate();

  const client = clients.find(c => c.id === selectedClientId);

  const handleToggleSelect = (id) => {
    setSelectedCallIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const deleteCalls = () => {
    const updated = {
      ...client,
      serviceCalls: client.serviceCalls.filter(call => !selectedCallIds.includes(call.id))
    };
    updateClient(updated);
  };

  const archiveCalls = () => {
    const updated = {
      ...client,
      serviceCalls: client.serviceCalls.map(call =>
        selectedCallIds.includes(call.id)
          ? { ...call, status: "Archived" }
          : call
      )
    };
    updateClient(updated);
  };

  const updateClient = (updated) => {
    const newClients = clients.map(c => c.id === updated.id ? updated : c);
    setClients(newClients);
    localStorage.setItem("clients", JSON.stringify(newClients));
    setSelectedCallIds([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <LogoHeader />
      {!selectedClientId ? (
        <>
          <h2>Select a Client</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {clients.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedClientId(c.id)}
                style={{
                  width: 180,
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  padding: 10,
                  textAlign: "center",
                  backgroundColor: "#f7f7f7",
                  borderRadius: 6
                }}
              >
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt={c.name}
                    style={{
                      maxHeight: 80,
                      maxWidth: 160,
                      objectFit: "contain",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                ) : (
                  <div style={{ height: 80, background: "#eee", lineHeight: "80px" }}>
                    No Logo
                  </div>
                )}
                <h4>{c.name}</h4>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedClientId(null)}>← Back to Clients</button>
          <h2 style={{ textAlign: "center" }}>Service Calls</h2>

          <div style={{ marginBottom: 10 }}>
            <button disabled={!selectedCallIds.length} onClick={archiveCalls}>📁 Archive</button>{" "}
            <button disabled={!selectedCallIds.length} onClick={deleteCalls}>🗑 Delete</button>{" "}
            <button
              disabled={selectedCallIds.length !== 1}
              onClick={() => navigate(`/service-calls/${selectedCallIds[0]}`)}
            >
              ✏️ Edit
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {(client.serviceCalls || []).filter(call => call.status !== "Archived").map(call => (
              <div
                key={call.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: 12,
                  width: 200,
                  backgroundColor: "#f9f9f9",
                  position: "relative"
                }}
              >
                <input
                  type="checkbox"
                  style={{ position: "absolute", top: 10, left: 10 }}
                  checked={selectedCallIds.includes(call.id)}
                  onChange={() => handleToggleSelect(call.id)}
                />
                <div
                  onClick={() => navigate(`/service-calls/${call.id}`)}
                  style={{ cursor: "pointer", paddingLeft: 20 }}
                >
                  <strong>{call.name}</strong>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Status:</strong> {call.status}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Priority:</strong> {call.priority}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Assigned:</strong> {(call.assignedTeam || []).length} person(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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

export default ServiceCalls;
