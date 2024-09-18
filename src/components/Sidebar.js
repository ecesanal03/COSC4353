// Sidebar.js
import React from 'react';
import { FaCalendarAlt, FaUsers, FaHistory, FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Clear session or auth data if needed (e.g., localStorage.clear())
      localStorage.removeItem('authToken'); // Example: removing a token
  
      // Redirect to the login page
      navigate('/');
    };
  
    return (
      <div style={styles.sidebarContainer}>
        <h2 style={styles.logo}>Volunteer Management</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <FaHome style={styles.icon} />
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          </li>
          <li style={styles.navItem}>
            <FaUser style={styles.icon} />
            <Link to="/profile" style={styles.navLink}>Profile</Link>
          </li>
          <li style={styles.navItem}>
            <FaCalendarAlt style={styles.icon} />
            <Link to="/event-management" style={styles.navLink}>Event Management</Link>
          </li>
          <li style={styles.navItem}>
            <FaUsers style={styles.icon} />
            <Link to="/volunteer-matching" style={styles.navLink}>Volunteer Matching</Link>
          </li>
          <li style={styles.navItem}>
            <FaHistory style={styles.icon} />
            <Link to="/volunteer-history" style={styles.navLink}>Volunteer History</Link>
          </li>
          <li style={styles.navItem} onClick={handleLogout}>
            <FaSignOutAlt style={styles.icon} />
            <span style={styles.navLink}>Logout</span>
          </li>
        </ul>
      </div>
    );
  };

const styles = {
  sidebarContainer: {
    backgroundColor: '#3A7CA5',
    color: '#fff',
    height: '100vh',
    width: '250px',
    padding: '20px',
    boxSizing: 'border-box',
  },
  logo: {
    fontSize: '24px',
    marginBottom: '40px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  navItem: {
    padding: '15px 0',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  icon: {
    marginRight: '10px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    flexGrow: 1,
  },
  navItemHover: {
    backgroundColor: '#2a5a7b',
  },
};

export default Sidebar;

