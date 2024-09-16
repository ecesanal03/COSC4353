// Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';  // or any other main content component

const Layout = () => {
  return (
    <div style={styles.layoutContainer}>
      <Sidebar />
      <div style={styles.contentContainer}>
        <Profile />  {/* This could be any main content you want */}
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
