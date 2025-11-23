// Audio processing utilities for converting microphone data for transmission

export const convertAudioChunkForTransmission = (audioChunk) => {
  // In a real implementation, you would convert the audio blob to the format
  // expected by your backend. This is a simplified version.
  
  // Currently, we'll return the blob as-is, but in practice you may need to:
  // - Convert to a specific format (WAV, raw PCM, etc.)
  // - Apply compression
  // - Convert sample rates
  
  return audioChunk;
};

// Function to convert audio buffer to raw PCM data
export const audioBufferToRawData = (audioBuffer) => {
  // Get the raw audio data from the buffer
  const channelData = audioBuffer.getChannelData(0); // Get data from first channel
  const length = Math.min(4096, channelData.length); // Limit size for transmission
  const rawData = new Float32Array(length);
  
  for (let i = 0; i < length; i++) {
    rawData[i] = channelData[i];
  }
  
  return rawData;
};