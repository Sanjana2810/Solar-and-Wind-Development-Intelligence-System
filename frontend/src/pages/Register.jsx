import React, { useState } from "react";
import api from '../api'; 

const ROLES = [
  "renewable_energy_planner",
  "gis_analyst",
  "project_manager",
  "administrator",
];

export default function Register({ onRegistered }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES[0],
  });
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
    
      const data = await api.registerUser(form);
      
    
      if (data.message === "User registered successfully") {
        onRegistered();
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Server connection failed. Make sure the backend is running.");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full name"
          value={form.name} 
          onChange={update("name")}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
          required
        />
        <input
          type="password"
          placeholder="Password (min. 8 characters)"
          value={form.password}
          onChange={update("password")}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
          minLength={8}
          required
        />
        <select
          value={form.role}
          onChange={update("role")}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Register
        </button>
      </form>
    </div>
  );
}