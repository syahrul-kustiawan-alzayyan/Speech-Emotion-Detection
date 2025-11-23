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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Audio Recorder</h3>
      
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        <span className="text-sm">
          {connectionStatus === 'connected' ? 'Connected to server' : 
           connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
        </span>
      </div>
      
      <div className="flex flex-col items-center">
        <button
          onClick={isRecording ? handleStop : handleStart}
          disabled={!permission && isRecording}
          className={`px-6 py-3 rounded-full text-white font-semibold text-lg ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording ? (
            <span className="flex items-center">
              <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
              Stop Recording
            </span>
          ) : (
            <span className="flex items-center">
              <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
              Start Recording
            </span>
          )}
        </button>
        
        {!permission && !isRecording && (
          <p className="mt-3 text-yellow-600 text-sm">
            Please allow microphone access to start recording
          </p>
        )}
        
        {isRecording && (
          <div className="mt-4 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-red-500">Recording...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;