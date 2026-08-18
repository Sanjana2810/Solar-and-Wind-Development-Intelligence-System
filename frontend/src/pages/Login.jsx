import React, { useState } from "react";
import api from '../api'; 

export default function Login({ onLoggedIn, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/api/v1/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem("token", token);
        onLoggedIn();
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      
      let errorMessage = "Login failed. Please check your credentials.";
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
      <h2>Sign in to your account</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 8 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 8 }} />
        {error && <p style={{ color: "red", margin: 0 }}>{renderErrorMessage()}</p>}
        <button type="submit" style={{ padding: 10, cursor: "pointer" }}>Login</button>
      </form>
      <p style={{ marginTop: 16 }}>
        Don't have an account? <button onClick={onRegisterClick} style={{ background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}>Register</button>
      </p>
    </div>
  );
}