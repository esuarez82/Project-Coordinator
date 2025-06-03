// src/pages/RoomDetails.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ThreadedCommentSection from "../components/ThreadedCommentSection";

const RoomDetails = ({ clients = [] }) => {
  const { projectId, roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [projectInventory, setProjectInventory] = useState([]);

  useEffect(() => {
    const foundProject = clients.flatMap(c => c.projects || []).find(p => p.id === projectId);
    const foundRoom = foundProject?.rooms?.find(r => r.id === roomId);
    const localRoom = localStorage.getItem("room-" + roomId);
    setRoom(localRoom ? { ...foundRoom, ...JSON.parse(localRoom) } : foundRoom);

    const inventory = foundProject?.inventory || [];
    setProjectInventory(inventory);
  }, [clients, projectId, roomId]);

  const saveRoomToStorage = (updated) => {
    setRoom(updated);
    localStorage.setItem("room-" + roomId, JSON.stringify(updated));
  };

  const handleFileUpload = (e, key) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    const updated = { ...room, [key]: [...(room[key] || []), ...newFiles] };
    saveRoomToStorage(updated);
  };

  const handleDeleteFile = (key, index) => {
    const updatedFiles = [...(room[key] || [])];
    updatedFiles.splice(index, 1);
    const updated = { ...room, [key]: updatedFiles };
    saveRoomToStorage(updated);
  };

  const handlePreview = (url, name) => {
    if (window.confirm(`Would you like to download ${name}?`)) {
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    }
  };

  const renderFileGroup = (label, key) => (
    <div>
      <strong>{label}</strong><br />
      <input type="file" multiple onChange={(e) => handleFileUpload(e, key)} /><br />
      {(room[key] || []).map((f, i) => (
        <div key={i} style={{ marginTop: 5 }}>
          {f.url.match(/\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i) ? (
            <img
              src={f.url}
              alt={f.name}
              style={{ maxWidth: 180, cursor: "pointer", display: "block", marginBottom: 4 }}
              onClick={() => handlePreview(f.url, f.name)}
            />
          ) : (
            <a href={f.url} onClick={(e) => { e.preventDefault(); handlePreview(f.url, f.name); }}>{f.name}</a>
          )}
          <button onClick={() => handleDeleteFile(key, i)} style={{ marginLeft: 10 }}>Delete</button>
        </div>
      ))}
    </div>
  );

  if (!room) return <p style={{ padding: 20 }}>Loading room...</p>;

  const headers = ["Make", "Model", "Serial", "Qty", "MAC", "IP", "Login", "PW", "Wall Port", "SW Port"];

  const filteredInventory = projectInventory.filter(
    item => item.location === room.name
  );

  return (
    <div style={{ padding: 20 }}>
      <LogoHeader />
      <button onClick={() => navigate(-1)}>← Back to Project</button>
      <h2 style={{ textAlign: "center", marginTop: 20 }}>{room.name}</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 20 }}>
        {renderFileGroup("Upload Elevation", "elevationFiles")}
        {renderFileGroup("Upload As-Built", "asBuiltFiles")}
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Inventory</h3>
        <table border="1" cellPadding={5} style={{ width: "100%", marginTop: 10 }}>
          <thead>
            <tr>
              {headers.map(h => <th key={h}>{h}</th>)}
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, idx) => (
              <tr key={idx}>
                {headers.map(field => (
                  <td key={field}>{item[field.toLowerCase().replace(/ /g, "")] || ""}</td>
                ))}
                <td><input type="checkbox" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Comments</h3>
        <ThreadedCommentSection roomId={roomId} />
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>RMA Assignment</h3>
        <div>
          <label>Assign Coordinator: </label>
          <select multiple>
            <option>Nick Curcio</option>
            <option>Trevor Mack</option>
            <option>Ryan Francis</option>
          </select>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Assign PM: </label>
          <select multiple>
            <option>Ed Santana</option>
            <option>Enrique Suarez</option>
          </select>
        </div>
        <div style={{ marginTop: 10 }}>
          <strong>Logistics Contact:</strong> Rdosono@cjdconsult.com
        </div>
        <button style={{ marginTop: 10 }}>Assign RMA</button>
      </div>
    </div>
  );
};

const LogoHeader = () => (
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

export default RoomDetails;
