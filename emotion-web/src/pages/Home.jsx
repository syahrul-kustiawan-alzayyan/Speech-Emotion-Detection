import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { healthCheck } from '../services/api';

const Home = () => {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await healthCheck();
        setBackendStatus('connected');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setBackendStatus('disconnected');
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Emotion Detection System
        </h1>

        <div className="mb-4 flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            backendStatus === 'connected' ? 'bg-green-500' :
            backendStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <span className="text-sm">
            {backendStatus === 'connected' ? 'Connected to backend server' :
             backendStatus === 'disconnected' ? 'Backend server unavailable' : 'Checking connection...'}
          </span>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Analyze emotions in real-time through your microphone or upload audio files for emotion detection.
          Our AI-powered system detects emotions in women's voices with high accuracy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/realtime"
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">🎤</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Real-time Detection</h2>
            <p className="text-gray-600 mb-4">
              Use your microphone to detect emotions in real-time as you speak
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition">
              Start Recording
            </button>
          </Link>

          <Link
            to="/upload"
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">📁</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload File</h2>
            <p className="text-gray-600 mb-4">
              Upload an audio file to analyze the emotions within it
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition">
              Upload File
            </button>
          </Link>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-500 text-2xl font-bold mb-2">1</div>
              <h3 className="font-medium text-gray-800 mb-2">Record or Upload</h3>
              <p className="text-gray-600 text-sm">
                Either use your microphone for live analysis or upload an audio file
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-500 text-2xl font-bold mb-2">2</div>
              <h3 className="font-medium text-gray-800 mb-2">AI Processing</h3>
              <p className="text-gray-600 text-sm">
                Our machine learning model analyzes your voice to detect emotions
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-blue-500 text-2xl font-bold mb-2">3</div>
              <h3 className="font-medium text-gray-800 mb-2">Get Results</h3>
              <p className="text-gray-600 text-sm">
                Receive detailed emotion analysis with confidence levels
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Supported Emotions</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Happy', 'Sad', 'Angry', 'Fear', 'Surprise', 'Neutral'].map(emotion => (
              <div
                key={emotion}
                className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200"
              >
                {emotion}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;