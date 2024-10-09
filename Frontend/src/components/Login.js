import React, {  useEffect, useState, useRef  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For displaying error messages
  const [hasSubmitted, setHasSubmitted] = useState(false); // To track submission attempt
  const { socket, sendMessage } = useWebSocket();
  const hasSentMessage = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received from server:', message);
  
        if (message.hasOwnProperty('status') && message.status === 'success') {
          // Store the logged-in user's email in localStorage
          localStorage.setItem('userEmail', email);  // Save email for future use
          if (message.profile) {
            // Save the profile in localStorage for future sessions
            localStorage.setItem('userProfile', JSON.stringify(message.profile));
            navigate('/profile', { state: { profile: message.profile } });
          } else {
            navigate('/profile');  // Redirect to profile creation if no profile exists
          }
        } else {
          setErrorMessage(message.message);
        }
      };
  
      socket.onmessage = handleMessage;
      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket, sendMessage, navigate, email]);

  const handleLogin = () => {
    setHasSubmitted(true);  // Mark as submitted

    if (email && password) {
      // Send login data to backend
      sendMessage({ page_loc: 'VolunteerLogin', email, password });
    } else {
      // If fields are empty, set a generic error message
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
      {errorMessage && hasSubmitted && <p style={{ color: 'red' }}>{errorMessage}</p>}  {/* Only display if submitted */}
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
