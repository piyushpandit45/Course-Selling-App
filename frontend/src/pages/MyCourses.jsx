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
  const [activeCertId, setActiveCertId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Safety check for JSON parsing
    let user;
    try {
      user = userStr ? JSON.parse(userStr) : {};
    } catch (error) {
      console.error('Error parsing user data:', error);
      user = {};
    }
    
    if (!token || !user._id) {
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

  const handleDownloadCertificate = (course, user) => {
    const expectedPassword = `${user.firstName}@2026`;
    const enteredPassword = prompt('Enter password to download certificate:');
    
    if (enteredPassword === expectedPassword) {
      // Generate PDF using jspdf
      const doc = new jsPDF();
      
      // AI DOT SKILLS branded certificate
      doc.setFontSize(24);
      doc.setTextColor(102, 126, 234);
      doc.text('AI DOT SKILLS', 105, 30, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Certificate of Completion', 105, 50, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text('This is to certify that', 105, 70, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(102, 126, 234);
      doc.text(`${user.firstName} ${user.lastName || ''}`, 105, 85, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('has successfully completed the course', 105, 100, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(102, 126, 234);
      doc.text(course.title, 105, 120, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 140, { align: 'center' });
      doc.text(`Duration: ${course.duration || 'Self-paced'}`, 105, 150, { align: 'center' });
      
      // Save the PDF
      doc.save(`${user.firstName}_${course.title}_Certificate.pdf`);
      console.log('Certificate generated for:', user.firstName, course.title);
    } else {
      alert('Password wrong');
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
  
  // Safe JSON parsing
  let user;
  try {
    user = userStr ? JSON.parse(userStr) : {};
  } catch (error) {
    console.error('Error parsing user data:', error);
    user = {};
  }

  if (!token || !user._id || !user.firstName) {
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
                {purchasedCourses.map((course) => {
                  console.log("Rendering button for course:", course._id);
                  return (
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
                          type="button"
                          className="btn btn-outline course-btn certificate-btn"
                          onClick={(e) => { 
                            console.log("CLICK REGISTERED - Certificate button clicked!");
                            e.stopPropagation(); 
                            e.preventDefault();
                            setActiveCertId(course._id);
                          }}
                          style={{
                            position: 'relative',
                            zIndex: 9999,
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                          }}
                        >
                          View Certificate
                        </button>
                      </div>
                    </div>
                    
                    {/* Certificate UI - Only show below this course when active */}
                    {activeCertId === course._id && (
                      <div className="certificate-container">
                        <div className="certificate-view" style={{ filter: 'blur(5px)', position: 'relative' }}>
                          <div className="certificate-content">
                            <h4>Certificate of Completion</h4>
                            <p>This is to certify that {user.firstName} {user.lastName || ''}</p>
                            <p>has successfully completed the course</p>
                            <h3>{course.title}</h3>
                            <p>Platform: AI DOT SKILLS</p>
                            <p>Date: {new Date().toLocaleDateString()}</p>
                          </div>
                          <div className="certificate-overlay">
                            <p>Complete this course to unlock</p>
                          </div>
                        </div>
                        <button 
                          className="btn btn-primary download-cert-btn"
                          onClick={() => handleDownloadCertificate(course, user)}
                        >
                          Download Certificate
                        </button>
                      </div>
                    )}
                  </div>
                );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
