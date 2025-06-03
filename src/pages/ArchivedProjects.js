import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ArchivedProjectView = () => {
  const { clientName, jobCode } = useParams();
  const navigate = useNavigate();

  const archivedProjects = JSON.parse(localStorage.getItem("archivedProjects")) || [];
  const currentProject = archivedProjects.find(
    (project) => project.clientName === clientName && project.jobCode === jobCode
  );

  if (!currentProject) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Archived Project Not Found</h2>
        <button onClick={() => navigate("/archive")}>Back to Archive</button>
      </div>
    );
  }

  const {
    projectName,
    archivedDate,
    archivedBy,
    notes,
    images = [],
    inventory = []
  } = currentProject;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{projectName || "Unnamed Project"}</h2>
      <p><strong>Client:</strong> {clientName}</p>
      <p><strong>Job Code:</strong> {jobCode}</p>
      <p><strong>Archived Date:</strong> {archivedDate}</p>
      <p><strong>Archived By:</strong> {archivedBy}</p>
      <p><strong>Notes:</strong> {notes || "No notes provided."}</p>

      <h3>Uploaded Images</h3>
      {images.length === 0 ? (
        <p>No images uploaded.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Project Image ${index + 1}`}
              style={{ maxWidth: "200px", border: "1px solid #ccc" }}
            />
          ))}
        </div>
      )}

      <h3>Inventory</h3>
      {inventory.length === 0 ? (
        <p>No inventory data.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black" }}>Make</th>
              <th style={{ border: "1px solid black" }}>Model</th>
              <th style={{ border: "1px solid black" }}>Qty</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black" }}>{item.Make}</td>
                <td style={{ border: "1px solid black" }}>{item.Model}</td>
                <td style={{ border: "1px solid black" }}>{item.Qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button style={{ marginTop: "20px" }} onClick={() => navigate("/archive")}>
        Back to Archive
      </button>
    </div>
  );
};

export default ArchivedProjectView;
