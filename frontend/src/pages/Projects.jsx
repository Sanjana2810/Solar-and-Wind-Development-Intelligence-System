import React, { useEffect, useState } from "react";
import api from '../api'; 

export default function Projects({ onOpenProject, onLogout, onChangePassword }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");

  const loadProjects = async () => {
    
    const data = await api.getProjects();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    
    await api.createProject({ name, region });
    setName("");
    setRegion("");
    loadProjects();
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

      <form onSubmit={createProject} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <button type="submit">+ New Project</button>
      </form>

      {projects.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8, cursor: "pointer" }}
          onClick={() => onOpenProject(p)}
        >
          <strong>{p.name}</strong> — {p.region || "no region set"}
        </div>
      ))}
      {projects.length === 0 && <p>No projects yet — create one above.</p>}
    </div>
  );
}