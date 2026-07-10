from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement

from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/projects/{project_id}/sites", tags=["Project & Site Management"])


def _get_owned_project(project_id: str, db: Session, current_user: models.User) -> models.Project:
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role.value != "administrator" and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized for this project")
    return project


@router.post("/", response_model=schemas.SiteOut, status_code=201)
def add_site(
    project_id: str,
    site_in: schemas.SiteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        auth.require_roles("renewable_energy_planner", "gis_analyst", "administrator")
    ),
):
    _get_owned_project(project_id, db, current_user)

    point = WKTElement(f"POINT({site_in.longitude} {site_in.latitude})", srid=4326)

    site = models.Site(
        project_id=project_id,
        name=site_in.name,
        latitude=site_in.latitude,
        longitude=site_in.longitude,
        location=point,
        land_area_ha=site_in.land_area_ha,
        elevation_m=site_in.elevation_m,
        existing_infrastructure=site_in.existing_infrastructure,
        land_ownership=site_in.land_ownership,
    )
    db.add(site)
    db.commit()
    db.refresh(site)
    return site


@router.get("/", response_model=List[schemas.SiteOut])
def list_sites(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    _get_owned_project(project_id, db, current_user)
    return db.query(models.Site).filter(models.Site.project_id == project_id).all()


@router.get("/{site_id}", response_model=schemas.SiteOut)
def get_site(
    project_id: str,
    site_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    _get_owned_project(project_id, db, current_user)
    site = db.query(models.Site).filter(
        models.Site.id == site_id, models.Site.project_id == project_id
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site