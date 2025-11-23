import React, { useEffect, useRef, useState, useCallback } from 'react';

const WaveformVisualizer = ({ audioData, isRecording }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 100 });
  
  // Store the current audio data in a ref to avoid closure issues
  const audioDataRef = useRef(audioData);
  useEffect(() => {
    audioDataRef.current = audioData;
  }, [audioData]);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvasSize.width;
    const height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const currentAudioData = audioDataRef.current;
    if (!currentAudioData || currentAudioData.length === 0) {
      // Draw a flat line when no audio data
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isRecording ? '#3B82F6' : '#93C5FD';
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    // Draw waveform
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = isRecording ? '#3B82F6' : '#93C5FD';
    ctx.moveTo(0, height / 2);

    const sliceWidth = width / currentAudioData.length;
    for (let i = 0; i < currentAudioData.length; i++) {
      const v = currentAudioData[i] * (height / 2);
      const x = i * sliceWidth;
      ctx.lineTo(x, height / 2 + v);
    }

    ctx.stroke();
    
    // Continue animation if recording
    if (isRecording) {
      animationRef.current = requestAnimationFrame(drawWaveform);
    }
  }, [canvasSize, isRecording]);

  useEffect(() => {
    if (isRecording) {
      // Start animation loop when recording starts
      animationRef.current = requestAnimationFrame(drawWaveform);
    } else {
      // Cancel animation when not recording
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Redraw one more time to clear the waveform when stopped
      drawWaveform();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, drawWaveform]);

  // Handle canvas resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setCanvasSize({
          width: container.clientWidth || 800,
          height: 100
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full bg-gray-100 rounded"
      />
    </div>
  );
};

export default WaveformVisualizer;