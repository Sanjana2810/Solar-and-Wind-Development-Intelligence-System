from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

projects_db: Dict[str, dict] = {}

class Project(BaseModel):
    name: str
    region: str
    description: str
    status: str = "Prospecting"
    latitude: float = 0.0
    longitude: float = 0.0

@app.get("/api/v1/projects")
def get_projects():
    return list(projects_db.values())

@app.post("/api/v1/projects")
def create_project(project: Project):
    pid = f"PROJ-{len(projects_db) + 1}"
    projects_db[pid] = {"id": pid, **project.dict()}
    return {"message": "Project created", "id": pid}

@app.patch("/api/v1/projects/{project_id}/status")
def update_project_status(project_id: str, new_status: str):
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    projects_db[project_id]["status"] = new_status
    return {"message": "Status updated", "project": projects_db[project_id]}