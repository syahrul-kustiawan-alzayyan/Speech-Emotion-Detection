from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Any
import json
import logging
import asyncio
import numpy as np

from services.prediction_service import prediction_service
from preprocessing.audio_processing import preprocess_audio_chunk
from config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ws")

# Store active WebSocket connections
active_connections: Dict[str, WebSocket] = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client {client_id} disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, client_id: str):
        websocket = self.active_connections.get(client_id)
        if websocket:
            await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for client_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.error(f"Error sending message to client {client_id}: {e}")
                self.disconnect(client_id)

manager = ConnectionManager()

@router.websocket("/realtime/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time emotion detection.

    Args:
        websocket: WebSocket connection object
        client_id: Unique identifier for the client
    """
    logger.info(f"Attempting to connect client {client_id} to WebSocket")
    await manager.connect(websocket, client_id)
    logger.info(f"Client {client_id} connected to WebSocket successfully")

    try:
        logger.info(f"Starting to receive data from client {client_id}")
        while True:
            # Receive audio data from the client
            logger.info(f"Waiting for audio data from client {client_id}")
            data = await websocket.receive_bytes()
            logger.info(f"Received audio data from client {client_id}, size: {len(data)} bytes")

            try:
                # The data from browser is in WebM format, we need to process it differently
                # For now, we'll try to convert it assuming it's raw audio data
                # In a real implementation, you may need to properly decode the WebM format

                # First, try to handle as raw bytes (might work if MediaRecorder outputs raw PCM)
                logger.info(f"Attempting to process audio data from client {client_id}")
                logger.info(f"Raw data size: {len(data)} bytes")

                audio_array = None

                # Try different data types to handle potential alignment issues
                for dtype in [np.int16, np.int32, np.float32]:
                    try:
                        # Check if buffer size is a multiple of element size
                        element_size = np.dtype(dtype).itemsize
                        if len(data) % element_size == 0:
                            audio_array = np.frombuffer(data, dtype=dtype)

                            # If it's int16 or int32, convert to float32
                            if dtype in [np.int16, np.int32]:
                                max_val = np.iinfo(dtype).max
                                audio_array = audio_array.astype(np.float32) / max_val

                            logger.info(f"Successfully converted to {dtype}, size: {len(audio_array)}")
                            break
                        else:
                            logger.debug(f"Buffer size not multiple of {dtype} element size, trying next type")
                    except Exception:
                        continue  # Try next dtype

                # If all attempts failed, send error message
                if audio_array is None:
                    logger.error(f"Could not convert audio data from client {client_id} - incompatible format")
                    error_msg = json.dumps({
                        "error": "Unsupported audio format",
                        "message": f"Cannot process audio data of size {len(data)} bytes"
                    })
                    await manager.send_personal_message(error_msg, client_id)
                    continue

                logger.info(f"Audio array shape: {audio_array.shape if hasattr(audio_array, 'shape') else len(audio_array)}")

                # Preprocess the audio
                processed_audio = preprocess_audio_chunk(audio_array, settings.SAMPLE_RATE)
                logger.info("Audio preprocessing completed")

                # Make prediction
                result = prediction_service.predict(processed_audio, settings.SAMPLE_RATE)
                logger.info(f"Prediction result for client {client_id}: {result}")

                # Send prediction result back to client
                await manager.send_personal_message(json.dumps(result), client_id)

            except Exception as processing_error:
                logger.error(f"Error processing audio data from client {client_id}: {processing_error}")
                error_msg = json.dumps({
                    "error": "Error processing audio data",
                    "message": str(processing_error)
                })
                await manager.send_personal_message(error_msg, client_id)

    except WebSocketDisconnect:
        logger.info(f"WebSocket connection for client {client_id} disconnected by client")
        manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"Unexpected error in WebSocket connection for client {client_id}: {e}")
        manager.disconnect(client_id)