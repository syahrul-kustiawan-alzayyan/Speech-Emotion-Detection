from fastapi import APIRouter
from fastapi.responses import JSONResponse
from typing import Dict

router = APIRouter(prefix="/health")

@router.get("/", 
            summary="Health check endpoint",
            description="Check if the server is running and healthy")
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify the server is running.
    
    Returns:
        Dictionary with status information
    """
    return {"status": "healthy", "message": "Emotion Detection API is running"}