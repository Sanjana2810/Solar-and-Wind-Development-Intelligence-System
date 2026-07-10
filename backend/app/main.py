from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Dict

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Project(BaseModel):
    name: str
    region: str
    description: str
    status: str = "Prospecting"
    latitude: float = 0.0
    longitude: float = 0.0

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


projects_db: Dict[str, dict] = {}


@app.post("/api/v1/auth/register")
def register_user(user: UserCreate):
    return {"message": "User registered successfully"}


@app.post("/api/v1/auth/login")
def login(username: str = Form(...), password: str = Form(...)):
    
    return {"access_token": "mock-token", "token_type": "bearer"}


@app.get("/api/v1/projects")
def get_projects():
    return list(projects_db.values())

@app.post("/api/v1/projects")
def create_project(project: Project):
    pid = f"PROJ-{len(projects_db) + 1}"
    projects_db[pid] = {"id": pid, **project.dict()}
    return {"message": "Project created", "id": pid}