import React, { useState } from "react";
import api from '../api'; 

const ROLES = ["renewable_energy_planner", "gis_analyst", "project_manager", "administrator"];

export default function Register({ onRegistered }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: ROLES[0] });
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await api.register(form);
      if (data && data.message === "User registered successfully") {
        onRegistered();
      } else {
        setError(data?.message || "Registration failed.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Registration failed. Check console for details.");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Full name" value={form.name} onChange={update("name")} required style={{ width: "100%", marginBottom: 12 }} />
        <input type="email" placeholder="Email" value={form.email} onChange={update("email")} required style={{ width: "100%", marginBottom: 12 }} />
        <input type="password" placeholder="Password" value={form.password} onChange={update("password")} required style={{ width: "100%", marginBottom: 12 }} />
        <select value={form.role} onChange={update("role")} style={{ width: "100%", marginBottom: 12 }}>
          {ROLES.map((r) => <option key={r} value={r}>{r.replaceAll("_", " ")}</option>)}
        </select>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%" }}>Register</button>
      </form>
    </div>
  );
}