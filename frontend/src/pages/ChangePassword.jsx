import React, { useState } from "react";
import api from '../api'; 

export default function ChangePassword({ onBack }) {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.new_password !== form.confirm_new_password) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
     
      await api.changePassword({
        current_password: form.current_password,
        new_password: form.new_password,
      });
      
      setSuccess("Password updated successfully.");
      setForm({ current_password: "", new_password: "", confirm_new_password: "" });
    } catch (err) {
      setError("Could not change password. Please check your current password.");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <button onClick={onBack}>← Back</button>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Current password"
          value={form.current_password}
          onChange={update("current_password")}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
          required
        />
        <input
          type="password"
          placeholder="New password (min. 8 characters)"
          value={form.new_password}
          onChange={update("new_password")}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
          minLength={8}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={form.confirm_new_password}
          onChange={update("confirm_new_password")}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
          minLength={8}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Update Password
        </button>
      </form>
    </div>
  );
}