import React from 'react';

export default function StatusUpdater({ projectId, currentStatus, onUpdate }) {
  const updateStatus = async (e) => {
    const newStatus = e.target.value;
    await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/status?new_status=${newStatus}`, {
      method: 'PATCH'
    });
    onUpdate();
  };

  return (
    <select defaultValue={currentStatus} onChange={updateStatus}>
      <option value="Prospecting">Prospecting</option>
      <option value="Feasibility">Feasibility</option>
      <option value="Permitting">Permitting</option>
      <option value="Operational">Operational</option>
    </select>
  );
}