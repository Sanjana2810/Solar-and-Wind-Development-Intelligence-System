import os
import time
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@db:5432/solar_wind_db"
)


engine = None
for i in range(10):
    try:
        temp_engine = create_engine(SQLALCHEMY_DATABASE_URL)
        with temp_engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        engine = temp_engine
        print("Database connected successfully!")
        break
    except Exception as e:
        print(f"Database not ready yet (attempt {i+1}/10). Retrying in 2 seconds...")
        time.sleep(2)

if not engine:
    raise Exception("Could not connect to the database after 10 attempts.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client["solar_wind_datalake"]

raw_environmental_payloads = mongo_db["raw_environmental_payloads"]