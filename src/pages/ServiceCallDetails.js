import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ThreadedCommentSection from "../components/ThreadedCommentSection";
import TeamAssignmentAccordion from "../components/TeamAssignmentAccordion";
import "../components/TeamAssignmentAccordion.css";
import { differenceInSeconds } from "date-fns";

function ServiceCallDetails({ clients, setClients }) {
  const { serviceCallId } = useParams();
  const navigate = useNavigate();
  const [serviceCall, setServiceCall] = useState(null);
  const [client, setClient] = useState(null);
  const [assignedTeam, setAssignedTeam] = useState([]);
  const [priority, setPriority] = useState("Medium");
  const [slaStart, setSlaStart] = useState("");
  const [slaDuration, setSlaDuration] = useState(4);
  const [slaRemaining, setSlaRemaining] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const foundClient = clients.find(c =>
      c.serviceCalls.some(call => call.id === serviceCallId)
    );
    if (foundClient) {
      const foundCall = foundClient.serviceCalls.find(call => call.id === serviceCallId);
      setClient(foundClient);
      setServiceCall(foundCall);
      setAssignedTeam(foundCall.assignedTeam || []);
      setPriority(foundCall.priority || "Medium");
      setSlaStart(foundCall.slaStart || "");
      setSlaDuration(foundCall.slaDuration || 4);
      const savedComments = localStorage.getItem(`service-comments-${serviceCallId}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    }
  }, [serviceCallId, clients]);

  useEffect(() => {
    if (slaStart) {
      const interval = setInterval(() => {
        const endTime = new Date(new Date(slaStart).getTime() + slaDuration * 3600000);
        const secondsLeft = differenceInSeconds(endTime, new Date());
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        setSlaRemaining(
          secondsLeft > 0
            ? `${hours}h ${minutes}m ${seconds}s`
            : "SLA EXPIRED"
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [slaStart, slaDuration]);

  const saveServiceCall = (updatedCall) => {
    const updatedClient = {
      ...client,
      serviceCalls: client.serviceCalls.map(call =>
        call.id === updatedCall.id ? updatedCall : call
      )
    };
    const updatedClients = clients.map(c =>
      c.id === updatedClient.id ? updatedClient : c
    );
    setClients(updatedClients);
    localStorage.setItem("clients", JSON.stringify(updatedClients));
    setServiceCall(updatedCall);
  };

  useEffect(() => {
    if (serviceCall) {
      saveServiceCall({
        ...serviceCall,
        assignedTeam,
        priority,
        slaStart,
        slaDuration
      });
    }
  }, [assignedTeam, priority, slaStart, slaDuration]);

  const handleAddComment = (comment) => {
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`service-comments-${serviceCallId}`, JSON.stringify(updatedComments));
  };

  if (!client || !serviceCall) {
    return (
      <div style={{ padding: 20 }}>
        <LogoHeader />
        <p>Loading service call...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <LogoHeader />
      <button onClick={() => navigate("/service-calls")} style={{ marginBottom: 10 }}>← Back to Service Calls</button>
      <h2 style={{ textAlign: "center" }}>{serviceCall.name}</h2>

      <div style={{ marginBottom: 20 }}>
        <label><strong>Priority:</strong>{" "}
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>
        <br /><br />
        <label><strong>SLA Start Time:</strong>{" "}
          <input
            type="datetime-local"
            value={slaStart}
            onChange={(e) => setSlaStart(e.target.value)}
          />
        </label>
        <br /><br />
        <label><strong>SLA Duration (hrs):</strong>{" "}
          <input
            type="number"
            min={1}
            value={slaDuration}
            onChange={(e) => setSlaDuration(Number(e.target.value))}
          />
        </label>
        <br /><br />
        {slaStart && (
          <div>
            <strong>SLA Remaining:</strong>{" "}
            <span style={{ color: slaRemaining === "SLA EXPIRED" ? "red" : "green" }}>
              {slaRemaining}
            </span>
          </div>
        )}
      </div>

      <h3 style={{ textAlign: "center" }}>Team Assignment</h3>
      <TeamAssignmentAccordion selected={assignedTeam} setSelected={setAssignedTeam} />

      <h3 style={{ marginTop: 40 }}>Comments</h3>
      <ThreadedCommentSection comments={comments} onAddComment={handleAddComment} />
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

export default ServiceCallDetails;
