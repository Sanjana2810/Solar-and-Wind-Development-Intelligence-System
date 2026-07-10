"""Environmental Data Collection Engine — pulls live data from NASA POWER."""
import os
from datetime import datetime, timedelta

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db, raw_environmental_payloads
import models
import schemas
import auth

router = APIRouter(
    prefix="/projects/{project_id}/sites/{site_id}/environmental",
    tags=["Environmental Data"],
)

NASA_POWER_BASE_URL = os.getenv(
    "NASA_POWER_BASE_URL", "https://power.larc.nasa.gov/api/temporal/daily/point"
)


def _get_site(project_id: str, site_id: str, db: Session, current_user: models.User) -> models.Site:
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role.value != "administrator" and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized for this project")
    site = db.query(models.Site).filter(
        models.Site.id == site_id, models.Site.project_id == project_id
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


@router.post("/fetch", response_model=schemas.EnvironmentalReadingOut, status_code=201)
def fetch_environmental_data(
    project_id: str,
    site_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        auth.require_roles("gis_analyst", "renewable_energy_planner", "administrator")
    ),
):
    site = _get_site(project_id, site_id, db, current_user)

    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=7)

    params = {
        "parameters": "ALLSKY_SFC_SW_DWN,T2M,WS10M,PRECTOTCORR,CLOUD_AMT",
        "community": "RE",
        "longitude": site.longitude,
        "latitude": site.latitude,
        "start": start_date.strftime("%Y%m%d"),
        "end": end_date.strftime("%Y%m%d"),
        "format": "JSON",
    }

    try:
        response = httpx.get(NASA_POWER_BASE_URL, params=params, timeout=30.0)
        response.raise_for_status()
        payload = response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Failed to fetch NASA POWER data: {exc}")

    raw_environmental_payloads.insert_one(
        {
            "site_id": str(site.id),
            "source": "nasa_power",
            "fetched_at": datetime.utcnow(),
            "raw_payload": payload,
        }
    )

    params_data = payload.get("properties", {}).get("parameter", {})

    def avg(param_key: str):
        series = params_data.get(param_key, {})
        values = [v for v in series.values() if v not in (None, -999.0)]
        return sum(values) / len(values) if values else None

    reading = models.EnvironmentalReading(
        site_id=site.id,
        source="nasa_power",
        solar_irradiance=avg("ALLSKY_SFC_SW_DWN"),
        wind_speed=avg("WS10M"),
        temperature=avg("T2M"),
        rainfall=avg("PRECTOTCORR"),
        cloud_cover=avg("CLOUD_AMT"),
    )
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


@router.get("/", response_model=list[schemas.EnvironmentalReadingOut])
def list_environmental_readings(
    project_id: str,
    site_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    site = _get_site(project_id, site_id, db, current_user)
    return (
        db.query(models.EnvironmentalReading)
        .filter(models.EnvironmentalReading.site_id == site.id)
        .order_by(models.EnvironmentalReading.fetched_at.desc())
        .all()
    )