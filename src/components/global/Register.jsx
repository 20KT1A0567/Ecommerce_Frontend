import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const refRole = useRef(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'ROLE_ADMIN');
  }, []);

  const createAccount = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://demo-deployment2-8.onrender.com/register', {
        username: refUsername.current.value,
        password: refPassword.current.value,
        role: isAdmin ? refRole.current.value : 'ROLE_USER',
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
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="parent">
      <div className="register-container">
        <h1>MVPSTAY STORE</h1>
        <h2>Welcome to MVPSTAY STORE</h2>
        <p>Create an Account</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <form onSubmit={createAccount}>
          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              ref={refUsername}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              ref={refPassword}
              placeholder="Enter your password"
              required
            />
          </div>
          {isAdmin && (
            <div className="input-group">
              <label>Role:</label>
              <input
                type="text"
                ref={refRole}
                placeholder="ROLE_USER (default)"
              />
            </div>
          )}
          <button type="submit">Create Account</button>
        </form>
        <p>
          Forgot password? Recover <a href="#">here</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;
