import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

export default function App() {
  const [view, setView] = useState(localStorage.getItem("token") ? "projects" : "login");
  const [activeProject, setActiveProject] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setView("login");
  };

  if (view === "login") {
    return (
      <>
        <Login onLoggedIn={() => setView("projects")} />
        <p style={{ textAlign: "center" }}>
          <button onClick={() => setView("register")}>Create an account</button>
        </p>
      </>
    );
  }

  if (view === "register") {
    return (
      <>
        <Register onRegistered={() => setView("login")} />
        <p style={{ textAlign: "center" }}>
          <button onClick={() => setView("login")}>Back to login</button>
        </p>
      </>
    );
  }

  if (view === "changePassword") {
    return <ChangePassword onBack={() => setView("projects")} />;
  }

  if (view === "projects") {
    return (
      <Projects
        onOpenProject={(p) => {
          setActiveProject(p);
          setView("projectDetail");
        }}
        onLogout={logout}
        onChangePassword={() => setView("changePassword")}
      />
    );
  }

  if (view === "projectDetail") {
    return <ProjectDetail project={activeProject} onBack={() => setView("projects")} />;
  }

  return null;
}