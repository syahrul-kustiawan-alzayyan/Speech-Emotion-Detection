/**
 * Format utilities for the emotion detection application
 */

// Function to format duration in seconds to MM:SS
export const formatDuration = (seconds) => {
  const mins = Math.floor(Math.abs(seconds / 60));
  const secs = Math.floor(Math.abs(seconds % 60));
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Function to format confidence as percentage
export const formatConfidence = (confidence) => {
  return `${(confidence * 100).toFixed(1)}%`;
};

// Function to capitalize first letter of a string
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Function to format prediction results for display
export const formatPredictionResult = (result) => {
  if (!result) return null;
  
  return {
    label: capitalize(result.label || 'Unknown'),
    confidence: result.confidence || 0,
    class_probs: result.class_probs || {}
  };
};

// Function to get emotion color based on label
export const getEmotionColor = (emotion) => {
  const colors = {
    happy: 'bg-yellow-100 text-yellow-800',
    sad: 'bg-blue-100 text-blue-800',
    angry: 'bg-red-100 text-red-800',
    fear: 'bg-purple-100 text-purple-800',
    surprise: 'bg-pink-100 text-pink-800',
    neutral: 'bg-gray-100 text-gray-800',
  };
  
  return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Function to get emotion icon based on label
export const getEmotionIcon = (emotion) => {
  const icons = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fear: '😨',
    surprise: '😲',
    neutral: '😐',
  };
  
  return icons[emotion.toLowerCase()] || '🤔';
};