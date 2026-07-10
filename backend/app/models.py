from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    status = Column(String, default="Prospecting")
    latitude = Column(Float)
    longitude = Column(Float)