import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNotification } from './NotificationContext'; 
import { useWebSocket } from '../WebSocketContext.js';


const EventManagement = () => {
  const [data, setData] = useState({});
  const { socket, sendMessage } = useWebSocket();
  const hasSentMessage = useRef(false); 
  const navigate = useNavigate();

  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [location, setLocation] = useState(''); 
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState('');
  const [eventDate, setEventDate] = useState(null);

  
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  const { addNotification } = useNotification(); // Destructure the addNotification function

  useEffect(() => {
    if (userRole !== 'admin') {
      addNotification('Access denied. Only administrators can access this page.', 'error');
      navigate('/profile'); // Redirect to home page or another appropriate page
    }
  }, [userRole, navigate, addNotification]);

  const skillsOptions = [
    { value: 'leadership', label: 'Leadership' },
    { value: 'organization', label: 'Organization' },
    { value: 'communication', label: 'Communication' },
    { value: 'teaching', label: 'Teaching' },
    { value: 'first_aid', label: 'First Aid' },
    { value: 'event_planning', label: 'Event Planning' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'graphic_design', label: 'Graphic Design' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'social_media', label: 'Social Media Management' },
    { value: 'public_speaking', label: 'Public Speaking' },
    { value: 'data_entry', label: 'Data Entry' },
    { value: 'customer_service', label: 'Customer Service' },
    { value: 'translation', label: 'Translation' },
    { value: 'photography', label: 'Photography' },
    { value: 'videography', label: 'Videography' },
    { value: 'writing', label: 'Writing' },
    { value: 'editing', label: 'Editing' },
    { value: 'project_management', label: 'Project Management' },
    { value: 'conflict_resolution', label: 'Conflict Resolution' },
    { value: 'research', label: 'Research' },
    { value: 'mentoring', label: 'Mentoring' },
    { value: 'counseling', label: 'Counseling' },
    { value: 'budget_management', label: 'Budget Management' },
    { value: 'coaching', label: 'Coaching' },
    { value: 'technical_support', label: 'Technical Support' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'sales', label: 'Sales' },
    { value: 'accounting', label: 'Accounting' },
    { value: 'administration', label: 'Administration' },
    { value: 'graphic_illustration', label: 'Graphic Illustration' },
    { value: 'public_relations', label: 'Public Relations' },
    { value: 'volunteer_management', label: 'Volunteer Management' },
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!userEmail) {
      addNotification('You need to log in to create an event.', 'error');
      return;
    }

    // Construct the event data to send via WebSocket
    const eventData = {
      page_loc: 'VolunteerManagement',
      action: 'create_event',
      eventName,
      eventDescription,
      location,
      requiredSkills,
      urgency,
      eventDate: eventDate ? eventDate.toISOString() : null, // Format date to ISO string
      email: userEmail,
      eventImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTftcCEqozA1cVgSpO4A6mJ2i-zD8MGLH0f9w&s'
    };

    // Send the event creation request via WebSocket
    sendMessage(eventData);

    // Trigger a notification for a new event assignment
    addNotification(`New event "${eventName}" has been assigned!`, 'info');

    
    setEventName('');
    setEventDescription('');
    setLocation('');
    setRequiredSkills([]);
    setUrgency('');
    setEventDate(null);
  };

  /* const handleReminder = () => {
    if (!eventDate) {
      addNotification('Please select an event date before sending a reminder.', 'error');
    } else {
      addNotification('Reminder: You have an event tomorrow!', 'info');
    }
  }; */

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
        sendMessage({ page_loc: 'VolunteerManagement', email: userEmail }); // Include the user's email when fetching events
        hasSentMessage.current = true; // Prevent sending it again
      }

      return () => {
        socket.onmessage = null; // Cleanup on unmount
      };
    }
  }, [socket, sendMessage, userEmail]);

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
          <input
            type="text"
            placeholder="Enter Event Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)} // Simple text input for location
            required
            style={styles.input}
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
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select Date & Time"
            required
            style={styles.datepicker}
            className="custom-datepicker"
          />
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>

        {/* <button onClick={handleReminder} style={styles.reminderButton}>
          Send Event Reminder
        </button> */}
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
