import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WebSocketProvider } from './WebSocketContext.js';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import EventManagement from './components/EventManagement';
import VolunteerMatching from './components/VolunteerMatching';
import VolunteerHistory from './components/VolunteerHistory';
import Layout from './components/Layout';
import { NotificationProvider } from './components/NotificationContext';
import NotificationPanel from './components/NotificationPanel';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component


function App() {
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  const handleRSVP = (eventData) => {
    setVolunteerHistory((prevHistory) => [...prevHistory, eventData]);
  };

  return (
    <WebSocketProvider>
      <NotificationProvider>
        <Router>
          <NotificationPanel />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/event-management"
              element={
                <PrivateRoute>
                  <Layout>
                    <EventManagement />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/volunteer-matching"
              element={
                <PrivateRoute>
                  <Layout>
                    <VolunteerMatching onRSVP={handleRSVP} />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/volunteer-history"
              element={
                <PrivateRoute>
                  <Layout>
                    <VolunteerHistory history={volunteerHistory} />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </WebSocketProvider>
  );
}

export default App;