// src/context/WebSocketContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext(null);
export const WebSocketProvider = ({ children }) => {
  const socket = useRef(null);
  const socketUrl = 'ws://localhost:8000/';
  const [data, setData] = useState([]); // Initialize as empty array  
  useEffect(() => {
    socket.current = new WebSocket(socketUrl);

    socket.current.onopen = () => {
      console.log('WebSocket connection opened');
      const message = { page_loc: 'socketinit'};
      socket.current.send(JSON.stringify(message));
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message received from server:', message);
      if (message.hasOwnProperty('events')) { // Check if the message contains 'events'
        setData(message.events);
      }
      else
      {
        setData(message);
      }
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket: socket.current, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};