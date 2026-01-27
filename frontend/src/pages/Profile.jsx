import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPurchases } from '../services/courseService';
import '../styles/util.css';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Safety check for JSON parsing
    let userData;
    try {
      userData = userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      userData = null;
    }
    
    if (!token || !userData || !userData._id) {
      navigate('/login');
      return;
    }

    setUser(userData);
    
    // Fetch purchased courses
    fetchPurchases();
  }, [navigate]);

  const fetchPurchases = async () => {
    try {
      const response = await getPurchases();
      setPurchases(response.purchases || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (!user || loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container">
        <div className="profile-grid">
          {/* Profile Card */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {user.firstname.charAt(0).toUpperCase()}{user.lastname.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">
                  {user.firstname} {user.lastname}
                </h2>
                <p className="profile-email">{user.email}</p>
                <p className="profile-date">
                  Member since: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="profile-actions">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline logout-btn"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="profile-main">
            <div className="account-details">
              <h3 className="section-title">Account Information</h3>
              
              <div className="details-grid">
                <div className="detail-item">
                  <label className="detail-label">First Name</label>
                  <div className="detail-value">{user.firstname}</div>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Last Name</label>
                  <div className="detail-value">{user.lastname}</div>
                </div>

                <div className="detail-item full-width">
                  <label className="detail-label">Email Address</label>
                  <div className="detail-value">{user.email}</div>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Account Type</label>
                  <div className="detail-value">Student</div>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Status</label>
                  <div className="detail-value status-active">Active</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3 className="section-title">Quick Actions</h3>
              
              <div className="actions-grid">
                <a
                  href="/my-courses"
                  className="action-card"
                >
                  <div className="action-icon">📚</div>
                  <span className="action-label">My Courses</span>
                </a>
                
                <a
                  href="/courses"
                  className="action-card"
                >
                  <div className="action-icon">🔍</div>
                  <span className="action-label">Browse Courses</span>
                </a>
                
                <a
                  href="/#contact"
                  className="action-card"
                >
                  <div className="action-icon">💬</div>
                  <span className="action-label">Contact Support</span>
                </a>
                
                <a
                  href="https://wa.me/9079603363"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-card"
                >
                  <div className="action-icon">📱</div>
                  <span className="action-label">WhatsApp Support</span>
                </a>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="account-stats">
              <h3 className="section-title">Learning Progress</h3>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{purchases.length}</div>
                  <p className="stat-label">Courses Enrolled</p>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{purchases.length}</div>
                  <p className="stat-label">Courses Completed</p>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{purchases.length * 3}</div>
                  <p className="stat-label">Hours Learned</p>
                </div>
              </div>
            </div>

            {/* Purchased Courses */}
            <div className="purchased-courses">
              <h3 className="section-title">My Courses</h3>
              
              {purchases.length === 0 ? (
                <div className="no-courses">
                  <p>You haven't enrolled in any courses yet.</p>
                  <a href="/courses" className="btn btn-primary">
                    Browse Courses
                  </a>
                </div>
              ) : (
                <div className="courses-list">
                  {purchases.map((purchase) => (
                    <div key={purchase._id} className="course-item">
                      <div className="course-info">
                        <h4 className="course-title">{purchase.courseId.title}</h4>
                        <p className="course-description">{purchase.courseId.description}</p>
                        <p className="purchase-date">
                          Enrolled on {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
