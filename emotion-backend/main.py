from fastapi import FastAPI, WebSocket, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict
import asyncio
import logging

from routes import predict_file, health_check, predict_realtime
from config import settings

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Emotion Detection API",
    description="API for detecting emotions in audio files and real-time audio streams",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_check.router, tags=["health"])
app.include_router(predict_file.router, tags=["prediction"])
app.include_router(predict_realtime.router, tags=["realtime"])

@app.get("/")
async def root():
    return {"message": "Emotion Detection API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )