import numpy as np
import tensorflow as tf
from tensorflow import keras
import joblib
import librosa
import logging
from typing import Dict, Any, List, Tuple
import io

from config import settings

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_config = None
        self._load_model()
        self._load_scaler()
        self._load_feature_config()
    
    def _load_model(self):
        """Load the Keras model from the specified path."""
        import os

        # Get the absolute path to the model
        model_path = settings.MODEL_PATH
        if not os.path.isabs(model_path):
            # Get the current working directory (emotion-backend directory)
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(backend_dir, model_path)
        else:
            model_path = settings.MODEL_PATH

        # Check the file extension and load accordingly
        if os.path.isfile(model_path):
            # Single model file (can be .keras, .h5, or SavedModel format)
            try:
                self.model = keras.models.load_model(model_path)
                logger.info(f"Keras model loaded successfully from {model_path}")
            except Exception as e:
                logger.error(f"Failed to load Keras model from {model_path}: {e}")
                self.model = self._create_mock_model()
        elif os.path.isdir(model_path):
            # SavedModel format (directory)
            try:
                self.model = keras.models.load_model(model_path)
                logger.info(f"SavedModel loaded successfully from {model_path}")
            except Exception as e:
                logger.error(f"Failed to load SavedModel from {model_path}: {e}")
                self.model = self._create_mock_model()
        else:
            logger.error(f"Model not found at {model_path}")
            self.model = self._create_mock_model()
    
    def _load_scaler(self):
        """Load the scaler used for preprocessing."""
        import os

        # Get the absolute path to the scaler
        scaler_path = settings.SCALER_PATH
        if not os.path.isabs(scaler_path):
            # Get the current working directory (emotion-backend directory)
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            scaler_path = os.path.join(backend_dir, scaler_path)
        else:
            scaler_path = settings.SCALER_PATH

        try:
            # Check if scaler file exists
            if os.path.exists(scaler_path):
                # Try different loading methods for .pkl files
                if scaler_path.endswith('.pkl') or scaler_path.endswith('.pickle'):
                    # Try loading with pickle first
                    try:
                        import pickle
                        with open(scaler_path, 'rb') as f:
                            self.scaler = pickle.load(f)
                        logger.info(f"Scaler loaded successfully from {scaler_path} using pickle")
                    except:
                        # If pickle fails, try joblib
                        try:
                            self.scaler = joblib.load(scaler_path)
                            logger.info(f"Scaler loaded successfully from {scaler_path} using joblib")
                        except Exception as joblib_error:
                            logger.error(f"Failed to load scaler with both pickle and joblib: {joblib_error}")
                            from sklearn.preprocessing import StandardScaler
                            self.scaler = StandardScaler()
                else:
                    # For non-pkl formats, try joblib
                    self.scaler = joblib.load(scaler_path)
                    logger.info(f"Scaler loaded successfully from {scaler_path}")
            else:
                logger.warning(f"Scaler file not found at {scaler_path}. Using StandardScaler as default.")
                from sklearn.preprocessing import StandardScaler
                self.scaler = StandardScaler()
        except Exception as e:
            logger.error(f"Failed to load scaler from {scaler_path}: {e}")
            # Create a mock scaler if loading fails
            from sklearn.preprocessing import StandardScaler
            self.scaler = StandardScaler()
    
    def _load_feature_config(self):
        """Load the feature extraction configuration."""
        import json
        try:
            with open(settings.PREPROCESSING_CONFIG_PATH, 'r') as f:
                self.feature_config = json.load(f)
            logger.info(f"Feature config loaded from {settings.PREPROCESSING_CONFIG_PATH}")
        except Exception as e:
            logger.error(f"Failed to load feature config: {e}")
            # Default feature config
            self.feature_config = {
                "n_mfcc": 13,
                "n_mels": 128,
                "hop_length": settings.HOP_LENGTH,
                "n_fft": settings.N_FFT
            }
    
    def _create_mock_model(self):
        """Create a mock model for demonstration purposes."""
        logger.info("Creating mock model for demonstration")
        # This is just a placeholder for when the actual model isn't available
        return MockModel()
    
    def preprocess_audio(self, audio_data: np.ndarray, sample_rate: int) -> np.ndarray:
        """Preprocess audio data for model input."""
        # Remove any NaN or infinite values
        audio_data = audio_data[np.isfinite(audio_data)]

        if len(audio_data) == 0:
            # If all values were NaN/inf, return a default small array
            audio_data = np.zeros(16000)  # 1 second of silence at 16kHz

        # Resample to the required sample rate if needed
        if sample_rate != settings.SAMPLE_RATE:
            audio_data = librosa.resample(audio_data, orig_sr=sample_rate, target_sr=settings.SAMPLE_RATE)

        # Convert to mono if stereo
        if len(audio_data.shape) > 1:
            audio_data = librosa.to_mono(audio_data)

        # Normalize audio
        max_val = np.max(np.abs(audio_data))
        if max_val > 0:
            audio_data = audio_data / max_val

        # Extract features
        features = self._extract_features(audio_data)

        # Reshape features to match model input
        if len(features.shape) == 1:
            features = features.reshape(1, -1)

        # Scale features if scaler is available
        try:
            features_scaled = self.scaler.transform(features)
        except:
            # If scaler fails, use the features as-is
            features_scaled = features

        return features_scaled
    
    def _extract_features(self, audio_data: np.ndarray) -> np.ndarray:
        """Extract features from audio data."""
        # Determine the expected input shape from the model
        try:
            expected_shape = self.model.input_shape
            # If the model expects a certain shape, we'll adapt our feature extraction
        except:
            # Default to MFCC-based features if model info not available
            expected_shape = None

        # If your model expects raw audio or a specific time series format
        if expected_shape and len(expected_shape) > 2 and expected_shape[1] > 1000:  # Likely expects time series
            # Pad or truncate to expected length
            expected_len = expected_shape[1]
            if len(audio_data) < expected_len:
                # Pad with zeros
                padding = np.zeros(expected_len - len(audio_data))
                audio_data = np.concatenate([audio_data, padding])
            elif len(audio_data) > expected_len:
                # Truncate
                audio_data = audio_data[:expected_len]
            return audio_data
        else:
            # Default: Extract MFCCs and other audio features
            # Extract MFCCs
            mfccs = librosa.feature.mfcc(
                y=audio_data,
                sr=settings.SAMPLE_RATE,
                n_mfcc=self.feature_config.get("n_mfcc", 13),
                hop_length=self.feature_config.get("hop_length", settings.HOP_LENGTH),
                n_fft=self.feature_config.get("n_fft", settings.N_FFT)
            )

            # Extract spectral centroid
            spectral_centroids = librosa.feature.spectral_centroid(
                y=audio_data,
                sr=settings.SAMPLE_RATE,
                n_fft=self.feature_config.get("n_fft", settings.N_FFT),
                hop_length=self.feature_config.get("hop_length", settings.HOP_LENGTH)
            )

            # Extract spectral rolloff
            spectral_rolloff = librosa.feature.spectral_rolloff(
                y=audio_data,
                sr=settings.SAMPLE_RATE,
                n_fft=self.feature_config.get("n_fft", settings.N_FFT),
                hop_length=self.feature_config.get("hop_length", settings.HOP_LENGTH)
            )

            # Extract zero crossing rate
            zcr = librosa.feature.zero_crossing_rate(audio_data)

            # Extract chroma
            chroma = librosa.feature.chroma_stft(
                y=audio_data,
                sr=settings.SAMPLE_RATE,
                n_chroma=12,  # Fixed to 12 chroma bins
                n_fft=self.feature_config.get("n_fft", settings.N_FFT),
                hop_length=self.feature_config.get("hop_length", settings.HOP_LENGTH)
            )

            # Extract spectral bandwidth
            spectral_bandwidth = librosa.feature.spectral_bandwidth(
                y=audio_data,
                sr=settings.SAMPLE_RATE,
                n_fft=self.feature_config.get("n_fft", settings.N_FFT),
                hop_length=self.feature_config.get("hop_length", settings.HOP_LENGTH)
            )

            # Compute statistics for each feature
            # Ensure all arrays have consistent shapes before concatenating
            features = np.concatenate([
                np.mean(mfccs, axis=1),
                np.var(mfccs, axis=1),
                [np.mean(spectral_centroids)],
                [np.var(spectral_centroids)],
                [np.mean(spectral_rolloff)],
                [np.var(spectral_rolloff)],
                [np.mean(zcr)],
                [np.var(zcr)],
                np.mean(chroma, axis=1),
                np.var(chroma, axis=1),
                [np.mean(spectral_bandwidth)],
                [np.var(spectral_bandwidth)]
            ])

            return features
    
    def predict(self, audio_data: np.ndarray, sample_rate: int) -> Dict[str, Any]:
        """Make a prediction on audio data."""
        try:
            # Preprocess the audio
            processed_data = self.preprocess_audio(audio_data, sample_rate)

            # Make prediction
            if isinstance(self.model, MockModel):
                # For demo purposes, return a mock prediction
                prediction = self.model.predict(processed_data)
            else:
                prediction = self.model.predict(processed_data)

            # Handle different prediction output formats
            if len(prediction.shape) > 1:
                # If prediction has multiple dimensions, get the first result
                probabilities = prediction[0]
            else:
                # If prediction is 1D, use as is
                probabilities = prediction

            # If probabilities don't sum to 1, assume it's logits and apply softmax
            if not np.isclose(np.sum(probabilities), 1.0, rtol=0.1):
                # Apply softmax to convert logits to probabilities
                exp_probs = np.exp(probabilities - np.max(probabilities))  # Subtract max for numerical stability
                probabilities = exp_probs / np.sum(exp_probs)

            # Ensure probabilities array matches the expected number of emotion classes
            if len(probabilities) != len(settings.EMOTION_LABELS):
                logger.warning(f"Model output size {len(probabilities)} doesn't match expected emotion classes {len(settings.EMOTION_LABELS)}. Using default mapping.")
                # Create a default mapping or use top predictions
                if len(probabilities) < len(settings.EMOTION_LABELS):
                    # Pad with zeros
                    padded_probs = np.zeros(len(settings.EMOTION_LABELS))
                    padded_probs[:len(probabilities)] = probabilities
                    probabilities = padded_probs
                else:
                    # Use only the first N probabilities
                    probabilities = probabilities[:len(settings.EMOTION_LABELS)]

            # Get the predicted label
            predicted_idx = np.argmax(probabilities)
            predicted_label = settings.EMOTION_LABELS[predicted_idx]

            # Create result dictionary
            result = {
                "label": predicted_label,
                "confidence": float(probabilities[predicted_idx]),
                "class_probs": {label: float(prob) for label, prob in zip(settings.EMOTION_LABELS, probabilities)}
            }

            return result
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            # Return a default result in case of error
            return {
                "label": "neutral",
                "confidence": 0.5,
                "class_probs": {label: 0.167 for label in settings.EMOTION_LABELS}
            }
    
    def _convert_to_multiclass(self, single_prob: float) -> np.ndarray:
        """Convert a single probability to multi-class probabilities (for demo purposes)."""
        # This is a mock implementation for demo purposes
        # In reality, the model would output the correct shape
        probs = np.random.dirichlet(np.ones(len(settings.EMOTION_LABELS)), size=1)[0]
        probs = probs / probs.sum()  # Normalize to sum to 1
        return probs

class MockModel:
    """Mock model for demonstration purposes when the actual model isn't available."""
    def predict(self, x):
        # Return random probabilities that sum to 1
        batch_size = x.shape[0] if len(x.shape) > 1 else 1
        num_classes = len(settings.EMOTION_LABELS)
        # Generate random probabilities
        probs = np.random.dirichlet(np.ones(num_classes), size=batch_size)
        return probs

# Global instance
prediction_service = PredictionService()