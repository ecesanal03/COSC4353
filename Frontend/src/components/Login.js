import React, {  useEffect, useState, useRef  } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { socket, sendMessage } = useWebSocket();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setErrorMessage(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received from server:', message);

        if (message.hasOwnProperty('status') && message.status === 'success') {
          // Clear any old profile or user data
          localStorage.removeItem('userProfile');  // Clear old profile
          localStorage.removeItem('userEmail');    // Clear old email

          // Store the logged-in user's email in localStorage
          localStorage.setItem('userEmail', email);  // Save new user's email
          localStorage.setItem('userRole', message.role);  // Save new user's role

          // If the user has a profile, save it
          if (message.profile) {
            localStorage.setItem('userProfile', JSON.stringify(message.profile));
            navigate('/profile', { state: { profile: message.profile } });
          } else {
            // If no profile exists, redirect to a clean profile page
            navigate('/profile');
          }
        } else {
          setErrorMessage(message.message);  // Show error if login fails
        }
      };

      socket.onmessage = handleMessage;
      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket, sendMessage, navigate, email]);

  const handleLogin = () => {
    if (email && password) {
      // Send login data to backend
      sendMessage({ page_loc: 'VolunteerLogin', email, password });
    } else {
      setErrorMessage('Please fill out both fields');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
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
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleLogin} style={styles.button}>Login</button>
      <p>Don't have an account? <Link to="/signup">Signup here</Link></p>
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

export default Login;
