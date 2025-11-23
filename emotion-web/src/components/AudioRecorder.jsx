import React, { useState, useEffect } from 'react';

const AudioRecorder = ({ onRecording, onStart, onStop, isRecording, connectionStatus }) => {
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    // Check if browser supports media devices
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // If we're recording, request microphone access
      if (isRecording) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            setPermission(true);
            // In a real app, we would use the stream here
          })
          .catch(err => {
            console.error("Error accessing microphone:", err);
            setPermission(false);
          });
      }
    } else {
      console.error("getUserMedia not supported");
    }
  }, [isRecording]);

  const handleStart = async () => {
    // Check if we have permission first
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
      console.log('Microphone permission status:', permissionStatus.state);

      if (permissionStatus.state === 'granted') {
        if (onStart) onStart();
      } else if (permissionStatus.state === 'prompt') {
        // Permission will be requested by the browser when startRecording is called
        if (onStart) onStart();
      } else {
        alert('Microphone access is blocked. Please enable microphone access in your browser settings.');
      }
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      // Continue with start anyway, as the browser will request permission
      if (onStart) onStart();
    }
  };

  const handleStop = () => {
    if (onStop) onStop();
  };

  const getConnectionStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'connecting': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Live Audio Input</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getConnectionStatusColor()}`}>
          {connectionStatus === 'connected' ? 'Connected' :
           connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
        </div>
      </div>

      <div className="text-center">
        <div className="relative inline-block mb-6">
          <button
            onClick={isRecording ? handleStop : handleStart}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-all duration-200 hover:scale-105 ${
              isRecording
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
            }`}
          >
            {isRecording ? (
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500"></div>
              </div>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </button>

          {isRecording && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-ping">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-lg font-medium text-gray-900">
            {isRecording ? 'Recording in Progress' : 'Ready to Record'}
          </p>
          <p className="text-gray-500 mt-1">
            {isRecording
              ? 'Click the button to stop recording'
              : 'Click the button to start recording'}
          </p>
        </div>

        {!permission && !isRecording && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-700 text-sm">Microphone access not granted</span>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-red-600 font-medium">LIVE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;