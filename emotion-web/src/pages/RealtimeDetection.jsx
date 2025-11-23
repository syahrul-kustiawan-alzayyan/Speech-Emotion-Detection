import React, { useState, useEffect } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import WaveformVisualizer from '../components/WaveformVisualizer';
import ResultCard from '../components/ResultCard';
import useAudioRecorder from '../hooks/useAudioRecorder';
import { WebSocketService } from '../services/websocket';
import { formatPredictionResult } from '../utils/formatUtils';

const RealtimeDetection = () => {
  const [latestResult, setLatestResult] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const webSocketService = new WebSocketService();

  // Using the custom hooks
  const {
    isRecording,
    audioData,
    startRecording,
    stopRecording
  } = useAudioRecorder(webSocketService);

  const handleStart = async () => {
    setConnectionStatus('connecting');

    // Generate a unique client ID
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Connect to WebSocket first
    webSocketService.onMessage((data) => {
      setLatestResult(data);
    });

    webSocketService.onOpen(() => {
      setConnectionStatus('connected');
      // Now that WebSocket is open, start recording
      startRecording();
    });

    webSocketService.onClose(() => {
      setConnectionStatus('disconnected');
    });

    webSocketService.onError((error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    });

    webSocketService.connect(clientId);
  };

  const handleStop = () => {
    stopRecording();
    if (webSocketService.ws && webSocketService.ws.readyState === WebSocket.OPEN) {
      webSocketService.close();
    }
    setConnectionStatus('disconnected');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Real-time Emotion Detection</h1>
        <p className="text-gray-600 mb-8">
          Speak into your microphone and see real-time emotion analysis
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AudioRecorder 
              onRecording={audioData}
              onStart={handleStart}
              onStop={handleStop}
              isRecording={isRecording}
              connectionStatus={connectionStatus}
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Live Audio Visualization</h3>
              <WaveformVisualizer 
                audioData={audioData} 
                isRecording={isRecording} 
              />
            </div>
          </div>
          
          <div>
            <ResultCard result={latestResult} />
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Predictions</h3>
              {latestResult ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="capitalize">{latestResult.label}</span>
                      <span className="text-sm text-gray-500">
                        {(latestResult.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No predictions yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">How Real-time Detection Works</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Click "Start Recording" to begin capturing audio from your microphone</li>
            <li>Your audio is sent to our server in small chunks for processing</li>
            <li>The AI model analyzes each chunk to detect emotions in real-time</li>
            <li>Results are displayed as they become available</li>
            <li>Stop recording when you're finished speaking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDetection;