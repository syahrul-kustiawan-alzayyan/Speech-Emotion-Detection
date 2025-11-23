const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export class WebSocketService {
  constructor() {
    this.ws = null;
    this.onMessageCallback = null;
    this.onOpenCallback = null;
    this.onCloseCallback = null;
    this.onErrorCallback = null;
  }

  connect(clientId) {
    const wsUrl = `${WS_BASE_URL}/ws/realtime/${clientId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = (event) => {
      console.log('WebSocket connected');
      if (this.onOpenCallback) this.onOpenCallback(event);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) this.onMessageCallback(data);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected');
      if (this.onCloseCallback) this.onCloseCallback(event);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (this.onErrorCallback) this.onErrorCallback(error);
    };
  }

  sendMessage(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  onOpen(callback) {
    this.onOpenCallback = callback;
  }

  onClose(callback) {
    this.onCloseCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }
}