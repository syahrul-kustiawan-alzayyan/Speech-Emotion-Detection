import numpy as np
from typing import Union, List
import base64
import io
import struct

def audio_to_pcm_bytes(audio_data: np.ndarray) -> bytes:
    """
    Convert numpy audio array to PCM bytes.
    
    Args:
        audio_data: Audio data as numpy array
        
    Returns:
        Audio data as PCM bytes
    """
    # Ensure the data is in the right format (16-bit PCM)
    if audio_data.dtype != np.int16:
        # Normalize float data and convert to int16
        if audio_data.dtype in [np.float32, np.float64]:
            audio_data = np.clip(audio_data, -1.0, 1.0)
            audio_data = (audio_data * 32767).astype(np.int16)
    
    return audio_data.tobytes()


def pcm_bytes_to_audio(pcm_bytes: bytes, dtype=np.int16) -> np.ndarray:
    """
    Convert PCM bytes back to numpy audio array.
    
    Args:
        pcm_bytes: Audio data as PCM bytes
        dtype: Data type of the audio data
        
    Returns:
        Audio data as numpy array
    """
    return np.frombuffer(pcm_bytes, dtype=dtype)


def audio_to_base64(audio_data: np.ndarray) -> str:
    """
    Convert numpy audio array to base64 string.
    
    Args:
        audio_data: Audio data as numpy array
        
    Returns:
        Audio data as base64 string
    """
    pcm_bytes = audio_to_pcm_bytes(audio_data)
    return base64.b64encode(pcm_bytes).decode('utf-8')


def base64_to_audio(base64_string: str, dtype=np.int16) -> np.ndarray:
    """
    Convert base64 string to numpy audio array.
    
    Args:
        base64_string: Audio data as base64 string
        dtype: Data type of the audio data
        
    Returns:
        Audio data as numpy array
    """
    pcm_bytes = base64.b64decode(base64_string.encode('utf-8'))
    return pcm_bytes_to_audio(pcm_bytes, dtype)


def convert_samplerate(audio_data: np.ndarray, orig_sr: int, target_sr: int) -> np.ndarray:
    """
    Convert audio to a different sample rate.
    
    Args:
        audio_data: Audio data as numpy array
        orig_sr: Original sample rate
        target_sr: Target sample rate
        
    Returns:
        Audio data with new sample rate
    """
    if orig_sr == target_sr:
        return audio_data
    
    # Calculate new length based on sample rate ratio
    new_length = int(len(audio_data) * target_sr / orig_sr)
    
    # Resample using numpy's interpolation
    time_old = np.linspace(0, 1, len(audio_data))
    time_new = np.linspace(0, 1, new_length)
    
    return np.interp(time_new, time_old, audio_data)


def float32_to_int16(audio_data: np.ndarray) -> np.ndarray:
    """
    Convert float32 audio data to int16.
    
    Args:
        audio_data: Audio data as float32 numpy array
        
    Returns:
        Audio data as int16 numpy array
    """
    # Ensure data is in the range [-1, 1]
    audio_data = np.clip(audio_data, -1.0, 1.0)
    # Convert to int16
    return (audio_data * 32767).astype(np.int16)


def int16_to_float32(audio_data: np.ndarray) -> np.ndarray:
    """
    Convert int16 audio data to float32.
    
    Args:
        audio_data: Audio data as int16 numpy array
        
    Returns:
        Audio data as float32 numpy array
    """
    return audio_data.astype(np.float32) / 32767.0