import librosa
import numpy as np
from typing import Dict
import json
import os

from config import settings

def extract_features(audio_data: np.ndarray, sample_rate: int) -> np.ndarray:
    """
    Extract features from audio data for emotion classification.
    
    Args:
        audio_data: Audio data as numpy array
        sample_rate: Sample rate of the audio
        
    Returns:
        Extracted features as numpy array
    """
    # Extract MFCCs
    mfccs = librosa.feature.mfcc(
        y=audio_data,
        sr=sample_rate,
        n_mfcc=settings.feature_config.get("n_mfcc", 13) if hasattr(settings, 'feature_config') else 13,
        hop_length=settings.HOP_LENGTH,
        n_fft=settings.N_FFT
    )
    
    # Extract spectral centroid
    spectral_centroids = librosa.feature.spectral_centroid(
        y=audio_data,
        sr=sample_rate,
        n_fft=settings.N_FFT,
        hop_length=settings.HOP_LENGTH
    )
    
    # Extract spectral rolloff
    spectral_rolloff = librosa.feature.spectral_rolloff(
        y=audio_data,
        sr=sample_rate,
        n_fft=settings.N_FFT,
        hop_length=settings.HOP_LENGTH
    )
    
    # Extract zero crossing rate
    zcr = librosa.feature.zero_crossing_rate(audio_data)
    
    # Extract chroma
    chroma = librosa.feature.chroma_stft(
        y=audio_data,
        sr=sample_rate,
        n_chroma=12,
        n_fft=settings.N_FFT,
        hop_length=settings.HOP_LENGTH
    )
    
    # Extract spectral bandwidth
    spectral_bandwidth = librosa.feature.spectral_bandwidth(
        y=audio_data,
        sr=sample_rate,
        n_fft=settings.N_FFT,
        hop_length=settings.HOP_LENGTH
    )
    
    # Compute statistics for each feature
    features = np.array([
        np.mean(mfccs, axis=1),
        np.var(mfccs, axis=1),
        np.mean(spectral_centroids),
        np.var(spectral_centroids),
        np.mean(spectral_rolloff),
        np.var(spectral_rolloff),
        np.mean(zcr),
        np.var(zcr),
        np.mean(chroma, axis=1),
        np.var(chroma, axis=1),
        np.mean(spectral_bandwidth),
        np.var(spectral_bandwidth)
    ])
    
    # Flatten the features array
    features = features.flatten()
    
    return features


def save_feature_config(config_path: str = None) -> None:
    """
    Save the feature configuration to a file.
    
    Args:
        config_path: Path to save the configuration. If None, uses default path.
    """
    if config_path is None:
        config_path = settings.PREPROCESSING_CONFIG_PATH
    
    feature_config = {
        "n_mfcc": 13,
        "n_mels": 128,
        "hop_length": settings.HOP_LENGTH,
        "n_fft": settings.N_FFT,
        "duration": settings.DURATION
    }
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    
    with open(config_path, 'w') as f:
        json.dump(feature_config, f, indent=2)


def load_feature_config(config_path: str = None) -> Dict:
    """
    Load the feature configuration from a file.
    
    Args:
        config_path: Path to load the configuration from. If None, uses default path.
        
    Returns:
        Feature configuration as a dictionary
    """
    if config_path is None:
        config_path = settings.PREPROCESSING_CONFIG_PATH
    
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Return default configuration if file doesn't exist
        return {
            "n_mfcc": 13,
            "n_mels": 128,
            "hop_length": settings.HOP_LENGTH,
            "n_fft": settings.N_FFT,
            "duration": settings.DURATION
        }