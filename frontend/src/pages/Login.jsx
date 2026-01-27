import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, adminLogin } from '../services/authService';
import '../styles/util.css';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [adminGatePassed, setAdminGatePassed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Generate and store deviceId if not exists
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      // Generate a simple UUID-like device ID
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }

    // Check if user is already logged in
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      // Safe JSON parsing
      let user = {};
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          console.warn('Invalid user data in localStorage, clearing...');
          localStorage.removeItem('user');
          user = {};
        }
      }
      
      if (token && user._id) {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminPasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setShowAdminGate(type === 'admin');
    setAdminGatePassed(false);
    setAdminPassword('');
    setAlert(null);
  };

  const handleAdminGateSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === 'pradeep_ameta_45') {
      setAdminGatePassed(true);
      setAlert({
        type: 'success',
        message: 'Now you can proceed with Admin Login'
      });
    } else {
      setAlert({
        type: 'error',
        message: 'Incorrect admin access password'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      let response;
      
      // Get deviceId from localStorage
      const deviceId = localStorage.getItem('deviceId') || 'unknown';
      
      // Add deviceId to form data
      const loginData = {
        ...formData,
        deviceId: deviceId
      };
      
      if (userType === 'admin') {
        if (!adminGatePassed) {
          setAlert({
            type: 'error',
            message: 'Please enter admin access password first'
          });
          setLoading(false);
          return;
        }
        response = await adminLogin(loginData);
      } else {
        response = await userLogin(loginData);
      }
      
      // Safety check: Ensure response has required fields
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      // Set token and user in localStorage
      localStorage.setItem('token', response.token || '');
      localStorage.setItem('user', JSON.stringify(response.user || {}));
      localStorage.setItem('role', response.role || (userType === 'admin' ? 'admin' : 'user'));

      setAlert({
        type: 'success',
        message: 'Login successful!'
      });

      // Redirect based on user type
      setTimeout(() => {
        if (userType === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 1000);

    } catch (error) {
      setAlert({
        type: 'error',
        message: error.errors || 'Login failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">AI DOT SKILLS</h1>
            <h2 className="login-subtitle">
              {userType === 'admin' ? 'Admin Login' : 'User Login'}
            </h2>
            <p className="login-description">
              {userType === 'admin' ? 'Sign in to admin dashboard' : 'Sign in to your account'}
            </p>
          </div>

          {/* Alert */}
          {alert && (
            <div className={`alert alert-${alert.type}`}>
              <div className="flex items-center justify-between">
                <span>{alert.message}</span>
                <button
                  onClick={() => setAlert(null)}
                  className="alert-close"
                  aria-label="Close alert"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* User Type Toggle */}
          <div className="user-type-toggle">
            <button
              className={`toggle-btn ${userType === 'user' ? 'active' : ''}`}
              onClick={() => handleUserTypeChange('user')}
            >
              User
            </button>
            <button
              className={`toggle-btn ${userType === 'admin' ? 'active' : ''}`}
              onClick={() => handleUserTypeChange('admin')}
            >
              Admin
            </button>
          </div>

          {/* Admin Gate */}
          {showAdminGate && !adminGatePassed && (
            <div className="admin-gate">
              <h3>Enter Admin Access Password</h3>
              <form onSubmit={handleAdminGateSubmit}>
                <div className="form-group">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={handleAdminPasswordChange}
                    placeholder="Admin Access Password"
                    required
                  />
                </div>
                <button type="submit" className="login-btn">
                  Verify Access
                </button>
              </form>
            </div>
          )}

          {/* Login Form */}
          {(!showAdminGate || adminGatePassed) && (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="login-links">
            <p>
              Don't have an account?{' '}
              <a href="/signup" className="link">
                Sign up
              </a>
            </p>
            {userType === 'user' && (
              <a href="/courses" className="link">
                Browse Courses
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
