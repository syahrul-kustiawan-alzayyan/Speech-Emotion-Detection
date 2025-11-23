import React from 'react';

const ResultCard = ({ result }) => {
  const getEmotionColor = (emotion) => {
    if (!emotion) return 'from-gray-400 to-gray-500';

    const colors = {
      happy: 'from-yellow-400 to-yellow-500',
      sad: 'from-indigo-400 to-indigo-500',
      angry: 'from-red-400 to-red-500',
      fear: 'from-purple-400 to-purple-500',
      surprise: 'from-pink-400 to-pink-500',
      neutral: 'from-gray-400 to-gray-500',
    };

    return colors[emotion.toLowerCase()] || 'from-gray-400 to-gray-500';
  };

  const getEmotionEmoji = (emotion) => {
    if (!emotion) return '🤔';

    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fear: '😨',
      surprise: '😲',
      neutral: '😐',
    };

    return emojis[emotion.toLowerCase()] || '🤔';
  };

  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">Waiting for audio analysis...</p>
          <p className="text-gray-400 text-sm mt-2">Start recording or upload a file to see results</p>
        </div>
      </div>
    );
  }

  const { label, confidence, class_probs } = result || {};

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
        <div className={`w-14 h-14 bg-gradient-to-r ${getEmotionColor(label)} rounded-full flex items-center justify-center`}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-medium text-gray-700">Detected Emotion:</span>
          <span className="text-3xl font-bold capitalize">{label || 'Analyzing...'}</span>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                Confidence Level
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {confidence ? (confidence * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-indigo-200">
            <div
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${(confidence ? confidence * 100 : 0).toFixed(1)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {class_probs && (
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h4>
          <div className="space-y-4">
            {Object.entries(class_probs)
              .sort((a, b) => (b[1] || 0) - (a[1] || 0)) // Sort by probability, highest first
              .map(([emotion, prob]) => (
                <div key={emotion} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getEmotionColor(emotion)} flex items-center justify-center mr-3`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="capitalize font-medium text-gray-700">{emotion}</span>
                      <span className="text-sm font-medium text-gray-900">{(prob ? (prob * 100).toFixed(1) : '0.0')}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full bg-gradient-to-r ${getEmotionColor(emotion)}`}
                        style={{ width: `${(prob ? (prob * 100).toFixed(1) : '0.0')}%` }}
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