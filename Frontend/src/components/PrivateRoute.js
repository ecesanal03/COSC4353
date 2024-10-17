import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('userEmail'); // Check if the user is logged in (i.e., has an email in localStorage)

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the login page
    return <Navigate to="/" state={{ message: 'Please log in to access this page.' }} />;
  }

  return children; // If authenticated, allow access to the protected route
};

export default PrivateRoute;