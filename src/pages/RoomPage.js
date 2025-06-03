import React, { useState } from "react";

function RoomPage() {
  const [elevationImage, setElevationImage] = useState(null);
  const [inventory, setInventory] = useState([
    { make: "", model: "", serial: "", qty: "" },
  ]);

  const handleElevationChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setElevationImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInventoryChange = (index, field, value) => {
    const newInventory = [...inventory];
    newInventory[index][field] = value;
    setInventory(newInventory);
  };

  const addInventoryRow = () => {
    setInventory([...inventory, { make: "", model: "", serial: "", qty: "" }]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Room Detail Page</h2>

      <div>
        <h4>Upload Room Elevation</h4>
        <input type="file" accept="image/*" onChange={handleElevationChange} />
        {elevationImage && (
          <div>
            <img src={elevationImage} alt="Elevation" style={{ width: "300px", marginTop: "10px" }} />
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Room Inventory</h4>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>Serial Number</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>
                <td><input value={item.make} onChange={(e) => handleInventoryChange(index, "make", e.target.value)} /></td>
                <td><input value={item.model} onChange={(e) => handleInventoryChange(index, "model", e.target.value)} /></td>
                <td><input value={item.serial} onChange={(e) => handleInventoryChange(index, "serial", e.target.value)} /></td>
                <td><input value={item.qty} onChange={(e) => handleInventoryChange(index, "qty", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addInventoryRow} style={{ marginTop: "10px" }}>Add Row</button>
      </div>
    </div>
  );
}

export default RoomPage;
