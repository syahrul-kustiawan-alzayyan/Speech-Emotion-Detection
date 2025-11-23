from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
import logging
import os
from typing import Dict, Any

from services.prediction_service import prediction_service
from preprocessing.audio_processing import load_audio_from_bytes, preprocess_audio_chunk
from config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/predict")

@router.post("/file", 
             summary="Predict emotion from audio file",
             description="Upload an audio file to detect emotions in the audio content")
async def predict_from_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Predict emotion from an uploaded audio file.
    
    Args:
        file: The audio file to analyze (WAV, MP3, etc.)
        
    Returns:
        Dictionary containing the predicted emotion, confidence, and class probabilities
    """
    try:
        # Validate file type
        file_ext = file.filename.split(".")[-1].lower()
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_ext} not supported. Allowed types: {settings.ALLOWED_EXTENSIONS}"
            )
        
        # Validate file size
        file_content = await file.read()
        if len(file_content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        # Check if content is actually audio by loading it
        try:
            audio_data, sample_rate = load_audio_from_bytes(file_content)
        except Exception as e:
            logger.error(f"Error loading audio file: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is not a valid audio file"
            )
        
        # Preprocess the audio
        processed_audio = preprocess_audio_chunk(audio_data, sample_rate)
        
        # Make prediction
        result = prediction_service.predict(processed_audio, sample_rate)
        
        logger.info(f"Prediction made for file {file.filename}: {result['label']} with confidence {result['confidence']}")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in predict_from_file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during emotion prediction"
        )