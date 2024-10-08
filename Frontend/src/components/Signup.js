import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext.js';
const Signup = () => {
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
        sendMessage({ page_loc: 'VolunteerSignup' });
        hasSentMessage.current = true; // Prevent sending it again
      }

      return () => {
        socket.onmessage = null; // Cleanup on unmount
      };
    }
  }, [socket, sendMessage]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // Handle registration logic
    navigate('/profile');
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
