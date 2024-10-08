import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNotification } from './NotificationContext'; // Import the notification context
import { useWebSocket } from '../WebSocketContext.js';
const EventManagement = () => {
  const [data, setData] = useState({});
  const { socket, sendMessage } = useWebSocket();
  const hasSentMessage = useRef(false); // Use a ref to track if the message has been sent

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received from server:', message);
        
        if (message.hasOwnProperty('events')) {
          setData(message.events);
        }
      };

      socket.onmessage = handleMessage;

      // Only send message if it's not already sent
      if (!hasSentMessage.current) {
        sendMessage({ page_loc: 'VolunteerManagement' });
        hasSentMessage.current = true; // Prevent sending it again
      }

      return () => {
        socket.onmessage = null; // Cleanup on unmount
      };
    }
  }, [socket, sendMessage]);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [location, setLocation] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState('');
  const [eventDate, setEventDate] = useState(null);

  const { addNotification } = useNotification(); // Destructure the addNotification function

  const skillsOptions = [
    { value: 'leadership', label: 'Leadership' },
    { value: 'organization', label: 'Organization' },
    { value: 'communication', label: 'Communication' },
    // Add more skill options as necessary
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Trigger a notification for a new event assignment
    addNotification(`New event "${eventName}" has been assigned!`, 'info');

    // Handle form submission logic
    console.log({
      eventName,
      eventDescription,
      location,
      requiredSkills,
      urgency,
      eventDate,
    });

    // Optionally reset form fields after submission
    setEventName('');
    setEventDescription('');
    setLocation('');
    setRequiredSkills([]);
    setUrgency('');
    setEventDate(null);
  };

  // Function to handle sending a reminder
  const handleReminder = () => {
    // Check if the event date exists
    if (!eventDate) {
      addNotification('Please select an event date before sending a reminder.', 'error');
    } else {
      // Trigger a notification for the reminder
      addNotification('Reminder: You have an event tomorrow!', 'info');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Event Management</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            maxLength="100"
            required
            style={styles.input}
          />
          <textarea
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
            style={styles.textarea}
          />
          <textarea
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={styles.textarea}
          />
          <Select
            isMulti
            options={skillsOptions}
            onChange={(selectedOptions) =>
              setRequiredSkills(selectedOptions.map((option) => option.value))
            }
            placeholder="Required Skills"
            required
            styles={customSelectStyles}
          />
          <Select
            options={urgencyOptions}
            onChange={(selectedOption) => setUrgency(selectedOption.value)}
            placeholder="Urgency"
            required
            styles={customSelectStyles}
          />
          <DatePicker
            selected={eventDate}
            onChange={(date) => setEventDate(date)}
            placeholderText="Event Date"
            required
            style={styles.datepicker}
            className="custom-datepicker"
          />
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>

        {/* Example buttons to trigger notifications for other actions */}
        <button onClick={handleReminder} style={styles.reminderButton}>
          Send Event Reminder
        </button>
      </div>
    </div>
  );
};

// Styling for a cleaner, sleeker design
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: 'calc(100vw - 25vh)', // Adjust width to account for the sidebar
    marginLeft: '25vh', // Ensure the form is pushed to the right of the sidebar
    backgroundColor: '#f4f7f6',
    padding: '20px',
    boxSizing: 'border-box',
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
    height: '60vh',
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
    width: '100%', // Matches the width of the input fields
    fontSize: '16px',
    color: '#333',
    boxSizing: 'border-box', // Ensures consistent box model for sizing
    height: '100px', // Specific height for text areas to differentiate from inputs
  },
  datepicker: {
    marginBottom: '130px',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    color: '#333',
    width: '100%',
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
  reminderButton: {
    marginTop: '20px',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    textAlign: 'center',
    transition: 'background-color 0.3s',
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

export default EventManagement;
