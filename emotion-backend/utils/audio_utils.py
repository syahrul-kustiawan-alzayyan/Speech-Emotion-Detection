import numpy as np
import librosa
from typing import Tuple
import io

def validate_audio_file(audio_bytes: bytes) -> Tuple[bool, str]:
    """
    Validate if the provided bytes represent a valid audio file.
    
    Args:
        audio_bytes: Audio data as bytes
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        # Try to load the audio from bytes
        buffer = io.BytesIO(audio_bytes)
        audio_data, sample_rate = librosa.load(buffer, duration=1.0)  # Load just 1 second to test
        
        # Check if we got some data
        if len(audio_data) == 0:
            return False, "Audio file contains no data"
        
        # Check for valid sample rate
        if sample_rate <= 0:
            return False, "Invalid sample rate"
        
        return True, ""
    
    except Exception as e:
        return False, f"Invalid audio file: {str(e)}"


def convert_audio_format(audio_bytes: bytes, target_format: str = 'wav') -> bytes:
    """
    Convert audio to a specific format.
    
    Args:
        audio_bytes: Audio data as bytes
        target_format: Target format (e.g., 'wav', 'mp3')
        
    Returns:
        Converted audio data as bytes
    """
    # This would require additional libraries like pydub
    # For now, just return the original data
    return audio_bytes


def normalize_audio(audio_data: np.ndarray) -> np.ndarray:
    """
    Normalize audio data to the range [-1, 1].
    
    Args:
        audio_data: Audio data as numpy array
        
    Returns:
        Normalized audio data
    """
    max_val = np.max(np.abs(audio_data))
    if max_val > 0:
        return audio_data / max_val
    return audio_data


def pad_audio(audio_data: np.ndarray, target_length: int, pad_value: float = 0.0) -> np.ndarray:
    """
    Pad audio data to a target length.
    
    Args:
        audio_data: Audio data as numpy array
        target_length: Target length to pad to
        pad_value: Value to use for padding
        
    Returns:
        Padded audio data
    """
    if len(audio_data) >= target_length:
        return audio_data
    
    pad_length = target_length - len(audio_data)
    padding = np.full(pad_length, pad_value)
    
    return np.concatenate([audio_data, padding])


def trim_audio(audio_data: np.ndarray, max_length: int) -> np.ndarray:
    """
    Trim audio data to a maximum length.
    
    Args:
        audio_data: Audio data as numpy array
        max_length: Maximum length to trim to
        
    Returns:
        Trimmed audio data
    """
    if len(audio_data) <= max_length:
        return audio_data
    
    return audio_data[:max_length]