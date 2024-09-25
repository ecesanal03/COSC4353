import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
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
