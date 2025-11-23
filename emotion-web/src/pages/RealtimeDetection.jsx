import React, { useState } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import WaveformVisualizer from '../components/WaveformVisualizer';
import ResultCard from '../components/ResultCard';
import useAudioRecorder from '../hooks/useAudioRecorder';
import { WebSocketService } from '../services/websocket';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Emotion Detection</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Speak into your microphone and see real-time emotion analysis powered by advanced AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <AudioRecorder
              onRecording={audioData}
              onStart={handleStart}
              onStop={handleStop}
              isRecording={isRecording}
              connectionStatus={connectionStatus}
            />

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Live Audio Waveform</h3>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <WaveformVisualizer
                  audioData={audioData}
                  isRecording={isRecording}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <ResultCard result={latestResult} />

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Analysis</h3>
              <div className="space-y-4">
                {latestResult ? (
                  Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <span className="text-sm">📊</span>
                        </div>
                        <span className="capitalize font-medium text-gray-800">{latestResult.label}</span>
                      </div>
                      <span className="text-sm font-bold text-indigo-600">
                        {(latestResult.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-500">Waiting for analysis results...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Live Detection Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 text-xl">1</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Start Recording</h4>
              <p className="text-gray-600 text-sm">Click the record button and allow microphone access</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 text-xl">2</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI Processing</h4>
              <p className="text-gray-600 text-sm">Your voice is analyzed in real-time by our AI model</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">3</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Results Display</h4>
              <p className="text-gray-600 text-sm">See emotions detected with confidence scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDetection;