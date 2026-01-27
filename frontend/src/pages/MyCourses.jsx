import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserPurchases } from '../services/authService';
import jsPDF from 'jspdf';
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
    if (!user || !user.firstname) {
      setPasswordError('User data not available');
      return;
    }
    
    const expectedPassword = `${user.firstname}@2026`;
    
    if (certificatePassword === expectedPassword) {
      setPasswordError('');
      setIsUnlocked(true);
      generateCertificatePDF(certificateModal.course, user);
    } else {
      setPasswordError('Password wrong');
    }
  };

  const generateCertificatePDF = (course, user) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Certificate design
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 277, 190, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text('AI DOT SKILLS', 148.5, 35, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Certificate of Completion', 148.5, 55, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('This is to certify that', 148.5, 75, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(102, 126, 234);
    doc.text(`${user.firstname} ${user.lastname || ''}`, 148.5, 90, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`has successfully completed ${course.title} from AI DOT SKILLS.`, 148.5, 105, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Duration: ${course.duration || 'Self-paced'}`, 148.5, 125, { align: 'center' });
    doc.text(`Start Date: ${new Date(purchases.find(p => p.courseId === course._id)?.createdAt || new Date()).toLocaleDateString()}`, 148.5, 135, { align: 'center' });
    doc.text(`End Date: ${new Date().toLocaleDateString()}`, 148.5, 145, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text(`Certificate ID: ${user._id.slice(-8).toUpperCase()}-${course._id.slice(-8).toUpperCase()}`, 148.5, 165, { align: 'center' });
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 148.5, 175, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Authorized Signature', 148.5, 190, { align: 'center' });
    
    // Download PDF
    doc.save(`${user.firstname}_${course.title}_Certificate.pdf`);
  };

  const generateCertificateId = (userId, courseId) => {
    return `${userId.slice(-8).toUpperCase()}-${courseId.slice(-8).toUpperCase()}`;
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

  if (!token || !currentUser._id || !currentUser.firstname) {
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
              <div className="stat-card">
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
                            purchases.find(p => p.courseId === course._id)?.createdAt || new Date()
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

      {/* Certificate Modal */}
      {certificateModal.show && certificateModal.course && (
        <div className="certificate-modal-overlay" onClick={handleCloseCertificate}>
          <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="certificate-header">
              <h3>Course Certificate</h3>
              <button className="close-btn" onClick={handleCloseCertificate}>×</button>
            </div>
            
            <div className={`certificate-content ${isUnlocked ? '' : 'blurred'}`}>
              <div className="certificate-design">
                <div className="certificate-header-section">
                  <h1>AI DOT SKILLS</h1>
                  <p>Professional Education Platform</p>
                </div>
                
                <div className="certificate-title-section">
                  <h2>Certificate of Completion</h2>
                  <div className="divider"></div>
                </div>
                
                <div className="certificate-recipient">
                  <p>This is to certify that</p>
                  <h3>{currentUser.firstname} {currentUser.lastname || ''}</h3>
                  <p>has successfully completed {certificateModal.course.title} from AI DOT SKILLS.</p>
                </div>
                
                <div className="certificate-details">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span>Duration:</span>
                      <span>{certificateModal.course.duration || 'Self-paced'}</span>
                    </div>
                    <div className="detail-item">
                      <span>Start Date:</span>
                      <span>{new Date(purchases.find(p => p.courseId === certificateModal.course._id)?.createdAt || new Date()).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span>End Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="certificate-footer">
                  <div className="certificate-id">
                    Certificate ID: {generateCertificateId(currentUser._id, certificateModal.course._id)}
                  </div>
                  <div className="issue-date">
                    Issue Date: {new Date().toLocaleDateString()}
                  </div>
                  <div className="signature">
                    Authorized Signature
                  </div>
                </div>
              </div>
              
              {!isUnlocked && (
                <div className="certificate-watermark">
                  <p>Complete this course to unlock certificate</p>
                </div>
              )}
            </div>
            
            <div className="certificate-actions">
              {!isUnlocked ? (
                <div className="password-section">
                  <div className="password-input-group">
                    <input
                      type="password"
                      value={certificatePassword}
                      onChange={(e) => setCertificatePassword(e.target.value)}
                      placeholder="Enter certificate password"
                      className="password-input"
                    />
                    {passwordError && (
                      <div className="password-error">{passwordError}</div>
                    )}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handlePasswordSubmit}
                  >
                    Download Certificate
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => generateCertificatePDF(certificateModal.course, currentUser)}
                >
                  Download Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
