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
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/event-management"
              element={
                <Layout>
                  <EventManagement />
                </Layout>
              }
            />
            <Route
              path="/volunteer-matching"
              element={
                <Layout>
                  <VolunteerMatching onRSVP={handleRSVP} />
                </Layout>
              }
            />
            <Route
              path="/volunteer-history"
              element={
                <Layout>
                  <VolunteerHistory history={volunteerHistory} />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </WebSocketProvider>
  );
}

export default App;