import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseDetails, updateCourse } from '../../services/courseService';
import '../../styles/util.css';
import './AddCourse.css';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    image: null,
    courseOverview: '',
    syllabus: '',
    duration: '',
    benefits: '',
    eligibility: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      // Safe JSON parsing
      let user;
      try {
        user = userStr ? JSON.parse(userStr) : {};
      } catch (parseError) {
        console.warn('Invalid user data in localStorage, clearing...');
        localStorage.removeItem('user');
        user = {};
      }
      
      if (!token || !user._id || !user.firstName) {
        navigate('/admin/login');
        return;
      }
    } catch (error) {
      console.error('Error in EditCourse useEffect:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await getCourseDetails(courseId);
        const course = response.course;
        
        setFormData({
          title: course.title || '',
          description: course.description || '',
          price: course.price || 0,
          image: null,
          courseOverview: course.courseOverview || '',
          syllabus: course.syllabus || '',
          duration: course.duration || '',
          level: course.level || '',
          language: course.language || '',
          instructor: course.instructor || '',
          category: course.category || '',
          prerequisites: course.prerequisites || '',
          learningOutcomes: course.learningOutcomes || '',
          thumbnailUrl: course.thumbnailUrl || '',
          benefits: course.benefits || '',
          eligibility: course.eligibility || ''
        });
        
        setExistingImage(course.image);
        setLoading(false);
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.error || 'Failed to fetch course details'
        });
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || formData.price <= 0) {
      setAlert({
        type: 'error',
        message: 'Please fill in all required fields with valid values.'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      
      // Only append image if a new one is selected
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Add extended course details
      formDataToSend.append('courseOverview', formData.courseOverview);
      formDataToSend.append('syllabus', formData.syllabus);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('benefits', formData.benefits);
      formDataToSend.append('eligibility', formData.eligibility);

      await updateCourse(courseId, formDataToSend);
      
      setAlert({
        type: 'success',
        message: 'Course updated successfully!'
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/manage-courses');
      }, 2000);

    } catch (error) {
      setAlert({
        type: 'error',
        message: error.error || 'Failed to update course. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-courses');
  };

  if (loading) {
    return (
      <div className="add-course-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-course-page">
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
          <button onClick={handleGoBack} className="btn btn-outline back-btn">
            ← Back to Manage Courses
          </button>
          <h1 className="page-title">Edit Course</h1>
          <p className="page-subtitle">
            Update course information and details
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="container">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="course-form">
            {/* Course Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter course title"
              />
            </div>

            {/* Course Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="6"
                className="form-textarea"
                placeholder="Enter detailed course description"
              ></textarea>
            </div>

            {/* Course Price */}
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Course Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="form-input"
                placeholder="0.00"
              />
            </div>

            {/* Course Image */}
            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Course Image (Leave empty to keep current)
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="form-input"
              />
              <p className="form-help">
                Supported formats: JPG, PNG. Max size: 5MB
              </p>
              
              {/* Current Image Preview */}
              {existingImage && existingImage.url && (
                <div className="image-preview">
                  <p className="preview-label">Current Image:</p>
                  <img
                    src={existingImage.url}
                    alt="Current course"
                    className="preview-image"
                  />
                </div>
              )}
              
              {/* New Image Preview */}
              {formData.image && (
                <div className="image-preview">
                  <p className="preview-label">New Image Preview:</p>
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="New course preview"
                    className="preview-image"
                  />
                </div>
              )}
            </div>

            {/* Extended Course Details */}
            <div className="form-section">
              <h3 className="form-section-title">Course Details (Optional)</h3>
              
              {/* Course Overview */}
              <div className="form-group">
                <label htmlFor="courseOverview" className="form-label">
                  Course Overview
                </label>
                <textarea
                  id="courseOverview"
                  name="courseOverview"
                  value={formData.courseOverview}
                  onChange={handleInputChange}
                  rows="4"
                  className="form-textarea"
                  placeholder="Provide a brief overview of the course"
                ></textarea>
              </div>

              {/* Syllabus */}
              <div className="form-group">
                <label htmlFor="syllabus" className="form-label">
                  Syllabus
                </label>
                <textarea
                  id="syllabus"
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleInputChange}
                  rows="4"
                  className="form-textarea"
                  placeholder="List the topics and modules covered in this course"
                ></textarea>
              </div>

              {/* Duration */}
              <div className="form-group">
                <label htmlFor="duration" className="form-label">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 6 weeks, 3 months, 40 hours"
                />
              </div>

              {/* Benefits */}
              <div className="form-group">
                <label htmlFor="benefits" className="form-label">
                  Benefits
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="What will students gain from this course?"
                ></textarea>
              </div>

              {/* Eligibility */}
              <div className="form-group">
                <label htmlFor="eligibility" className="form-label">
                  Eligibility
                </label>
                <textarea
                  id="eligibility"
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Who is this course suitable for?"
                ></textarea>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleGoBack}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Updating...' : 'Update Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
