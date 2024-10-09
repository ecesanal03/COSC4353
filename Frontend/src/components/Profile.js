import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css'; // Custom styles for datepicker
import { useWebSocket } from '../WebSocketContext.js';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const { socket, sendMessage } = useWebSocket();
  const location = useLocation();
  const existingProfile = location.state?.profile || JSON.parse(localStorage.getItem('userProfile')) || {};
  const email = localStorage.getItem('userEmail');  // Get the logged-in user's email from localStorage

  const [fullName, setFullName] = useState(existingProfile.fullName || '');
  const [address1, setAddress1] = useState(existingProfile.address1 || '');
  const [address2, setAddress2] = useState(existingProfile.address2 || '');
  const [city, setCity] = useState(existingProfile.city || '');
  const [state, setState] = useState(existingProfile.state || '');
  const [zipCode, setZipCode] = useState(existingProfile.zipCode || '');
  const [skills, setSkills] = useState(existingProfile.skills || []);
  const [preferences, setPreferences] = useState(existingProfile.preferences || '');
  const [availability, setAvailability] = useState(existingProfile.availability || null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received from server:', message);

        if (message.hasOwnProperty('status')) {
          if (message.status === 'success') {
            alert('Profile saved successfully!');
            // Update profile in localStorage after successful submission
            localStorage.setItem('userProfile', JSON.stringify({
              fullName,
              address1,
              address2,
              city,
              state,
              zipCode,
              skills,
              preferences,
              availability
            }));
          } else {
            alert(message.message);
          }
        }
      };

      socket.onmessage = handleMessage;

      return () => {
        socket.onmessage = null; 
      };
    }
  }, [socket]);

  const handleSubmit = () => {
    if (!fullName || !address1 || !city || !state || !zipCode || skills.length === 0 || !availability) {
      alert('Please fill out all required fields!');
    } else {
      const formattedAvailability = availability.toISOString(); // Format the date properly

      const profileData = {
        page_loc: 'VolunteerProfile',
        fullName,
        address1,
        address2,
        city,
        state,
        zipCode,
        skills,
        preferences,
        availability: formattedAvailability,
        email  // Replace with actual user email if available
      };

      sendMessage(profileData);
      setSubmitted(true);
    }
  };

  const statesOptions = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];

  const skillsOptions = [
    { value: 'coding', label: 'Coding' },
    { value: 'design', label: 'Design' },
    { value: 'project_management', label: 'Project Management' },
    { value: 'writing', label: 'Writing' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'public_speaking', label: 'Public Speaking' },
    { value: 'event_planning', label: 'Event Planning' },
    { value: 'data_analysis', label: 'Data Analysis' },
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'volunteer_management', label: 'Volunteer Management' },
    { value: 'customer_service', label: 'Customer Service' },
    { value: 'sales', label: 'Sales' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'graphic_design', label: 'Graphic Design' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'photography', label: 'Photography' },
    { value: 'videography', label: 'Videography' },
    { value: 'seo', label: 'SEO' },
    { value: 'business_analysis', label: 'Business Analysis' },
    { value: 'accounting', label: 'Accounting' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'legal', label: 'Legal' }
  ];

  return (
    <div style={styles.pageContainer}>
      <form style={styles.formContainer}>
        <h2 style={styles.heading}>Complete Your Profile</h2>
        {!submitted ? (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength="50"
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Address 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              maxLength="100"
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Address 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              maxLength="100"
              style={styles.input}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength="100"
              required
              style={styles.input}
            />
            <Select
              options={statesOptions}
              onChange={(selectedOption) => setState(selectedOption.value)}
              placeholder="Select State"
              required
              styles={customSelectStyles}
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength="9"
              required
              style={styles.input}
            />
            <Select
              isMulti
              options={skillsOptions}
              onChange={(selectedOptions) => setSkills(selectedOptions.map(option => option.value))}
              placeholder="Select Skills"
              required
              styles={customSelectStyles}
            />
            <textarea
              placeholder="Preferences (optional)"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              style={styles.textarea}
            />
            <DatePicker
              selected={availability}
              onChange={(date) => setAvailability(date)}
              placeholderText="Select availability dates"
              required
              className="custom-datepicker"
            />
            <button type="button" onClick={handleSubmit} style={styles.submitButton} disabled={submitted}>
              {submitted ? 'Profile Submitted' : 'Submit'}
            </button>
          </>
        ) : (
          <div style={styles.thankYouMessage}>
            <h3>Thank you for completing your profile!</h3>
            <p>Your profile has been submitted successfully.</p>
            <button type="button" onClick={() => setSubmitted(false)} style={styles.submitButton}>
              Edit Profile
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

// Styling for a cleaner, sleeker design
const styles = {
  pageContainer: {
    display: 'flex',
    marginLeft: '25vh',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '74vw',
    backgroundColor: '#f4f7f6',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
    width: '80%',
    height: '90vh',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    fontSize: '16px',
    color: '#333',
    boxSizing: 'border-box',
  },
  textarea: {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    height: '100px',
    fontSize: '16px',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#3A7CA5',
    color: '#fff',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    textAlign: 'center',
    transition: 'background-color 0.3s',
  },
  thankYouMessage: {
    textAlign: 'center',
  },
};

const customSelectStyles = {
  control: (base) => ({
    ...base,
    marginBottom: '20px',
    padding: '5px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    color: '#333',
    width: '100%',
  }),
};

export default Profile;
