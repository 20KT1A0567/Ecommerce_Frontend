import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

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
      const response = await axios.post('https://demo-deployment2-4.onrender.com/login', {
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
        console.log(id);
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
    <div className="parent">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={refUsername}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              ref={refPassword}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="ca1">
            New to MVPSTAY STORE? <Link to="/register"><b>Create an account</b></Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;
