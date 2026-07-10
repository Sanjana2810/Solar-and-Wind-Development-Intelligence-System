from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, database

router = APIRouter()

@router.patch("/projects/{project_id}/status")
def update_project_status(project_id: int, new_status: str, db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project:
        project.status = new_status
        db.commit()
        return {"message": "Status updated successfully"}
    return {"error": "Project not found"}