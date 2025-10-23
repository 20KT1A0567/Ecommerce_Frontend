import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';

const Register = () => {
  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const refRole = useRef(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'ROLE_ADMIN');
  }, []);

  const createAccount = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axios.post('https://demo-deployment2-7-bbpl.onrender.com/api/register', {
        username: refUsername.current.value,
        password: refPassword.current.value,
        role: isAdmin ? refRole.current.value || 'ROLE_USER' : 'ROLE_USER',
      });

      if (response.status === 200) {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          MVPSTAY STORE
        </Typography>

        <Typography variant="h6" gutterBottom>
          Welcome to MVPSTAY STORE
        </Typography>

        <Typography variant="body1" mb={3}>
          Create an Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={createAccount} sx={{ width: '100%' }}>
          <TextField
            label="Username"
            inputRef={refUsername}
            placeholder="Enter your username"
            required
            fullWidth
            margin="normal"
            disabled={loading}
            autoFocus
          />

          <TextField
            label="Password"
            type="password"
            inputRef={refPassword}
            placeholder="Enter your password"
            required
            fullWidth
            margin="normal"
            disabled={loading}
          />

          {isAdmin && (
            <TextField
              label="Role"
              inputRef={refRole}
              placeholder="ROLE_USER (default)"
              fullWidth
              margin="normal"
              disabled={loading}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Forgot password?{' '}
          <Link href="#" underline="hover">
            Recover here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
