import { useState, useRef, useEffect } from 'react';

const useAudioRecorder = (webSocketService) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState(new Array(100).fill(0)); // Mock data for visualization
  const [permission, setPermission] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recordingStoppedRef = useRef(false);

  // Function to visualize audio levels
  const visualize = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    // Create visualization data based on audio levels
    const newData = Array.from(dataArrayRef.current).slice(0, 100).map(value => (value / 128) - 1);
    setAudioData(newData);

    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(visualize);
    }
  };

  const startRecording = async () => {
    try {
      // Reset the recording stopped flag
      recordingStoppedRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission(true);

      // Create audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

      // Handle potential suspended state of the AudioContext
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      source.connect(analyserRef.current);

      // Start visualization
      visualize();

      // Set up MediaRecorder to capture audio in chunks
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=pcm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && !recordingStoppedRef.current) { // Use ref instead of state
          console.log('Audio chunk received, size:', event.data.size);

          // Send the audio data directly to WebSocket as soon as it's available
          if (webSocketService && webSocketService.ws && webSocketService.ws.readyState === WebSocket.OPEN) {
            const reader = new FileReader();
            reader.onload = () => {
              console.log('Sending audio data to WebSocket, size:', reader.result.byteLength);
              webSocketService.ws.send(reader.result);
            };
            reader.onerror = (error) => {
              console.error('Error reading audio blob:', error);
            };
            reader.readAsArrayBuffer(event.data);
          } else {
            console.warn('WebSocket is not open, cannot send audio data');
          }
        }
      };

      mediaRecorder.start(1000); // Collect data every 1 second
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setPermission(false);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      // Set the flag to prevent further audio processing
      recordingStoppedRef.current = true;

      // Stop all tracks of the stream immediately
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => {
          track.stop();
        });
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      setIsRecording(false);
    }
  };

  const getAudioBlob = () => {
    if (audioChunksRef.current.length > 0) {
      return new Blob(audioChunksRef.current, { type: 'audio/webm' });
    }
    return null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isRecording,
    audioData,
    permission,
    startRecording,
    stopRecording,
    getAudioBlob
  };
};

export default useAudioRecorder;