import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSignup, adminSignup } from '../services/authService';
import '../styles/util.css';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState(
    userType === 'admin' 
      ? { firstName: '', lastName: '', email: '', password: '' }
      : { firstname: '', lastname: '', email: '', password: '' }
  );
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [adminGatePassed, setAdminGatePassed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
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
        if (user.firstName) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [navigate]);

  useEffect(() => {
    // Reset form when user type changes
    setFormData(
      userType === 'admin' 
        ? { firstName: '', lastName: '', email: '', password: '' }
        : { firstname: '', lastname: '', email: '', password: '' }
    );
    setAlert(null);
  }, [userType]);

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
    if (adminPassword === 'piyush_ameta_45') {
      setAdminGatePassed(true);
      setAlert({
        type: 'success',
        message: 'Now you can proceed with Admin Signup'
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
      // eslint-disable-next-line no-unused-vars
      
      if (userType === 'admin') {
        if (!adminGatePassed) {
          setAlert({
            type: 'error',
            message: 'Please enter admin access password first'
          });
          setLoading(false);
          return;
        }
        await adminSignup(formData);
      } else {
        await userSignup(formData);
      }

      setAlert({
        type: 'success',
        message: 'Signup successful! Please login.'
      });

      // Redirect to login after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setAlert({
        type: 'error',
        message: error.errors || 'Signup failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">AI DOT SKILLS</h1>
            <h2 className="signup-subtitle">
              {userType === 'admin' ? 'Admin Signup' : 'User Signup'}
            </h2>
            <p className="signup-description">
              {userType === 'admin' ? 'Create an admin account' : 'Create your account'}
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
                <button type="submit" className="signup-btn">
                  Verify Access
                </button>
              </form>
            </div>
          )}

          {/* Signup Form */}
          {(!showAdminGate || adminGatePassed) && (
            <form onSubmit={handleSubmit} className="signup-form">
              {userType === 'admin' ? (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </>
              )}
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
              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="signup-links">
            <p>
              Already have an account?{' '}
              <a href="/login" className="link">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
