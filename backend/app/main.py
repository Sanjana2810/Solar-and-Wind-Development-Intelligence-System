from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import auth, projects, environmental, sites


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Solar & Wind Deployment Intelligence API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(environmental.router)
app.include_router(sites.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Solar & Wind Deployment Intelligence API"}


@app.on_event("startup")
def startup_event():
    print("--- REGISTERED ROUTES ---")
    for route in app.routes:
        if hasattr(route, "path"):
            print(f"Path: {route.path} | Methods: {getattr(route, 'methods', None)}")
    print("-------------------------")