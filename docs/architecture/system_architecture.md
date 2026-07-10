# System Architecture & Planning Workflows

## 1. Project Objectives
The Solar & Wind Deployment Intelligence Platform aims to analyze complex geospatial, climatic, and environmental datasets to discover and rank the most viable locations for renewable energy installations. 

## 2. High-Level Planning Workflow
The core user workflow operates across four distinct phases:
1. **Data Ingestion:** System automatically tracks coordinates and queries historical satellite and weather trends.
2. **Analysis:** The platform filters sites against exclusion zones (protected land, water bodies) and scores terrain characteristics.
3. **ML Prediction:** Solar and wind estimation models calculate long-term energy outputs and potential generation performance.
4. **Decision Support:** Locations are prioritized based on proximity to the power grid, financial viability, and physical limitations.

## 3. Architecture Diagram
```mermaid
graph TD
    User([User / Planner]) -->|Web Browser / React App| FE[Frontend Client: Next.js/React]
    FE -->|API Requests| AGW[API Gateway: FastAPI]
    
    subgraph Microservices Layer
        AGW --> AuthSvc[User & Access Service]
        AGW --> ProjectSvc[Project & Site Management Service]
        AGW --> GISWSvc[Geospatial & Remote Sensing Service]
        AGW --> PredictEngine[Solar/Wind Prediction Engine]
    end

    subgraph Data & Analytics Layer
        GISWSvc --> PostGIS[(PostgreSQL + PostGIS)]
        ProjectSvc --> MongoDB[(MongoDB: Raw Metadata & Logs)]
        PredictEngine --> ML[ML Models: XGBoost / LightGBM]
    end
    
    subgraph External APIs
        GISWSvc --> NASA[NASA POWER / SRTM APIs]
        GISWSvc --> OSM[OpenStreetMap API]
    end