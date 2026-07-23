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

  try {
    if (view === "login") {
      return (
        <Login 
          onLoggedIn={() => setView("projects")} 
          onRegisterClick={() => setView("register")} 
        />
      );
    }
    
    if (view === "register") return <Register onRegistered={() => setView("login")} />;
    if (view === "changePassword") return <ChangePassword onBack={() => setView("projects")} />;
    
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
      return (
        <ProjectDetail 
          project={activeProject} 
          onBack={() => setView("projects")} 
        />
      );
    }
  } catch (renderErr) {
    console.error("Render crash caught in App.jsx:", renderErr);
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
        <h3>Something went wrong rendering this view.</h3>
        <button onClick={() => setView("projects")} style={{ marginTop: 10, padding: "8px 16px" }}>
          Return to Projects
        </button>
      </div>
    );
  }

  return null;
}