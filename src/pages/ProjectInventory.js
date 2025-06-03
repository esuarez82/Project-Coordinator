import React, { useEffect, useState } from 'react';

const ProjectInventory = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [inventory, setInventory] = useState([]);

  // Load real projects from localStorage
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(storedProjects);
  }, []);

  // Load rooms when project is selected
  useEffect(() => {
    const project = projects.find((p) => p.name === selectedProject);
    setRooms(project?.rooms || []);
  }, [selectedProject, projects]);

  // Load inventory from localStorage for specific project + room
  useEffect(() => {
    if (selectedProject && selectedRoom) {
      const key = `inventory-${selectedProject}-${selectedRoom}`;
      const stored = JSON.parse(localStorage.getItem(key)) || [];
      setInventory(stored);
    }
  }, [selectedProject, selectedRoom]);

  const handleChange = (index, field, value) => {
    const updated = [...inventory];
    updated[index][field] = value;
    setInventory(updated);
  };

  const addRow = () => {
    setInventory([
      ...inventory,
      {
        location: '',
        make: '',
        model: '',
        serial: '',
        qty: '',
        mac: '',
        ip: '',
        login: '',
        pw: '',
        wall: '',
        switch: '',
      },
    ]);
  };

  const deleteRow = (index) => {
    const updated = [...inventory];
    updated.splice(index, 1);
    setInventory(updated);
  };

  const saveInventory = () => {
    const key = `inventory-${selectedProject}-${selectedRoom}`;
    localStorage.setItem(key, JSON.stringify(inventory));
    alert('Inventory saved!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="text-center mb-8">
        <img src="/logos/PJD.png" alt="CJD Logo" className="mx-auto w-24 h-auto" />
        <h1 className="text-2xl font-bold mt-2">Field Coordinator</h1>
        <h2 className="text-xl mt-4">Project Inventory</h2>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedRoom('');
            }}
            className="flex-1 p-2 border rounded"
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.name} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="flex-1 p-2 border rounded"
            disabled={!selectedProject}
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && selectedRoom ? (
          <>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      'Location',
                      'Make',
                      'Model',
                      'Serial',
                      'Qty',
                      'MAC',
                      'IP',
                      'Login',
                      'PW',
                      'Wall Port',
                      'SW Port',
                      'Actions',
                    ].map((header) => (
                      <th key={header} className="border p-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-1">
                        <select
                          value={item.location}
                          onChange={(e) => handleChange(index, 'location', e.target.value)}
                          className="w-full p-1 border rounded"
                        >
                          <option value="">Select</option>
                          {rooms.map((room) => (
                            <option key={room} value={room}>
                              {room}
                            </option>
                          ))}
                        </select>
                      </td>
                      {['make', 'model', 'serial', 'qty', 'mac', 'ip', 'login', 'pw', 'wall', 'switch'].map((field) => (
                        <td key={field} className="border p-1">
                          <input
                            type="text"
                            value={item[field]}
                            onChange={(e) => handleChange(index, field, e.target.value)}
                            className="w-full border rounded p-1"
                          />
                        </td>
                      ))}
                      <td className="border text-center p-1">
                        <button
                          onClick={() => deleteRow(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={addRow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                + Add Row
              </button>
              <button
                onClick={saveInventory}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                💾 Save Inventory
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            Select a project and room to begin editing inventory.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectInventory;
