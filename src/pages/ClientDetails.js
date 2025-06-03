// src/pages/ClientDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ClientDetails({ clients = [], saveClient }) {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "" });
  const [newProject, setNewProject] = useState({ name: "", code: "", status: "Active" });
  const [newServiceCall, setNewServiceCall] = useState({ name: "", status: "Open" });

  useEffect(() => {
    if (!clients || clients.length === 0) return;
    const found = clients.find(c => c.id === clientId);
    if (found) {
      setClient(found);
    } else {
      console.warn("Client not found for ID:", clientId);
    }
  }, [clientId, clients]);

  if (!client) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <LogoHeader />
        <h3>Loading Client Details...</h3>
        <p>If this page remains blank, the client ID may be invalid or the clients list hasn’t loaded yet.</p>
        <button onClick={() => navigate("/clients")}>← Go Back</button>
      </div>
    );
  }

  const updateClient = (updates) => {
    const updated = { ...client, ...updates };
    if (typeof saveClient === "function") {
      saveClient(updated);
    }
    setClient(updated);
  };

  const addAddress = () => {
    if (!newAddress.trim()) return;
    updateClient({ address: [...(client.address || []), newAddress.trim()] });
    setNewAddress("");
  };

  const deleteAddress = (index) => {
    const updated = [...(client.address || [])];
    updated.splice(index, 1);
    updateClient({ address: updated });
  };

  const addContact = () => {
    if (!newContact.name || !newContact.email || !newContact.phone) return;
    updateClient({ contacts: [...(client.contacts || []), newContact] });
    setNewContact({ name: "", email: "", phone: "" });
  };

  const deleteContact = (index) => {
    const updated = [...(client.contacts || [])];
    updated.splice(index, 1);
    updateClient({ contacts: updated });
  };

  const addProject = () => {
    if (!newProject.name || !newProject.code) return;
    updateClient({
      projects: [...(client.projects || []), { ...newProject, id: Date.now().toString() }]
    });
    setNewProject({ name: "", code: "", status: "Active" });
  };

  const deleteProject = (id) => {
    const updated = (client.projects || []).filter(p => p.id !== id);
    updateClient({ projects: updated });
  };

  const addServiceCall = () => {
    if (!newServiceCall.name) return;
    updateClient({
      serviceCalls: [...(client.serviceCalls || []), { ...newServiceCall, id: Date.now().toString() }]
    });
    setNewServiceCall({ name: "", status: "Open" });
  };

  const deleteServiceCall = (id) => {
    const updated = (client.serviceCalls || []).filter(c => c.id !== id);
    updateClient({ serviceCalls: updated });
  };

  return (
    <div style={{ padding: 20 }}>
      <LogoHeader />
      <button onClick={() => navigate("/clients")}>← Back to Clients</button>
      <h2>{client.name}</h2>
      {client.logo && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src={`/logos/${client.logo}`} alt="Client Logo" style={{ maxHeight: 120 }} />
        </div>
      )}

      <h3>Addresses</h3>
      <ul>
        {(client.address || []).map((addr, idx) => (
          <li key={idx}>
            {addr} <button onClick={() => deleteAddress(idx)}>Delete</button>
          </li>
        ))}
      </ul>
      <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="New Address" />
      <button onClick={addAddress}>Add Address</button>

      <h3>Contacts</h3>
      <ul>
        {(client.contacts || []).map((c, idx) => (
          <li key={idx}>
            {c.name} – {c.email} – {c.phone}
            <button onClick={() => deleteContact(idx)}>Delete</button>
          </li>
        ))}
      </ul>
      <input value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="Name" />
      <input value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} placeholder="Email" />
      <input value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="Phone" />
      <button onClick={addContact}>Add Contact</button>

      <h3>Projects</h3>
      <input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Project Name" />
      <input value={newProject.code} onChange={(e) => setNewProject({ ...newProject, code: e.target.value })} placeholder="Project Code" />
      <button onClick={addProject}>Add Project</button>
      <ul>
        {(client.projects || []).map(p => (
          <li key={p.id}>
            <strong>{p.name}</strong> ({p.code})
            <button onClick={() => deleteProject(p.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Service Calls</h3>
      <input value={newServiceCall.name} onChange={(e) => setNewServiceCall({ ...newServiceCall, name: e.target.value })} placeholder="Service Call Name" />
      <button onClick={addServiceCall}>Add Service Call</button>
      <ul>
        {(client.serviceCalls || []).map(c => (
          <li key={c.id}>
            {c.name} ({c.status})
            <button onClick={() => deleteServiceCall(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LogoHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <img src="/logos/cjd-logo.png" alt="CJD Logo" style={{ maxHeight: 120 }} />
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

export default ClientDetails;
