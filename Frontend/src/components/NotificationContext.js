import React, {  useEffect, useRef ,createContext, useContext, useState } from 'react';
// Create Notification Context
const NotificationContext = createContext();

// Use this hook in components to access the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a new notification
  const addNotification = (message, type = 'info') => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), message, type },
    ]);
  };

  // Function to remove a notification after it's dismissed
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
