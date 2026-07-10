import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponents';
import StatusUpdater from '../components/StatusUpdater';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  
  const fetchProjects = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/projects');
    const data = await response.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Solar & Wind Projects</h1>
      {projects.map((project) => (
        <div key={project.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{project.name}</h3>
          <p>Status: {project.status}</p>
          
          {/* GIS Integration */}
          <MapComponent 
            lat={project.latitude || 0} 
            lng={project.longitude || 0} 
            projectName={project.name} 
          />
          
          {/* Workflow Integration */}
          <StatusUpdater 
            projectId={project.id} 
            currentStatus={project.status} 
            onUpdate={fetchProjects} 
          />
        </div>
      ))}
    </div>
  );
};

export default Dashboard;