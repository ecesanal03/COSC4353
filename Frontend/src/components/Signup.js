import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext.js';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // For displaying error messages
  const [hasSubmitted, setHasSubmitted] = useState(false); // To track submission attempt
  const { socket, sendMessage } = useWebSocket();
  const hasSentMessage = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received from server:', message);
        
        if (message.hasOwnProperty('status')) {
          if (message.status === 'success') {
            // Navigate to profile on successful registration
            navigate('/profile');
          } else {
            // Display the error message
            setErrorMessage(message.message);
          }
        }
      };

      socket.onmessage = handleMessage;

      return () => {
        socket.onmessage = null; // Cleanup on unmount
      };
    }
  }, [socket, sendMessage, navigate]);

  const handleRegister = () => {
    setHasSubmitted(true);  // Mark as submitted

    if (email && password) {
      // Send registration data to backend
      sendMessage({ page_loc: 'VolunteerSignup', email, password });
    } else {
      // If fields are empty, set a generic error message
      setErrorMessage('Please fill out both fields');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={styles.input}
      />
      {errorMessage && hasSubmitted && <p style={{ color: 'red' }}>{errorMessage}</p>}  {/* Only display if submitted */}
      <button onClick={handleRegister} style={styles.button}>Register</button>
      <p>Already have an account? <Link to="/">Login here</Link></p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '50px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    width: '300px',
    margin: '100px auto',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    width: '100%',
  },
  button: {
    backgroundColor: '#3A7CA5',
    color: 'white',
    padding: '10px',
    border: 'none',
    width: '100%',
  },
};

export default Signup;
