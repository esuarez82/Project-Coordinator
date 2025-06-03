// src/pages/InternalInventory.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

function InternalInventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", qty: "", location: "" });
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.qty || !newItem.location) return;
    const updated = [
      ...items,
      { ...newItem, id: Date.now().toString() }
    ];
    setItems(updated);
    setNewItem({ name: "", qty: "", location: "" });
  };

  const handleUpdateItem = (id, key, value) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    setItems(updated);
  };

  const handleDeleteItems = () => {
    const updated = items.filter(item => !selectedItems.includes(item.id));
    setItems(updated);
    setSelectedItems([]);
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <LogoHeader />
      <h2>Internal Inventory</h2>

      {/* Add new item */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          placeholder="Quantity"
          type="number"
          value={newItem.qty}
          onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          placeholder="Location"
          value={newItem.location}
          onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAddItem}>➕ Add</button>
        <button onClick={handleDeleteItems} disabled={!selectedItems.length}>🗑 Delete Selected</button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === items.length && items.length > 0} /></th>
            <th>Item</th>
            <th>Qty</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
              </td>
              <td>
                <input
                  value={item.name}
                  onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleUpdateItem(item.id, "qty", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={item.location}
                  onChange={(e) => handleUpdateItem(item.id, "location", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default InternalInventory;
