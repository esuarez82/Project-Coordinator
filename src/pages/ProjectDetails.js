// src/pages/ProjectDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ThreadedCommentSection from "../components/ThreadedCommentSection";

function ProjectDetails({ clients = [], setClients }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [newRoomName, setNewRoomName] = useState("");
  const [draggingRoomId, setDraggingRoomId] = useState(null);

  const availableStaff = {
    Techs: [
      { name: "Eddy Ramirez", email: "eramirez@cjdconsult.com" },
      { name: "Jaime Landicho", email: "jlandicho@cjdconsult.com" },
      { name: "Kenneth Liptak", email: "kliptak@cjdconsult.com" },
      { name: "Brian Jones", email: "bjones@cjdconsult.com" },
      { name: "Jesus Graciano", email: "jgraciano@cjdconsult.com" },
      { name: "James Andryshak", email: "jandryshak@cjdconsult.com" }
    ],
    PMs: [
      { name: "Ed Santana", email: "esantana@cjdconsult.com" },
      { name: "Enrique Suarez", email: "esuarez@cjdconsult.com" }
    ],
    Subs: [{ name: "Ryan Anne Langton", email: "rlangton@sjdatatech.com" }],
    Coordinators: [
      { name: "Nick Curcio", email: "ncurcio@cjdconsult.com" },
      { name: "Trevor Mack", email: "tmack@cjdconsult.com" },
      { name: "Ryan Francis", email: "rfrancis@cjdconsult.com" }
    ]
  };

  useEffect(() => {
    for (let c of clients) {
      const found = (c.projects || []).find((p) => p.id === projectId);
      if (found) {
        setProject(found);
        setClient(c);
        break;
      }
    }
  }, [projectId, clients]);

  const saveProject = (updatedProject) => {
    const updatedClient = {
      ...client,
      projects: client.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
    };
    const updatedClients = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    setClients(updatedClients);
    localStorage.setItem("clients", JSON.stringify(updatedClients));
    setProject(updatedProject);
  };

  const handleDateChange = (key, value) => {
    const updated = { ...project, [key]: value };
    saveProject(updated);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updated = { ...project, floorPlan: reader.result };
        saveProject(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const addRoom = () => {
    if (!newRoomName.trim()) return;
    const roomId = Date.now().toString();
    const updated = {
      ...project,
      rooms: [...(project.rooms || []), { id: roomId, name: newRoomName, x: 100, y: 100 }]
    };
    saveProject(updated);
    setNewRoomName("");
  };

  const updateRoomPosition = (id, x, y) => {
    const updatedRooms = (project.rooms || []).map(room =>
      room.id === id ? { ...room, x, y } : room
    );
    saveProject({ ...project, rooms: updatedRooms });
  };

  const handleDragStart = (id) => setDraggingRoomId(id);
  const handleDrop = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateRoomPosition(draggingRoomId, x, y);
    setDraggingRoomId(null);
  };

  const toggleSelect = (role, member) => {
    const key = role + ":" + member.email;
    setSelectedTeam(prev => {
      const updated = { ...prev };
      if (updated[key]) {
        delete updated[key];
      } else {
        updated[key] = { ...member, role };
      }
      return updated;
    });
  };

  const assignSelectedTeam = () => {
    const newAssignments = Object.values(selectedTeam);
    const existing = project.team || [];
    const merged = [...existing, ...newAssignments.filter(n => !existing.some(e => e.email === n.email && e.role === n.role))];
    saveProject({ ...project, team: merged });
    setSelectedTeam({});
  };

  if (!project || !client) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center" }}>
        <img src="/logos/cjd-logo.png" alt="CJD Logo" style={{ maxHeight: 100 }} />
        <h2>Field Coordinator</h2>
        <nav>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/clients">Clients</Link> |{" "}
          <Link to="/projects">Projects</Link> |{" "}
          <Link to="/service-calls">Service Calls</Link> |{" "}
          <Link to="/inventory">Inventory</Link> |{" "}
          <Link to="/reports">Reports</Link> |{" "}
          <Link to="/archive">Archive</Link>
        </nav>
      </div>

      <button onClick={() => navigate("/projects")}>← Back to Projects</button>

      <h2>
        <img src={"/logos/" + client.logo} alt="Client Logo" style={{ height: 40 }} /> “{project.code}”
      </h2>

      {/* 🗓 Start/End Date Inputs */}
      <div style={{ marginTop: 20 }}>
        <label>Start Date: </label>
        <input
          type="date"
          value={project.startDate || ""}
          onChange={(e) => handleDateChange("startDate", e.target.value)}
        />
        <br />
        <label>End Date: </label>
        <input
          type="date"
          value={project.endDate || ""}
          onChange={(e) => handleDateChange("endDate", e.target.value)}
        />
      </div>

      {/* Floor Plan */}
      <h3 style={{ marginTop: 30 }}>Upload Floor Plan</h3>
      <input type="file" accept="image/*,.pdf" onChange={handleImageUpload} />
      {project.floorPlan && (
        <div
          style={{
            position: "relative",
            border: "1px solid #ccc",
            display: "inline-block",
            marginBottom: "10px"
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <img src={project.floorPlan} alt="Floor Plan" style={{ maxWidth: "100%" }} />
          {(project.rooms || []).map(room => (
            <div
              key={room.id}
              draggable
              onDragStart={() => handleDragStart(room.id)}
              style={{
                position: "absolute",
                top: room.y,
                left: room.x,
                backgroundColor: "#ffeb3b",
                padding: "4px 6px",
                borderRadius: "50%",
                cursor: "move"
              }}
              onDoubleClick={() => navigate(`/projects/${project.id}/rooms/${room.id}`)}
              title={room.name}
            >
              📍
            </div>
          ))}
        </div>
      )}

      <h4>Select a Room</h4>
      <div>
        {(project.rooms || []).map(room => (
          <div key={room.id}>
            <Link to={`/projects/${project.id}/rooms/${room.id}`}>{room.name}</Link>
          </div>
        ))}
      </div>
      <input
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
        placeholder="New room name"
      />
      <button onClick={addRoom}>➕ Add Room</button>

      <div style={{ marginTop: 30 }}>
        <h3>Team Assignment</h3>
        {Object.entries(availableStaff).map(([role, members]) => (
          <details key={role}>
            <summary><strong>{role}</strong></summary>
            <ul>
              {members.map((member) => {
                const key = role + ":" + member.email;
                return (
                  <li key={member.email}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!selectedTeam[key]}
                        onChange={() => toggleSelect(role, member)}
                      />
                      {" "}{member.name} ({member.email})
                    </label>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
        <button onClick={assignSelectedTeam}>Assign Team</button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Assigned Team</h3>
        <ul>
          {(project.team || []).map((t, idx) => (
            <li key={idx}>
              {t.role}s: {t.name} ({t.email})
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Comments</h3>
        <ThreadedCommentSection type="project" id={projectId} />
      </div>
    </div>
  );
}

export default ProjectDetails;
