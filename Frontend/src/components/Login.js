import React, {  useEffect, useState, useRef  } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  

  const socketUrl = 'ws://localhost:8000/';
  const socket = useRef(null);
  useEffect(() => {
    socket.current = new WebSocket(socketUrl);

    socket.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message received from server:', message);
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    // Handle login logic here
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
