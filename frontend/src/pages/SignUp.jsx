
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  TextField, Button, Paper, Typography, Snackbar, Alert,
  Box, Container, InputAdornment, IconButton, Divider, Stack
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Login as LoginIcon,
  AccountTree as LogoIcon
} from '@mui/icons-material';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://ai-driven-project-management-tool.onrender.com/api/users/signup', { name, email, password });
      if (res.data && res.data.user) {
        login(res.data.user);
        setNotification({ open: true, message: 'Signup successful!', severity: 'success' });
        setTimeout(() => navigate('/developer'), 500);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError('Signup failed. Please check your details.');
      }
    } catch (err) {
      setError('Signup failed. Server might be unreachable.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)'
          }}
        >
          {/* Logo & Header */}
          <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
            <Box sx={{
              bgcolor: 'primary.main',
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              color: 'white'
            }}>
              <LogoIcon fontSize="large" />
            </Box>
            <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b', letterSpacing: '-1px' }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-driven Project Management System
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSignup}>
            <Stack spacing={2.5}>
              <TextField
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 10px 15px -3px rgba(25, 118, 210, 0.3)'
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button
                variant="text"
                sx={{ fontWeight: 700, textTransform: 'none' }}
                onClick={() => navigate('/')}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>

        <Typography variant="caption" display="block" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          &copy; {new Date().getFullYear()} AI-driven Project Management. All rights reserved.
        </Typography>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignUp;
