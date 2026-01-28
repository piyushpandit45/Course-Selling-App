import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoutConfirm from './LogoutConfirm';
import '../styles/util.css';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('public');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // Call backend logout
      await fetch(`${process.env.REACT_APP_BACKEND_URL || "https://course-selling-app-3ihd.onrender.com/api/v1"}/User/logout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.log('Backend logout error:', error);
    }
    
    // Clear frontend data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUserRole('public');
    navigate('/');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    handleLogout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const updateRole = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        // Safe JSON parsing with fallback
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
        
        if (token && user && user._id) {
          if (user.firstName) {
            setUserRole('admin');
          } else {
            setUserRole('user');
          }
        } else {
          setUserRole('public');
        }
      } catch (error) {
        console.error('Error in navbar role update:', error);
        setUserRole('public');
      }
    };

    updateRole();
    window.addEventListener('storage', updateRole);
    return () => window.removeEventListener('storage', updateRole);
  }, [location]);

  const publicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'About Us', path: '/#about' },
    { label: 'Login', path: '/login' },
    { label: 'Signup', path: '/signup' },
  ];

  const userNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'About Us', path: '/#about' },
    { label: 'My Courses', path: '/my-courses' },
    { label: 'Profile', path: '/profile' },
    { label: 'Logout', path: '#', action: handleLogoutClick },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Add Course', path: '/admin/add-course' },
    { label: 'Manage Courses', path: '/admin/manage-courses' },
    { label: 'Logout', path: '#', action: handleLogoutClick },
  ];

  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return adminNavItems;
      case 'user':
        return userNavItems;
      default:
        return publicNavItems;
    }
  };

  const handleNavClick = (item) => {
    setIsMenuOpen(false);
    if (item.action) {
      item.action();
    } else if (item.path.startsWith('/#')) {
      // Handle hash navigation for smooth scrolling
      const elementId = item.path.replace('/#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If on different page, navigate first then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="navbar-brand">
              <img 
                src="/logo192.png" 
                alt="AI DOT SKILLS Logo" 
                className="navbar-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="navbar-text-logo">AI DOT SKILLS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="desktop-nav">
              {getNavItems().map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item)}
                  className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <h2 className="mobile-menu-title">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="mobile-menu-close"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          
          <div className="mobile-menu-items">
            {getNavItems().map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className={`mobile-menu-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Confirmation - Shared Component */}
      <LogoutConfirm
        show={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
};

export default Navbar;
