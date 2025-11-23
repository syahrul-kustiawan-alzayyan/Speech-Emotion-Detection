from pydantic import BaseModel
import os
from typing import Optional, Set, List

class Settings(BaseModel):
    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))

    # Model configuration
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/keras_model/model_klasifikasi_emosi_suara.keras")  # Path to your specific model file
    PREPROCESSING_CONFIG_PATH: str = os.getenv("PREPROCESSING_CONFIG_PATH", "preprocessing/feature_config.json")
    SCALER_PATH: str = os.getenv("SCALER_PATH", "models/keras_model/scaler.pkl")  # Updated path to your scaler file

    # Audio processing configuration
    SAMPLE_RATE: int = int(os.getenv("SAMPLE_RATE", 22050))  # Standard sample rate
    DURATION: int = int(os.getenv("DURATION", 3))  # Duration in seconds for each chunk
    HOP_LENGTH: int = int(os.getenv("HOP_LENGTH", 512))
    N_FFT: int = int(os.getenv("N_FFT", 2048))

    # File upload configuration
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))  # 10MB in bytes
    ALLOWED_EXTENSIONS: Set[str] = {"wav", "mp3", "m4a", "flac"}

    # WebSocket configuration
    MAX_WEBSOCKET_CONNECTIONS: int = int(os.getenv("MAX_WEBSOCKET_CONNECTIONS", 100))
    WEBSOCKET_TIMEOUT: int = int(os.getenv("WEBSOCKET_TIMEOUT", 300))  # 5 minutes

    # Emotion labels (based on the model)
    EMOTION_LABELS: List[str] = ["neutral", "happy", "sad", "angry", "fear", "surprise"]

settings = Settings()