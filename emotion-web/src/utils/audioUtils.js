/**
 * Audio utilities for the emotion detection application
 */

// Function to convert audio buffer to WAV format
export const audioBufferToWav = (buffer, sampleRate) => {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const wavBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(wavBuffer);

  // Write WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);

  // Write audio data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, buffer.getChannelData(0)[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  return wavBuffer;
};

// Function to normalize audio data
export const normalizeAudio = (audioData) => {
  const maxVal = Math.max(...audioData.map(Math.abs));
  if (maxVal === 0) return audioData;
  
  return audioData.map(val => val / maxVal);
};

// Function to get audio context for processing
export const getAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

// Function to extract features from audio (simplified for client-side visualization)
export const extractAudioFeatures = (audioData) => {
  // Calculate simple features for visualization
  const rms = Math.sqrt(audioData.reduce((sum, val) => sum + val * val, 0) / audioData.length);
  const maxAmplitude = Math.max(...audioData.map(Math.abs));
  
  return {
    rms: rms,
    maxAmplitude: maxAmplitude,
    averageAmplitude: audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length
  };
};