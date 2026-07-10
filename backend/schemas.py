
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator

from models import RoleEnum


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.renewable_energy_planner

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    full_name: str
    email: EmailStr
    role: RoleEnum
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("New password must be at least 8 characters long")
        return v


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    region: Optional[str] = None


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    name: str
    description: Optional[str]
    region: Optional[str]
    owner_id: uuid.UUID
    created_at: datetime


class SiteCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    land_area_ha: Optional[float] = None
    elevation_m: Optional[float] = None
    existing_infrastructure: Optional[str] = None
    land_ownership: Optional[str] = None


class SiteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    project_id: uuid.UUID
    name: str
    latitude: float
    longitude: float
    land_area_ha: Optional[float]
    elevation_m: Optional[float]
    existing_infrastructure: Optional[str]
    land_ownership: Optional[str]
    created_at: datetime


class EnvironmentalReadingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    site_id: uuid.UUID
    source: str
    solar_irradiance: Optional[float]
    wind_speed: Optional[float]
    wind_direction: Optional[float]
    temperature: Optional[float]
    rainfall: Optional[float]
    cloud_cover: Optional[float]
    land_slope: Optional[float]
    vegetation_index: Optional[float]
    fetched_at: datetime