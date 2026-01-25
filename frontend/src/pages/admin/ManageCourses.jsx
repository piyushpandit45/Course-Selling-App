import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses, deleteCourse } from '../../services/courseService';
import '../../styles/util.css';
import './ManageCourses.css';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [alert, setAlert] = useState(null);

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
        setAlert({
          type: 'error',
          message: 'Access denied. Admin privileges required.'
        });
        setLoading(false);
        return;
      }

      fetchCourses();
    } catch (error) {
      console.error('Error in ManageCourses useEffect:', error);
      setAlert({
        type: 'error',
        message: 'Failed to initialize admin access.'
      });
      setLoading(false);
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.courses);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load courses.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setDeleting(courseId);
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter(course => course._id !== courseId));
      setAlert({
        type: 'success',
        message: 'Course deleted successfully.'
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.error || 'Failed to delete course.'
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="manage-courses-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading courses...</p>
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
      <div className="manage-courses-page">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Admin privileges required to access this page.</p>
          <Link to="/admin/login" className="btn btn-primary">
            Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-courses-page">
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
          <div className="header-content">
            <div>
              <h1 className="page-title">Manage Courses</h1>
              <p className="page-subtitle">
                Edit, update, or delete existing courses
              </p>
            </div>
            <Link
              to="/admin/add-course"
              className="btn btn-primary"
            >
              Add New Course
            </Link>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="container">
        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses available</h3>
            <p>
              Start by adding your first course to the platform.
            </p>
            <Link to="/admin/add-course" className="btn btn-primary">
              Add First Course
            </Link>
          </div>
        ) : (
          <div className="courses-table-container">
            <div className="table-wrapper">
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Price</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        <div className="course-info">
                          <img
                            src={course.image.url}
                            alt={course.title}
                            className="course-thumbnail"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64?text=Course';
                            }}
                          />
                          <div className="course-details">
                            <h3 className="course-title">{course.title}</h3>
                            <p className="course-description">{course.description}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="course-price">₹{course.price}</span>
                      </td>
                      <td>
                        <span className="course-date">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/courses/${course._id}`}
                            target="_blank"
                            className="btn btn-outline btn-sm"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/edit-course/${course._id}`}
                            className="btn btn-outline btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            disabled={deleting === course._id}
                            className="btn btn-danger btn-sm"
                          >
                            {deleting === course._id ? (
                              <div className="flex items-center">
                                <div className="spinner btn-spinner"></div>
                                Deleting...
                              </div>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="table-footer">
              <div className="footer-content">
                <p className="course-count">
                  Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
                </p>
                <div className="total-value">
                  Total value: ₹{courses.reduce((sum, course) => sum + course.price, 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
