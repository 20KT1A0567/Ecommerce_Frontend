import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const refUsername = useRef();
  const refPassword = useRef();

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://demo-deployment2-8-cq0p.onrender.com/api/login', {
        username: refUsername.current.value,
        password: refPassword.current.value,
      });

      const { data } = response;
      if (data.login === 'success') {
        const { role, token, id, username } = data;
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', id);

        alert(`Login successful! Welcome, ${username}`);
        if (role === 'ROLE_USER') {
          navigate('/userdashboard');
        } else if (role === 'ROLE_ADMIN') {
          navigate('/admindashboard');
        } else {
          alert('Unknown role. Please contact support.');
        }
      } else {
        setError('Invalid login credentials.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography component="h1" variant="h5" mb={2}>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            inputRef={refUsername}
            placeholder="Enter your username"
            disabled={loading}
            required
            autoFocus
          />

          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            inputRef={refPassword}
            placeholder="Enter your password"
            disabled={loading}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>

          <Typography variant="body2" align="center">
            New to MVPSTAY STORE?{' '}
            <Link component={RouterLink} to="/register" underline="hover" fontWeight="bold">
              Create an account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
