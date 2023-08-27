import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import logo from './logop.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (storedUsers) {
      setUsers(storedUsers);
    }
  }, []);

  const isEmailValid = (email) => {
    // Regular expression for validating Gmail addresses
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Regular expression for the new password requirements
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&(){}[\]:;<>,.?/~_+-=|\\])[A-Za-z\d*.!@#$%^&(){}[\]:;<>,.?/~_+-=|\\]{8,32}$/;
    return passwordRegex.test(password);
  };

  const [users, setUsers] = useState([]);

  const handleLogin = () => {
    if (!isEmailValid(email)) {
      setErrorMessage('Invalid Gmail address');
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMessage('Invalid password format');
      return;
    }

    // Check if the user exists in the user state
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      // User found, you can perform login actions here
      alert('Login successful');

      // Redirect to the ParkingLayout page
      navigate('/parking-layout');
    } else {
      // User not found, you can handle registration here

      // Register the user
      const newUser = { email, password };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      // Store the updated user data in local storage
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      alert('User registered and logged in');
    }
  };

  return (
    <div className='main-div'>
    <div className="login-page">
      <div className="login-logo">
        {/* Place your logo here */}
        <img
            src={logo}
            width="60"
            height="60"
            className=" logo-pic "
            style={{ borderRadius: '50%' }} 
            alt=""
          />

      </div>
      <div className="login-container">
        <h2>Login</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form className="login-form">
          <div className="form-group">
            <label>Email (Gmail only):</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password (at least 8 characters, 1 uppercase, 1 lowercase, 1 special character):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="button" onClick={handleLogin} className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
