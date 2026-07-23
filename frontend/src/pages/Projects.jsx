import React, { useEffect, useState } from "react";
import api from '../api'; 
import RegionSearch from '../components/RegionSearch';

export default function Projects({ onOpenProject, onLogout, onChangePassword }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const loadProjects = async () => {
    try {
        const data = await api.getProjects();
        setProjects(Array.isArray(data) ? data : []);
    } catch (err) { 
        console.error("Error loading projects:", err); 
    }
  };

  useEffect(() => { 
    loadProjects(); 
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    
    const finalLat = parseFloat(coords.lat);
    const finalLng = parseFloat(coords.lng);

    if (isNaN(finalLat) || isNaN(finalLng) || finalLat === 0 || finalLng === 0) {
        alert("Coordinates are missing or invalid. Please re-select the region from the dropdown search results.");
        return;
    }

    const payload = { 
        name: name.trim(), 
        region: region.trim(), 
        description: description ? description.trim() : "", 
        latitude: finalLat, 
        longitude: finalLng,
        lat: finalLat, 
        lon: finalLng,
        lng: finalLng
    };

    console.log("FINAL PAYLOAD GOING TO BACKEND:", payload);

    try {
        await api.post('/api/v1/projects/', payload);
        setName(""); 
        setRegion(""); 
        setDescription(""); 
        setCoords({ lat: null, lng: null });
        loadProjects();
    } catch (err) { 
        console.error("Creation error:", err.response?.data);
        alert("Failed to create project."); 
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/api/v1/projects/${projectId}`);
        loadProjects();
      } catch (err) {
        alert("Failed to delete project");
      }
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>My Projects</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onChangePassword}>Change Password</button>
          <button onClick={onLogout}>Log out</button>
        </div>
      </div>

      <form onSubmit={createProject} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        <input placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} required />
        
        <RegionSearch onSelect={(option) => {
            if (option) {
              setRegion(option.label);
              setCoords({ lat: option.lat, lng: option.lng || option.lon });
            } else {
              setRegion("");
              setCoords({ lat: null, lng: null });
            }
        }} />
        
        <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        
        <button type="submit" disabled={coords.lat === null || coords.lng === null}>
          {coords.lat === null ? "Select region from dropdown to enable" : "Create New Project"}
        </button>
      </form>

      {projects.map((p) => (
        <div 
            key={p.id} 
            style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }} 
            onClick={() => onOpenProject(p)}
        >
          <div>
            <strong>{p.name}</strong> — {p.region || "No region set"} (Lat: {p.latitude ?? p.lat ?? 'None'}, Lng: {p.longitude ?? p.lng ?? 'None'})
          </div>
          <button 
            onClick={(e) => handleDelete(e, p.id)} 
            style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}