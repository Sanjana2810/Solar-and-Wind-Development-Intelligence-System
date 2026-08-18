from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from .database import Base

class UserRole(enum.Enum):
    administrator = "administrator"
    gis_analyst = "gis_analyst"
    renewable_energy_planner = "renewable_energy_planner"
    viewer = "viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.viewer)
    
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True, nullable=False)
    region = Column(String, nullable=True)
    description = Column(String, nullable=True)
    status = Column(String, default="Prospecting")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="projects")
    sites = relationship("Site", back_populates="project", cascade="all, delete-orphan")

class Site(Base):
    __tablename__ = "sites"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    project = relationship("Project", back_populates="sites")
    readings = relationship("EnvironmentalReading", back_populates="site", cascade="all, delete-orphan")

class EnvironmentalReading(Base):
    __tablename__ = "environmental_readings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    source = Column(String, default="nasa_power")
    solar_irradiance = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)
    cloud_cover = Column(Float, nullable=True)
    fetched_at = Column(DateTime, default=datetime.utcnow)

    site = relationship("Site", back_populates="readings")