
// src/pages/ProjectInventoryCRUD.js
import React, { useState } from "react";

function ProjectInventoryCRUD({ client, project }) {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    make: "",
    model: "",
    serial: "",
    qty: "",
    mac: "",
    ip: "",
    login: "",
    pw: "",
    wallPort: "",
    swPort: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setInventory([...inventory, { ...newItem, id: Date.now().toString() }]);
    setNewItem({
      make: "",
      model: "",
      serial: "",
      qty: "",
      mac: "",
      ip: "",
      login: "",
      pw: "",
      wallPort: "",
      swPort: "",
    });
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Project Inventory for {client?.name} - {project?.name}</h2>

      <div style={{ marginBottom: 20 }}>
        <h4>Add Inventory Item</h4>
        {["make", "model", "serial", "qty", "mac", "ip", "login", "pw", "wallPort", "swPort"].map(field => (
          <input
            key={field}
            name={field}
            value={newItem[field]}
            onChange={handleChange}
            placeholder={field}
            style={{ margin: "4px" }}
          />
        ))}
        <button onClick={handleAdd}>Add Item</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>Upload Supporting File</h4>
        <input type="file" onChange={handleFileChange} />
        {file && <p>Selected file: {file.name}</p>}
      </div>

      <div>
        <h4>Inventory List</h4>
        <table border="1" cellPadding="4">
          <thead>
            <tr>
              <th>Make</th><th>Model</th><th>Serial</th><th>Qty</th>
              <th>MAC</th><th>IP</th><th>Login</th><th>PW</th>
              <th>Wall Port</th><th>SW Port</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.make}</td><td>{item.model}</td><td>{item.serial}</td><td>{item.qty}</td>
                <td>{item.mac}</td><td>{item.ip}</td><td>{item.login}</td><td>{item.pw}</td>
                <td>{item.wallPort}</td><td>{item.swPort}</td>
                <td><button onClick={() => handleDelete(item.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectInventoryCRUD;
