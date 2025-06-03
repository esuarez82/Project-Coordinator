import React from "react";
import { useParams } from "react-router-dom";

function ClientProjects() {
  const { clientId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Client Projects</h2>
      <p>Showing projects for client: <strong>{clientId}</strong></p>
    </div>
  );
}

export default ClientProjects;
