import React from 'react';

const ResultCard = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Prediction Result</h3>
        <p className="text-gray-500">No prediction available yet</p>
      </div>
    );
  }

  const { label, confidence, class_probs } = result;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Prediction Result</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Detected Emotion:</span>
          <span className="text-2xl font-bold capitalize text-blue-600">{label}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full" 
            style={{ width: `${(confidence * 100).toFixed(1)}%` }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-600 mt-1">
          {(confidence * 100).toFixed(1)}% confidence
        </div>
      </div>

      {class_probs && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Class Probabilities:</h4>
          <div className="space-y-2">
            {Object.entries(class_probs).map(([emotion, prob]) => (
              <div key={emotion} className="flex items-center justify-between">
                <span className="capitalize">{emotion}:</span>
                <div className="flex items-center">
                  <span className="w-16 text-right mr-2">{(prob * 100).toFixed(1)}%</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${(prob * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;