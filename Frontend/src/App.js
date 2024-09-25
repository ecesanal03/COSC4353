import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import EventManagement from './components/EventManagement'; // New page for Event Management
import VolunteerMatching from './components/VolunteerMatching'; // New page for Volunteer Matching
import VolunteerHistory from './components/VolunteerHistory'; // New page for Volunteer History
import Layout from './components/Layout'; // The Layout with the Sidebar

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout (like Login and Signup) */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routes that need Layout with Sidebar */}
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />  {/* Profile content inside Layout */}
            </Layout>
          }
        />
        <Route
          path="/event-management"
          element={
            <Layout>
              <EventManagement />  {/* Event Management content inside Layout */}
            </Layout>
          }
        />
        <Route
          path="/volunteer-matching"
          element={
            <Layout>
              <VolunteerMatching />  {/* Volunteer Matching content inside Layout */}
            </Layout>
          }
        />
        <Route
          path="/volunteer-history"
          element={
            <Layout>
              <VolunteerHistory />  {/* Volunteer History content inside Layout */}
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;