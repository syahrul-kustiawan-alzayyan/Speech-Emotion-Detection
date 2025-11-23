from typing import Dict, Any, List
import json
from config import settings

def format_prediction_response(prediction_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format the prediction result into a standardized response.
    
    Args:
        prediction_result: Raw prediction result from the model
        
    Returns:
        Formatted prediction response
    """
    # Ensure required fields are present
    label = prediction_result.get("label", "unknown")
    confidence = prediction_result.get("confidence", 0.0)
    class_probs = prediction_result.get("class_probs", {})
    
    # Ensure confidence is between 0 and 1
    confidence = max(0.0, min(1.0, float(confidence)))
    
    # Format class probabilities ensuring they sum to approximately 1
    formatted_class_probs = {}
    for emotion in settings.EMOTION_LABELS:
        formatted_class_probs[emotion] = max(0.0, min(1.0, float(class_probs.get(emotion, 0.0))))
    
    # Create the formatted response
    formatted_response = {
        "label": label,
        "confidence": confidence,
        "class_probs": formatted_class_probs,
        "timestamp": _get_current_timestamp()
    }
    
    return formatted_response


def format_error_response(error_message: str, error_code: str = "PREDICTION_ERROR") -> Dict[str, Any]:
    """
    Format an error response.
    
    Args:
        error_message: Error message to include
        error_code: Error code for identification
        
    Returns:
        Formatted error response
    """
    return {
        "error": True,
        "error_code": error_code,
        "message": error_message,
        "timestamp": _get_current_timestamp()
    }


def format_health_response(status: str, details: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Format a health check response.
    
    Args:
        status: Health status
        details: Additional health details
        
    Returns:
        Formatted health response
    """
    response = {
        "status": status,
        "timestamp": _get_current_timestamp()
    }
    
    if details:
        response.update(details)
    
    return response


def format_websocket_response(data: Dict[str, Any]) -> str:
    """
    Format data for WebSocket transmission.
    
    Args:
        data: Data to format
        
    Returns:
        JSON string formatted for WebSocket transmission
    """
    return json.dumps(data)


def _get_current_timestamp() -> str:
    """
    Get the current timestamp in ISO format.
    
    Returns:
        Current timestamp as ISO string
    """
    from datetime import datetime
    return datetime.utcnow().isoformat() + "Z"


def format_realtime_prediction_response(prediction_result: Dict[str, Any], chunk_id: str = None) -> Dict[str, Any]:
    """
    Format a prediction result for real-time streaming.
    
    Args:
        prediction_result: Raw prediction result
        chunk_id: Optional chunk identifier
        
    Returns:
        Formatted real-time prediction response
    """
    base_response = format_prediction_response(prediction_result)
    
    # Add real-time specific fields
    realtime_response = {
        **base_response,
        "type": "prediction",
        "chunk_id": chunk_id or _generate_chunk_id()
    }
    
    return realtime_response


def _generate_chunk_id() -> str:
    """
    Generate a unique chunk identifier.
    
    Returns:
        Unique chunk identifier
    """
    import uuid
    return str(uuid.uuid4())