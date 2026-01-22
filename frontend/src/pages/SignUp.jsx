import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Snackbar, Alert } from '@mui/material';



function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://ai-driven-project-management-tool.onrender.com/api/users/signup', { name, email, password });
      if (res.data && res.data.user) {
        login(res.data.user);
        setNotification({ open: true, message: 'Signup successful!', severity: 'success' });
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError('Signup failed');
      }
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" align="center" gutterBottom>Sign Up (Developer Only)</Typography>
      <form onSubmit={handleSignup}>
        <TextField
          label="Name"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
       <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button variant="text" color="primary" onClick={() => navigate('/')}>
                Already have an account? Login
              </Button>
        </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default SignUp;
