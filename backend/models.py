"""SQLAlchemy models — implements docs/database_design/schema.md as real tables."""
import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Float, Boolean, ForeignKey, DateTime, Enum, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography

from database import Base


class RoleEnum(str, enum.Enum):
    renewable_energy_planner = "renewable_energy_planner"
    gis_analyst = "gis_analyst"
    project_manager = "project_manager"
    administrator = "administrator"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.renewable_energy_planner)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    password_updated_at = Column(DateTime, nullable=True)

    projects = relationship("Project", back_populates="owner")


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    region = Column(String, nullable=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="projects")
    sites = relationship("Site", back_populates="project", cascade="all, delete-orphan")


class Site(Base):
    __tablename__ = "sites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location = Column(Geography(geometry_type="POINT", srid=4326), nullable=True)

    land_area_ha = Column(Float, nullable=True)
    elevation_m = Column(Float, nullable=True)
    existing_infrastructure = Column(String, nullable=True)
    land_ownership = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="sites")
    environmental_readings = relationship(
        "EnvironmentalReading", back_populates="site", cascade="all, delete-orphan"
    )


class EnvironmentalReading(Base):
    __tablename__ = "environmental_readings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    site_id = Column(UUID(as_uuid=True), ForeignKey("sites.id"), nullable=False)
    source = Column(String, nullable=False)

    solar_irradiance = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    wind_direction = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)
    cloud_cover = Column(Float, nullable=True)
    land_slope = Column(Float, nullable=True)
    vegetation_index = Column(Float, nullable=True)

    fetched_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("Site", back_populates="environmental_readings")