import React, { useEffect, useState } from "react";
import api from '../api';
import MapComponent from '../components/MapComponents';
import StatusUpdater from '../components/StatusUpdater';

export default function ProjectDetail({ project, onBack }) {
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({ name: "", latitude: "", longitude: "", land_area_ha: "" });

  const loadSites = async () => {
    const data = await api.getSites(project.id);
    setSites(data);
  };

  useEffect(() => {
    loadSites();
  }, [project.id]);

  const addSite = async (e) => {
    e.preventDefault();
    await api.createSite(project.id, {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      land_area_ha: form.land_area_ha ? parseFloat(form.land_area_ha) : null,
    });
    setForm({ name: "", latitude: "", longitude: "", land_area_ha: "" });
    loadSites();
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <button onClick={onBack}>← Back to Projects</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <h2>{project.name}</h2>
        <StatusUpdater projectId={project.id} currentStatus={project.status} onUpdate={loadSites} />
      </div>

      {sites.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <MapComponent lat={sites[0].latitude} lng={sites[0].longitude} projectName={sites[0].name} />
        </div>
      )}

      <h3>Sites</h3>
      {/* ... (Existing form and table code) ... */}
    </div>
  );
}