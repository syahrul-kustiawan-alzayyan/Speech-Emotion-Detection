import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ResultCard from '../components/ResultCard';
import WaveformVisualizer from '../components/WaveformVisualizer';
import useFileUpload from '../hooks/useFileUpload';
import { formatPredictionResult } from '../utils/formatUtils';
import { predictFromFile } from '../services/api';

const FileDetection = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Using the custom hook for file upload
  const {
    selectedFile,
    uploadProgress,
    selectFile,
    uploadFile,
    reset
  } = useFileUpload();
  
  // Mock waveform data for visualization
  const [waveformData, setWaveformData] = useState([]);

  // Generate mock waveform data when a file is selected
  React.useEffect(() => {
    if (selectedFile) {
      // Generate mock waveform data
      const mockData = Array.from({ length: 200 }, () => (Math.random() - 0.5));
      setWaveformData(mockData);
    }
  }, [selectedFile]);

  const handleFileSelect = (file) => {
    selectFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    try {
      const result = await predictFromFile(selectedFile);
      setPredictionResult(result);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      // Set a default error result
      setPredictionResult({
        label: "error",
        confidence: 0,
        class_probs: { error: 1.0 }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    reset();
    setPredictionResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">File-based Emotion Detection</h1>
        <p className="text-gray-600 mb-8">
          Upload an audio file to analyze the emotions within it
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <FileUploader 
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
            
            {selectedFile && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Audio Preview</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>File:</span>
                    <span className="truncate max-w-[160px]">{selectedFile.name}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Size:</span>
                    <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
                
                <WaveformVisualizer 
                  audioData={waveformData} 
                  isRecording={false} 
                />
                
                <div className="mt-4 flex space-x-3">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
                  </button>
                  
                  <button 
                    onClick={handleReset}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <ResultCard result={predictionResult} />
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">How File Detection Works</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Upload an audio file (WAV, MP3) using the upload area</li>
                <li>Click "Analyze Emotion" to process the file</li>
                <li>The audio is sent to our server for emotion analysis</li>
                <li>Our AI model processes the entire file and returns the results</li>
                <li>Results include the primary emotion detected and confidence levels</li>
              </ul>
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> For best results, use high-quality audio files with clear speech. 
                  Files should be no longer than 10 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetection;