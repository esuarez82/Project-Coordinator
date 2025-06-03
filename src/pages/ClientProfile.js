import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ClientProfile.css";

function ClientProfile() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [newAddress, setNewAddress] = useState({ street: "", floor: "", city: "", state: "", zip: "" });
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", cell: "", office: "", email: "" });

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    const found = clients.find(c => c.id === clientId);
    if (found) {
      found.address = Array.isArray(found.address) ? found.address : [];
      found.contacts = Array.isArray(found.contacts) ? found.contacts : [];
      setClient(found);
    }
  }, [clientId]);

  const saveClient = (updatedClient) => {
    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    const updatedClients = clients.map(c => (c.id === updatedClient.id ? updatedClient : c));
    localStorage.setItem("clients", JSON.stringify(updatedClients));
    setClient({ ...updatedClient });
  };

  // --- Address functions ---
  const addAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) return;
    const updated = { ...client, address: [...client.address, newAddress] };
    saveClient(updated);
    setNewAddress({ street: "", floor: "", city: "", state: "", zip: "" });
  };

  const deleteAddress = (index) => {
    const updated = { ...client };
    updated.address.splice(index, 1);
    saveClient(updated);
  };

  // --- Contact functions ---
  const addContact = () => {
    if (!newContact.firstName || !newContact.lastName || !newContact.email) return;
    const updated = { ...client, contacts: [...client.contacts, newContact] };
    saveClient(updated);
    setNewContact({ firstName: "", lastName: "", cell: "", office: "", email: "" });
  };

  const deleteContact = (index) => {
    const updated = { ...client };
    updated.contacts.splice(index, 1);
    saveClient(updated);
  };

  if (!client) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <img src="/logos/cjd-logo.png" alt="CJD Logo" style={{ height: 40, marginRight: 10 }} />
        <h1 style={{ margin: 0 }}>Field Coordinator</h1>
      </div>

      <button onClick={() => navigate("/clients")}>← Back to Clients</button>
      <h2>{client.name}</h2>
      <img src={`/logos/${client.logo}`} alt="Client Logo" style={{ height: 100, marginBottom: 20 }} />

      {/* --- Address Section --- */}
      <h3>Address</h3>
      {client.address.map((addr, idx) => (
        <div key={idx} style={{ marginBottom: 10 }}>
          <input value={addr.street} readOnly style={{ marginRight: 5 }} />
          <input value={addr.floor} readOnly style={{ marginRight: 5 }} />
          <input value={addr.city} readOnly style={{ marginRight: 5 }} />
          <input value={addr.state} readOnly style={{ marginRight: 5 }} />
          <input value={addr.zip} readOnly style={{ marginRight: 5 }} />
          <button onClick={() => deleteAddress(idx)}>Delete</button>
        </div>
      ))}
      <div style={{ marginBottom: 20 }}>
        <input placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} style={{ marginRight: 5 }} />
        <input placeholder="Floor" value={newAddress.floor} onChange={(e) => setNewAddress({ ...newAddress, floor: e.target.value })} style={{ marginRight: 5 }} />
        <input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} style={{ marginRight: 5 }} />
        <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} style={{ marginRight: 5 }} />
        <input placeholder="Zip" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} style={{ marginRight: 5 }} />
        <button onClick={addAddress}>Add Address</button>
      </div>

      {/* --- Contact Section --- */}
      <h3>Contacts</h3>
      {client.contacts.map((contact, idx) => (
        <div key={idx} style={{ marginBottom: 10 }}>
          <input value={contact.firstName} readOnly style={{ marginRight: 5 }} />
          <input value={contact.lastName} readOnly style={{ marginRight: 5 }} />
          <input value={contact.cell} readOnly style={{ marginRight: 5 }} />
          <input value={contact.office} readOnly style={{ marginRight: 5 }} />
          <input value={contact.email} readOnly style={{ marginRight: 5 }} />
          <button onClick={() => deleteContact(idx)}>Delete</button>
        </div>
      ))}
      <div>
        <input placeholder="First Name" value={newContact.firstName} onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })} style={{ marginRight: 5 }} />
        <input placeholder="Last Name" value={newContact.lastName} onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })} style={{ marginRight: 5 }} />
        <input placeholder="Cell" value={newContact.cell} onChange={(e) => setNewContact({ ...newContact, cell: e.target.value })} style={{ marginRight: 5 }} />
        <input placeholder="Office" value={newContact.office} onChange={(e) => setNewContact({ ...newContact, office: e.target.value })} style={{ marginRight: 5 }} />
        <input placeholder="Email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} style={{ marginRight: 5 }} />
        <button onClick={addContact}>Add Contact</button>
      </div>
    </div>
  );
}

export default ClientProfile;
