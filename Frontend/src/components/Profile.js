import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css'; // Custom styles for datepicker
import { useWebSocket } from '../WebSocketContext.js';

const Profile = () => {
  const [data, setData] = useState({});
  const { socket, sendMessage } = useWebSocket();
  const hasSentMessage = useRef(false); // Use a ref to track if the message has been sent

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received from server:', message);
        
        if (message.hasOwnProperty('events')) {
          setData(message);
        }
      };

      socket.onmessage = handleMessage;

      // Only send message if it's not already sent
      if (!hasSentMessage.current) {
        sendMessage({ page_loc: 'VolunteeProfile' });
        hasSentMessage.current = true; // Prevent sending it again
      }

      return () => {
        socket.onmessage = null; // Cleanup on unmount
      };
    }
  }, [socket, sendMessage]);

  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState('');
  const [availability, setAvailability] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!fullName || !address1 || !city || !state || !zipCode || skills.length === 0 || !availability) {
      alert('Please fill out all required fields!');
    } else {
      setSubmitted(true);
    }
  };

  const statesOptions = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    // Add more states as needed
  ];

  const skillsOptions = [
    { value: 'coding', label: 'Coding' },
    { value: 'design', label: 'Design' },
    // Add more skills as needed
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
            <button type="button" onClick={handleSubmit} style={styles.submitButton}>Submit</button>
          </>
        ) : (
          <div style={styles.thankYouMessage}>
            <h3>Thank you for completing your profile!</h3>
            <p>Your profile has been submitted successfully.</p>
            <button type="button" onClick={() => setSubmitted(false)} style={styles.submitButton}>Edit Profile</button>
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
