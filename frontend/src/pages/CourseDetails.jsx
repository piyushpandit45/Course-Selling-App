import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails, buyCourse } from '../services/courseService';
import '../styles/util.css';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchCourseDetail = useCallback(async () => {
    try {
      const response = await getCourseDetails(courseId);
      setCourse(response.course);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.error || 'Failed to load course details.'
      });
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId, fetchCourseDetail]);

  const handleBuyCourse = async () => {
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
        message: 'Please login to purchase this course.'
      });
      navigate('/login');
      return;
    }

    if (user.firstName) { // This means it's an admin
      setAlert({
        type: 'error',
        message: 'Only users can purchase courses.'
      });
      return;
    }

    setBuying(true);
    try {
      await buyCourse(courseId);
      setAlert({
        type: 'success',
        message: 'Course purchased successfully! You can now access it from My Courses.'
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.error || 'Failed to purchase course. Please try again.'
      });
    } finally {
      setBuying(false);
    }
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
                <button
                  onClick={handleBuyCourse}
                  disabled={buying}
                  className="btn btn-primary buy-btn"
                >
                  {buying ? 'Processing...' : 'Buy Course'}
                </button>
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
              href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20learning%20more%20about%20the%20course:%20" 
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
    </div>
  );
};

export default CourseDetails;
