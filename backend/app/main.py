from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import scholarships, recommendations, applications, profile

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ScholarMatch AI API",
    description="Intelligent Scholarship Discovery & Recommendation Engine API",
    version="1.0.0"
)

# CORS configuration allowing local dev and production frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(scholarships.router)
app.include_router(recommendations.router)
app.include_router(applications.router)
app.include_router(profile.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "ScholarMatch AI Engine",
        "version": "1.0.0",
        "database": "connected"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to ScholarMatch AI API",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }
