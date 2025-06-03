import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/cjd-logo.png";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh", 
      backgroundColor: "#ffffff"
    }}>
      <img src={logo} alt="CJD Logo" style={{ height: "150px", marginBottom: "20px" }} />
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Bridging the Gap</h1>
    </div>
  );
}

export default Splash;
