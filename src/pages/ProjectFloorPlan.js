import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

function ProjectFloorPlan() {
  const { projectId } = useParams();
  const [imageURL, setImageURL] = useState(null);
  const [pins, setPins] = useState([]);
  const fileInputRef = useRef();
  const containerRef = useRef();

  const localKey = `floorPlan-${projectId}`;

  useEffect(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      const { imageURL, pins } = JSON.parse(saved);
      setImageURL(imageURL);
      setPins(pins || []);
    }
  }, [projectId]);

  useEffect(() => {
    if (imageURL) {
      localStorage.setItem(localKey, JSON.stringify({ imageURL, pins }));
    }
  }, [imageURL, pins]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageURL(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddPin = () => {
    setPins([...pins, { x: 50, y: 50, label: "New Area" }]);
  };

  const handleDrag = (index, e) => {
    const bounds = containerRef.current.getBoundingClientRect();
    const newPins = [...pins];
    newPins[index].x = e.clientX - bounds.left - 10;
    newPins[index].y = e.clientY - bounds.top - 10;
    setPins(newPins);
  };

  const handleLabelChange = (index, newLabel) => {
    const newPins = [...pins];
    newPins[index].label = newLabel;
    setPins(newPins);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Floor Plan - {projectId}</h2>
      <input type="file" accept="image/*,.pdf" ref={fileInputRef} onChange={handleFileUpload} />
      <button onClick={() => fileInputRef.current.click()}>Upload Floor Plan</button>
      <button onClick={handleAddPin} style={{ marginLeft: "10px" }}>Generate Pin</button>

      <div
        ref={containerRef}
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          position: "relative",
          width: "100%",
          maxWidth: "800px",
          minHeight: "500px"
        }}
      >
        {imageURL && imageURL.includes("pdf") ? (
          <object data={imageURL} type="application/pdf" width="100%" height="600px">
            <p>PDF preview not supported. <a href={imageURL}>Download</a></p>
          </object>
        ) : (
          imageURL && <img src={imageURL} alt="Floor Plan" style={{ width: "100%" }} />
        )}

        {pins.map((pin, index) => (
          <div
            key={index}
            onMouseDown={(e) => handleDrag(index, e)}
            style={{
              position: "absolute",
              top: `${pin.y}px`,
              left: `${pin.x}px`,
              width: "20px",
              height: "20px",
              backgroundColor: "red",
              borderRadius: "50%",
              cursor: "move",
              zIndex: 10
            }}
            title={pin.label}
          >
            <input
              type="text"
              value={pin.label}
              onChange={(e) => handleLabelChange(index, e.target.value)}
              style={{
                position: "absolute",
                top: "25px",
                left: "-20px",
                fontSize: "12px",
                width: "80px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectFloorPlan;
