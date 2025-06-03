import React from "react";

function ClientCard({ client, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        textAlign: "center",
        width: "150px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {client.logo ? (
        <img
          src={client.logo}
          alt={client.name}
          style={{ width: "100%", height: "100px", objectFit: "contain" }}
        />
      ) : (
        <div
          style={{
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          No Logo
        </div>
      )}
      <h4 style={{ marginTop: "10px" }}>{client.name}</h4>
    </div>
  );
}

export default ClientCard;
