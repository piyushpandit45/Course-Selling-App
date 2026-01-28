import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails, getPurchases, verifyBuyCoursePassword } from '../services/courseService';
import '../styles/util.css';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  
  // Buy Course password modal states
  const [showBuyPasswordModal, setShowBuyPasswordModal] = useState(false);
  const [buyPassword, setBuyPassword] = useState('');
  const [buyPasswordError, setBuyPasswordError] = useState('');
  const [isVerifyingBuyPassword, setIsVerifyingBuyPassword] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await getCourseDetails(courseId);
        setCourse(response.course);
        
        // Check if user is logged in and if course is purchased
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const purchaseResponse = await getPurchases();
            const purchasedCourses = purchaseResponse.purchases || [];
            const isCoursePurchased = purchasedCourses.some(p => p.courseId === courseId);
            setIsPurchased(isCoursePurchased);
          } catch (error) {
            console.error('Error checking purchases:', error);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  const handleBuyCourse = async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      setAlert({
        type: 'error',
        message: 'Please login to purchase this course.'
      });
      navigate('/login');
      return;
    }

    // Open buy course password modal
    setShowBuyPasswordModal(true);
    setBuyPassword('');
    setBuyPasswordError('');
  };

  const handleBuyPasswordSubmit = async () => {
    if (!buyPassword.trim()) {
      setBuyPasswordError('Please enter the password');
      return;
    }

    setIsVerifyingBuyPassword(true);
    setBuyPasswordError('');

    try {
      const response = await verifyBuyCoursePassword(courseId, buyPassword);
      
      if (response.success) {
        // Password is correct and course purchased successfully
        setBuyPasswordError('');
        setIsPurchased(true);
        setBuyPassword('success'); // Trigger success state
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowBuyPasswordModal(false);
          setBuyPassword('');
          setAlert({
            type: 'success',
            message: response.message || 'Course purchased successfully'
          });
        }, 2000);
      } else {
        // Password is wrong or other error - show inside modal
        setBuyPasswordError(response.message || 'Invalid password');
      }
      
    } catch (error) {
      // Show error inside modal only
      setBuyPasswordError(error.message || 'Failed to verify password');
    } finally {
      setIsVerifyingBuyPassword(false);
    }
  };

  const handleCloseBuyPasswordModal = () => {
    setShowBuyPasswordModal(false);
    setBuyPassword('');
    setBuyPasswordError('');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="course-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-page">
        <div className="error-container">
          <h2>Course Not Found</h2>
          <p>The course you're looking for doesn't exist.</p>
          <button onClick={handleGoBack} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
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

      {/* Course Header */}
      <div className="course-header">
        <div className="container">
          <button onClick={handleGoBack} className="btn btn-outline back-btn">
            ← Back to Courses
          </button>
          
          <div className="course-header-content">
            <div className="course-image-section">
              {course.image && course.image.url && (
                <img
                  src={course.image.url}
                  alt={course.title}
                  className="course-detail-image"
                />
              )}
            </div>
            
            <div className="course-info-section">
              <h1 className="course-title">{course.title}</h1>
              <p className="course-description">{course.description}</p>
              <div className="course-price">₹{course.price}</div>
              
              <div className="course-actions">
                {!isPurchased ? (
                  <button
                    onClick={handleBuyCourse}
                    className="btn btn-primary buy-btn"
                  >
                    Buy Course
                  </button>
                ) : (
                  <button
                    className="btn btn-outline"
                    disabled
                  >
                    Certificate Available on Completion
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="course-details-section">
        <div className="container">
          <div className="course-details-grid">
            {/* Course Overview */}
            <div className="detail-card">
              <h3 className="detail-title">Course Overview</h3>
              <p className="detail-content">
                {course.courseOverview || 'Course overview information will be available soon.'}
              </p>
            </div>

            {/* Syllabus */}
            <div className="detail-card">
              <h3 className="detail-title">Syllabus</h3>
              <div className="detail-content">
                {course.syllabus ? (
                  course.syllabus.split('\n').map((line, index) => (
                    <p key={index} className="syllabus-line">{line}</p>
                  ))
                ) : (
                  <p>Detailed syllabus will be available soon.</p>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="detail-card">
              <h3 className="detail-title">Duration</h3>
              <p className="detail-content">
                {course.duration || 'Duration information will be available soon.'}
              </p>
            </div>

            {/* Benefits */}
            <div className="detail-card">
              <h3 className="detail-title">Benefits</h3>
              <div className="detail-content">
                {course.benefits ? (
                  course.benefits.split('\n').map((line, index) => (
                    <p key={index} className="benefit-line">{line}</p>
                  ))
                ) : (
                  <p>Course benefits will be available soon.</p>
                )}
              </div>
            </div>

            {/* Eligibility */}
            <div className="detail-card">
              <h3 className="detail-title">Eligibility</h3>
              <p className="detail-content">
                {course.eligibility || 'Eligibility information will be available soon.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="course-contact-section">
        <div className="container">
          <div className="contact-header">
            <h3 className="contact-title">Need More Information?</h3>
            <p className="contact-subtitle">Get in touch with us for course details and enrollment assistance</p>
          </div>
          
          <div className="contact-actions">
            <a
              href="https://wa.me/9079603363?text=Hi!%20I'm%20interested%20in%20learning%20more%20about%20the%20course:%20" 
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn whatsapp-btn"
            >
              <span className="contact-icon">💬</span>
              Chat on WhatsApp
            </a>
            
            <a
              href="mailto:info@aidotskills.com?subject=Course%20Inquiry%20-%20" 
              className="contact-btn email-btn"
            >
              <span className="contact-icon">✉️</span>
              Send Email
            </a>
          </div>
        </div>
      </div>

      {/* Buy Course Password Modal */}
      {showBuyPasswordModal && (
        <div className="password-modal">
          <div className="password-modal-content">
            <div className="password-modal-header">
              <h3>Course Purchase Verification</h3>
              <button 
                onClick={handleCloseBuyPasswordModal}
                className="close-btn"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            
            <div className="password-modal-body">
              {buyPassword === 'success' ? (
                // Success State
                <div className="password-success-state">
                  <div className="success-checkmark">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                      <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                  </div>
                  <p className="success-text">Your course purchased successfully</p>
                </div>
              ) : (
                // Password Form State
                <>
                  <p className="password-modal-description">
                    Please complete the payment to the admin account first.<br />
                    After receiving the password, enter it below to unlock and buy this course.
                  </p>
                  
                  <form className="password-form">
                    <div className="password-input-group">
                      <input
                        type="password"
                        value={buyPassword}
                        onChange={(e) => setBuyPassword(e.target.value)}
                        placeholder="Enter course access password"
                        className="password-input"
                        disabled={isVerifyingBuyPassword}
                      />
                      {buyPasswordError && (
                        <div className="password-error">{buyPasswordError}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleBuyPasswordSubmit}
                      disabled={isVerifyingBuyPassword}
                    >
                      {isVerifyingBuyPassword ? 'Verifying...' : 'Buy Course'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
