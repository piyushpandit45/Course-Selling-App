import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses, getContacts } from '../../services/courseService';
import '../../styles/util.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

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
        message: 'Access denied. Admin privileges required.'
      });
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesResponse, contactsResponse] = await Promise.all([
        getAllCourses(),
        getContacts()
      ]);
      
      setCourses(coursesResponse.courses);
      setContacts(contactsResponse.contacts);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load dashboard data.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
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
      <div className="admin-dashboard">
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

  const totalRevenue = courses.reduce((sum, course) => sum + course.price, 0);
  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="admin-dashboard">
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
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">
            Manage your courses and view platform statistics
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Total Courses</p>
                <p className="stat-number">{courses.length}</p>
              </div>
              <div className="stat-icon">📚</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Total Revenue</p>
                <p className="stat-number">₹{totalRevenue}</p>
              </div>
              <div className="stat-icon">💰</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Contact Messages</p>
                <p className="stat-number">{contacts.length}</p>
              </div>
              <div className="stat-icon">💬</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Avg Course Price</p>
                <p className="stat-number">
                  ₹{courses.length > 0 ? Math.round(totalRevenue / courses.length) : 0}
                </p>
              </div>
              <div className="stat-icon">📊</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link
              to="/admin/add-course"
              className="action-btn btn-primary"
            >
              <span className="action-icon">➕</span>
              <span>Add New Course</span>
            </Link>
            
            <Link
              to="/admin/manage-courses"
              className="action-btn btn-outline"
            >
              <span className="action-icon">⚙️</span>
              <span>Manage Courses</span>
            </Link>
            
            <button
              onClick={fetchDashboardData}
              className="action-btn btn-outline"
            >
              <span className="action-icon">🔄</span>
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Recent Courses */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Recent Courses</h2>
              <Link
                to="/admin/manage-courses"
                className="view-all-link"
              >
                View All
              </Link>
            </div>
            
            {courses.length === 0 ? (
              <div className="empty-state">
                <p>No courses available</p>
              </div>
            ) : (
              <div className="course-list">
                {courses.slice(0, 5).map((course) => (
                  <div key={course._id} className="course-item">
                    <div className="course-info">
                      <h3 className="course-item-title">{course.title}</h3>
                      <p className="course-item-price">₹{course.price}</p>
                    </div>
                    <Link
                      to={`/admin/manage-courses`}
                      className="edit-link"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Contacts */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Recent Messages</h2>
              <span className="message-count">{contacts.length} total</span>
            </div>
            
            {contacts.length === 0 ? (
              <div className="empty-state">
                <p>No contact messages</p>
              </div>
            ) : (
              <div className="contact-list">
                {recentContacts.map((contact) => (
                  <div key={contact._id} className="contact-item">
                    <div className="contact-header">
                      <h3 className="contact-name">{contact.name}</h3>
                      <span className="contact-date">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="contact-message">{contact.message}</p>
                    <p className="contact-email">{contact.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
