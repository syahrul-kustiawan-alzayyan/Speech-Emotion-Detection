import React, { useState } from 'react';
import { predictFromFile } from '../services/api';

const FileUploader = ({ onFileSelect, onAnalyze }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || file.name.endsWith('.wav') || file.name.endsWith('.mp3')) {
        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
      } else {
        alert('Please upload an audio file (WAV/MP3)');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/') || file.name.endsWith('.wav') || file.name.endsWith('.mp3')) {
        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
      } else {
        alert('Please upload an audio file (WAV/MP3)');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const result = await predictFromFile(selectedFile);
      if (onAnalyze) await onAnalyze(result);
    } catch (error) {
      console.error('Error analyzing file:', error);
      alert('Error analyzing the audio file. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onButtonClick = () => {
    document.getElementById("file-upload").click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Audio File</h3>
      
      <form 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          id="file-upload"
          type="file" 
          className="hidden" 
          accept="audio/*, .wav, .mp3"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center">
          <svg 
            className="w-12 h-12 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          
          <p className="text-gray-600 mb-2">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            WAV, MP3 (Max 10MB)
          </p>
        </div>
        
        <button
          type="button"
          onClick={onButtonClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Browse Files
        </button>
        
        {selectedFile && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-left">
            <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}
      </form>
      
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className={`px-6 py-2 rounded font-semibold ${
            selectedFile
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } transition`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Emotion'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;