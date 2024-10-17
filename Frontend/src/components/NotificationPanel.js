import React,{ useEffect, useState, useRef } from 'react';
import { useNotification } from './NotificationContext'; // Import the notification context

const NotificationPanel = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div style={styles.panelContainer}>
      {notifications.map((notification) => (
        <div key={notification.id} style={styles.notification(notification.type)}>
          <span>{notification.message}</span>
          <button onClick={() => removeNotification(notification.id)} style={styles.closeButton}>X</button>
        </div>
      ))}
    </div>
  );
};

// Styles for the notification panel
const styles = {
  panelContainer: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '300px',
    zIndex: '1000',
  },
  notification: (type) => ({
    backgroundColor: type === 'error' ? '#ff3860' : '#23d160', // Green for normal, red for error
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default NotificationPanel;
