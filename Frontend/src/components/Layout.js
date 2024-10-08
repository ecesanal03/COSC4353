// Layout.js
import React,{ useEffect, useState, useRef } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => { // Accept children as a prop
  
  //TESTING, this could be use for 1 socket through the entire application but need more work
  // const socketUrl = 'ws://localhost:8000/';
  // const socket = useRef(null);
  // useEffect(() => {
  //   socket.current = new WebSocket(socketUrl);

  //   socket.current.onopen = () => {
  //     console.log('WebSocket connection opened');
  //   };

  //   socket.current.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     console.log('Message received from server:', message);
  //   };

  //   socket.current.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   socket.current.onclose = () => {
  //     console.log('WebSocket connection closed');
  //   };
  //   return () => {
  //     if (socket.current) {
  //       socket.current.close();
  //     }
  //   };
  // }, []);
  return (
    <div style={styles.layoutContainer}>
      <Sidebar />
      <div style={styles.contentContainer}>
        {children}  {/* Render the dynamic content here */}
      </div>
    </div>
  );
};

const styles = {
  layoutContainer: {
    display: 'flex',
    height: '100vh',  // Ensures the layout takes up the full viewport height
    width: '100vw',   // Full width of the viewport
    overflowX:'hidden',
  },
  contentContainer: {
    flexGrow: 1,  // The content will take up the remaining space
    padding: '0px',
    backgroundColor: '#f4f7f6',
  },
};

export default Layout;
