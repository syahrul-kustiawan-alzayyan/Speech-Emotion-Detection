import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ResultCard from '../components/ResultCard';
import WaveformVisualizer from '../components/WaveformVisualizer';
import useFileUpload from '../hooks/useFileUpload';
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
      console.error('Error analyzing file:', error);
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
    setWaveformData([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Audio File Emotion Analysis</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your audio file to get a comprehensive emotion analysis report
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-8">
            <FileUploader 
              onFileSelect={handleFileSelect}
              onAnalyze={setPredictionResult}
            />
            
            {selectedFile && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Audio Visualization</h3>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Preview</span>
                  </div>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">File:</span> {selectedFile.name}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                  
                  <WaveformVisualizer 
                    audioData={waveformData} 
                    isRecording={false} 
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      isAnalyzing 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Analyze Audio
                      </div>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleReset}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            <ResultCard result={predictionResult} />
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Analysis Process</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">File Upload</h4>
                    <p className="text-gray-600 text-sm">Upload your audio file in supported formats</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-indigo-600 text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">AI Processing</h4>
                    <p className="text-gray-600 text-sm">Advanced neural networks analyze the audio</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-purple-600 text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Results</h4>
                    <p className="text-gray-600 text-sm">Detailed emotion breakdown with confidence scores</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-blue-700 text-sm">
                    For best results, use clear audio files with minimal background noise. 
                    Supported formats include WAV, MP3, M4A, and FLAC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetection;