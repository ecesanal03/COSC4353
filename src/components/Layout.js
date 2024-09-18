// Layout.js
import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => { // Accept children as a prop
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
  },
  contentContainer: {
    flexGrow: 1,  // The content will take up the remaining space
    padding: '20px',
    backgroundColor: '#f4f7f6',
  },
};

export default Layout;
