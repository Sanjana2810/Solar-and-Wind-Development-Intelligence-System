import React, { useState } from "react";
import api from '../api'; 

export default function ChangePassword({ onBack }) {
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm_new_password: "" });
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
      const token = localStorage.getItem("token");
      await api.changePassword(form.current_password, form.new_password, token);
      setSuccess("Password updated successfully.");
      setForm({ current_password: "", new_password: "", confirm_new_password: "" });
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      
      let errorMessage = "Could not change password. Please check your current password.";
      if (typeof detail === "string") {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail.map(d => (typeof d === "string" ? d : d.msg || JSON.stringify(d))).join(", ");
      } else if (detail !== null && typeof detail === "object") {
        errorMessage = detail.msg || JSON.stringify(detail);
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  const renderErrorMessage = () => {
    if (!error) return null;
    if (typeof error === "string") return error;
    return JSON.stringify(error);
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <button onClick={onBack}>← Back</button>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Current password" value={form.current_password} onChange={update("current_password")} style={{ width: "100%", padding: 8, marginBottom: 12 }} required />
        <input type="password" placeholder="New password" value={form.new_password} onChange={update("new_password")} style={{ width: "100%", padding: 8, marginBottom: 12 }} required />
        <input type="password" placeholder="Confirm new password" value={form.confirm_new_password} onChange={update("confirm_new_password")} style={{ width: "100%", padding: 8, marginBottom: 12 }} required />
        {error && <p style={{ color: "red" }}>{renderErrorMessage()}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>Update Password</button>
      </form>
    </div>
  );
}