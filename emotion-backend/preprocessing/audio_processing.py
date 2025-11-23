import librosa
import numpy as np
import io
from typing import Tuple
import logging

from config import settings

logger = logging.getLogger(__name__)

def load_audio_from_file(file_path: str) -> Tuple[np.ndarray, int]:
    """
    Load audio from a file path.
    
    Args:
        file_path: Path to the audio file
        
    Returns:
        Tuple of (audio_data, sample_rate)
    """
    try:
        audio_data, sample_rate = librosa.load(file_path, sr=None)
        return audio_data, sample_rate
    except Exception as e:
        logger.error(f"Error loading audio from {file_path}: {e}")
        raise


def load_audio_from_bytes(audio_bytes: bytes) -> Tuple[np.ndarray, int]:
    """
    Load audio from bytes.
    
    Args:
        audio_bytes: Audio data as bytes
        
    Returns:
        Tuple of (audio_data, sample_rate)
    """
    try:
        # Create a BytesIO buffer from the bytes
        buffer = io.BytesIO(audio_bytes)
        
        # Load audio from the buffer
        audio_data, sample_rate = librosa.load(buffer, sr=None)
        return audio_data, sample_rate
    except Exception as e:
        logger.error(f"Error loading audio from bytes: {e}")
        raise


def preprocess_audio_chunk(audio_data: np.ndarray, sample_rate: int) -> np.ndarray:
    """
    Preprocess an audio chunk for model inference.
    
    Args:
        audio_data: Raw audio data
        sample_rate: Sample rate of the audio
        
    Returns:
        Preprocessed audio data ready for model input
    """
    # Resample to the required sample rate if needed
    if sample_rate != settings.SAMPLE_RATE:
        audio_data = librosa.resample(audio_data, orig_sr=sample_rate, target_sr=settings.SAMPLE_RATE)
    
    # Convert to mono if stereo
    if len(audio_data.shape) > 1:
        audio_data = librosa.to_mono(audio_data)
    
    # Normalize audio
    audio_data = audio_data / np.max(np.abs(audio_data)) if np.max(np.abs(audio_data)) != 0 else audio_data
    
    return audio_data


def segment_audio(audio_data: np.ndarray, sample_rate: int) -> list:
    """
    Segment audio into chunks of specified duration.
    
    Args:
        audio_data: Audio data to segment
        sample_rate: Sample rate of the audio
        
    Returns:
        List of audio chunks
    """
    chunk_size = settings.DURATION * sample_rate
    chunks = []
    
    for i in range(0, len(audio_data), chunk_size):
        chunk = audio_data[i:i + chunk_size]
        # Pad if chunk is smaller than expected
        if len(chunk) < chunk_size:
            padding = np.zeros(chunk_size - len(chunk))
            chunk = np.concatenate([chunk, padding])
        chunks.append(chunk)
    
    return chunks