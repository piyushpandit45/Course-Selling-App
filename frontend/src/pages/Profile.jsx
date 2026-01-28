import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPurchases } from '../services/courseService';
import CertificateModal from '../components/CertificateModal';
import LogoutConfirm from '../components/LogoutConfirm';
import '../styles/util.css';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstname: '', lastname: '', email: '' });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [certificateModal, setCertificateModal] = useState({ show: false, course: null });
  const [certificatePassword, setCertificatePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleEditProfile = () => {
    setEditForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    });
    setIsEditing(true);
    setEditError('');
    setEditSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError('');
    setEditSuccess('');
  };

  const handleSaveProfile = async () => {
    setEditError('');
    setEditSuccess('');

    // Basic validation
    if (!editForm.firstname.trim() || !editForm.lastname.trim() || !editForm.email.trim()) {
      setEditError('All fields are required');
      return;
    }

    if (!editForm.email.includes('@')) {
      setEditError('Please enter a valid email address');
      return;
    }

    try {
      // Update localStorage first for immediate UI update
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setEditSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsEditing(false);
        setEditSuccess('');
      }, 1500);
    } catch (error) {
      setEditError('Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleViewCertificate = (course) => {
    setCertificateModal({ show: true, course });
    setCertificatePassword('');
    setPasswordError('');
    setIsUnlocked(false);
  };

  const handleCloseCertificate = () => {
    setCertificateModal({ show: false, course: null });
    setCertificatePassword('');
    setPasswordError('');
    setIsUnlocked(false);
  };

  const handlePasswordSubmit = () => {
    if (!user || !user.firstname) {
      setPasswordError('User data not available');
      return;
    }
    
    const expectedPassword = `${user.firstname}@2026`;
    
    if (certificatePassword === expectedPassword) {
      setPasswordError('');
      setIsUnlocked(true);
    } else {
      setPasswordError('Password wrong');
    }
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
                  onClick={handleEditProfile}
                  className="btn btn-primary edit-btn"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogoutClick}
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
                      <div className="course-actions">
                        <button
                          className="btn btn-outline certificate-btn"
                          onClick={() => handleViewCertificate(purchase.courseId)}
                        >
                          Download Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <h3>Edit Profile</h3>
              
              {editError && (
                <div className="alert alert-error">{editError}</div>
              )}
              
              {editSuccess && (
                <div className="alert alert-success">{editSuccess}</div>
              )}
              
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={editForm.firstname}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={editForm.lastname}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={handleSaveProfile}
                  className="btn btn-primary"
                  disabled={!!editSuccess}
                >
                  {editSuccess ? 'Saved!' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal - Shared Component */}
      <CertificateModal
        show={certificateModal.show}
        course={certificateModal.course}
        user={user}
        purchases={purchases}
        onClose={handleCloseCertificate}
        onPasswordSubmit={handlePasswordSubmit}
        certificatePassword={certificatePassword}
        setCertificatePassword={setCertificatePassword}
        passwordError={passwordError}
        isUnlocked={isUnlocked}
      />

      {/* Logout Confirmation - Shared Component */}
      <LogoutConfirm
        show={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default Profile;
