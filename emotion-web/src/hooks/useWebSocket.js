import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected'
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [url]);

  const sendMessage = (data) => {
    if (wsRef.current && connectionStatus === 'connected') {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  return {
    connectionStatus,
    messages,
    sendMessage,
    reconnect
  };
};

export default useWebSocket;