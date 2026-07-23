from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class BaseSchema(BaseModel):
    class Config:
        from_attributes = True
        protected_namespaces = ()

class UserBase(BaseSchema):
    email: EmailStr
    username: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Plain text password, to be hashed before saving")

class UserLogin(BaseSchema):
    email: EmailStr
    password: str = Field(..., description="User password for login verification")

class UserResponse(UserBase):
    id: str
    is_active: Optional[bool] = True
    created_at: Optional[datetime] = None

class PasswordChangeSchema(BaseSchema):
    current_password: str
    new_password: str = Field(..., min_length=8, description="New plain text password")

class Token(BaseSchema):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseSchema):
    email: Optional[str] = None

class SiteBase(BaseSchema):
    name: str = Field(..., description="Name of the energy site or project area")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    region_code: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class SiteResponse(SiteBase):
    id: str
    project_id: str
    created_at: Optional[datetime] = None


SiteOut = SiteResponse

class MetricBase(BaseSchema):
    site_id: str
    timestamp: Optional[datetime] = None
    temperature: Optional[float] = None
    solar_irradiance: Optional[float] = None
    wind_speed: Optional[float] = None
    rainfall: Optional[float] = None
    cloud_cover: Optional[float] = None
    raw_payload: Optional[Dict[str, Any]] = Field(default=None, description="Raw JSON response from NASA POWER API")

class MetricCreate(MetricBase):
    pass

class MetricResponse(MetricBase):
    id: str
    fetched_at: Optional[datetime] = None


EnvironmentalReadingOut = MetricResponse

class EvaluationBase(BaseSchema):
    site_id: str
    suitability_score: float = Field(..., ge=0.0, le=100.0, description="Final score computed by XGBoost")
    model_version: str = Field(..., description="Identifier for the active XGBoost model version")
    feature_importance: Optional[Dict[str, float]] = Field(default=None, description="Feature importance breakdown from the model")

class EvaluationCreate(EvaluationBase):
    pass

class EvaluationResponse(EvaluationBase):
    id: str
    evaluated_at: Optional[datetime] = None

class SitePipelineOutput(BaseSchema):
    site: SiteResponse
    latest_metrics: Optional[MetricResponse] = None
    latest_evaluation: Optional[EvaluationResponse] = None