import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserPurchases } from '../services/authService';
import CertificateModal from '../components/CertificateModal';
import '../styles/util.css';
import './MyCourses.css';

const MyCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [certificateModal, setCertificateModal] = useState({ show: false, course: null });
  const [certificatePassword, setCertificatePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Safety check for JSON parsing
    let userData;
    try {
      userData = userStr ? JSON.parse(userStr) : {};
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      userData = {};
      setUser({});
    }
    
    if (!token || !userData._id) {
      setAlert({
        type: 'error',
        message: 'Please login as a user to view your courses.'
      });
      setLoading(false);
      return;
    }

    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const response = await getUserPurchases();
      setPurchases(response.purchases);
      setPurchasedCourses(response.courses);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.error || 'Failed to load your courses.'
      });
    } finally {
      setLoading(false);
    }
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
    if (!currentUser || !currentUser.firstname) {
      setPasswordError('User data not available');
      return;
    }
    
    const expectedPassword = `${currentUser.firstname}@2026`;
    
    if (certificatePassword === expectedPassword) {
      setPasswordError('');
      setIsUnlocked(true);
    } else {
      setPasswordError('Password wrong');
    }
  };

  if (loading) {
    return (
      <div className="my-courses-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // Safe JSON parsing for initial render
  let userData;
  try {
    userData = userStr ? JSON.parse(userStr) : {};
  } catch (error) {
    console.error('Error parsing user data:', error);
    userData = {};
  }

  // Use state user if available, otherwise use parsed data
  const currentUser = user || userData;

  if (!token || !currentUser._id || currentUser.firstName) {
    return (
      <div className="my-courses-page">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Please login as a user to view your courses.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-courses-page">
      {/* Alert */}
      {alert && (
        <div className="container">
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
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">My Courses</h1>
          <p className="page-subtitle">
            Access and manage your purchased courses
          </p>
        </div>
      </div>

      {/* Courses Content */}
      <div className="container">
        {purchasedCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses purchased yet</h3>
            <p>
              Start your learning journey by exploring our course catalog.
            </p>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{purchasedCourses.length}</div>
                <p className="stat-label">Courses Enrolled</p>
              </div>
              <div className="stat-card">
                <div className="stat-number">{purchases.length}</div>
                <p className="stat-label">Total Purchases</p>
              </div>
              <div className="stat-item">
                  <div className="stat-number">
                    ₹{purchasedCourses.reduce((total, course) => total + course.price, 0)}
                  </div>
                  <p className="stat-label">Total Investment</p>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="courses-section">
              <h2 className="section-title">Your Courses</h2>
              <div className="courses-grid">
                {purchasedCourses.map((course) => (
                  <div key={course._id} className="purchased-course-card">
                    <div className="course-image-container">
                      <img
                        src={course.image.url}
                        alt={course.title}
                        className="course-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Course+Image';
                        }}
                      />
                      <div className="enrolled-badge">
                        ✓ Enrolled
                      </div>
                    </div>
                    
                    <div className="course-content">
                      <h3 className="course-title">{course.title}</h3>
                      
                      <p className="course-description">{course.description}</p>
                      
                      <div className="course-meta">
                        <span className="course-price">₹{course.price}</span>
                        <span className="purchase-date">
                          Purchased on {new Date(
                            purchases.find(p => p.courseId.toString() === course._id).createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="course-actions">
                        <Link
                          to={`/courses/${course._id}`}
                          className="btn btn-primary course-btn"
                        >
                          Continue Learning
                        </Link>
                        <button
                          className="btn btn-outline course-btn"
                          onClick={() => handleViewCertificate(course)}
                        >
                          View Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Certificate Modal - Shared Component */}
      <CertificateModal
        show={certificateModal.show}
        course={certificateModal.course}
        user={currentUser}
        purchases={purchases}
        onClose={handleCloseCertificate}
        onPasswordSubmit={handlePasswordSubmit}
        certificatePassword={certificatePassword}
        setCertificatePassword={setCertificatePassword}
        passwordError={passwordError}
        isUnlocked={isUnlocked}
      />
    </div>
  );
};

export default MyCourses;
