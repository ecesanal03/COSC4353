import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import EventManagement from './components/EventManagement';
import VolunteerMatching from './components/VolunteerMatching';
import VolunteerHistory from './components/VolunteerHistory';
import Layout from './components/Layout';
import { NotificationProvider } from './components/NotificationContext';  // Import the Notification Provider
import NotificationPanel from './components/NotificationPanel'; // Notification UI

function App() {
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  // Function to handle RSVP and update volunteer history
  const handleRSVP = (eventData) => {
    setVolunteerHistory((prevHistory) => [...prevHistory, eventData]);
  };
  

  return (
    <NotificationProvider>  {/* Wrap the entire app in the NotificationProvider */}
      <Router>
      <NotificationPanel /> {/* Always show the notification panel */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes that need Layout with Sidebar */}
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
  );
}

export default App;