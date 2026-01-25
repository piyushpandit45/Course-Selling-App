import React, { useState, useEffect } from 'react';
import { getAllCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import StaticCourseCard from '../components/StaticCourseCard';
import '../styles/util.css';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [alert, setAlert] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // Static fallback courses (same as internship structure)
  const staticCourses = [
    {
      _id: 'static-1',
      title: 'Web Development',
      description: 'Build modern web applications using React, Node.js, and latest technologies',
      icon: '💻',
      whatsappLink: 'https://wa.me/9079603363?text=Hi! I\'m interested in the Web Development course',
      emailLink: 'mailto:ametapardip@gmail.com?subject=Web Development Course Inquiry'
    },
    {
      _id: 'static-2',
      title: 'Data Science',
      description: 'Work with real datasets, machine learning models and data visualization',
      icon: '📊',
      whatsappLink: 'https://wa.me/9079603363?text=Hi! I\'m interested in the Data Science course',
      emailLink: 'mailto:ametapardip@gmail.com?subject=Data Science Course Inquiry'
    },
    {
      _id: 'static-3',
      title: 'Data Analytics',
      description: 'Analyze business data, create reports and drive data-driven decisions',
      icon: '📈',
      whatsappLink: 'https://wa.me/9079603363?text=Hi! I\'m interested in the Data Analytics course',
      emailLink: 'mailto:ametapardip@gmail.com?subject=Data Analytics Course Inquiry'
    },
    {
      _id: 'static-4',
      title: 'Digital Marketing',
      description: 'Learn SEO, social media marketing, content strategy and campaign management',
      icon: '📱',
      whatsappLink: 'https://wa.me/9079603363?text=Hi! I\'m interested in the Digital Marketing course',
      emailLink: 'mailto:ametapardip@gmail.com?subject=Digital Marketing Course Inquiry'
    },
    {
      _id: 'static-5',
      title: 'Video Editing',
      description: 'Create engaging video content, learn editing software and storytelling techniques',
      icon: '🎬',
      whatsappLink: 'https://wa.me/9079603363?text=Hi! I\'m interested in the Video Editing course',
      emailLink: 'mailto:ametapardip@gmail.com?subject=Video Editing Course Inquiry'
    },
    {
      _id: 'static-6',
      title: 'Coming Soon',
      description: 'More exciting courses coming soon. Stay tuned!',
      icon: '🎯',
      whatsappLink: 'https://wa.me/9079603363?text=Hi! I\'d like to know about upcoming courses',
      emailLink: 'mailto:ametapardip@gmail.com?subject=Upcoming Courses Inquiry'
    }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, searchTerm, sortBy]);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      
      // Check if backend returned valid data
      if (response && response.courses && Array.isArray(response.courses) && response.courses.length > 0) {
        setCourses(response.courses);
        setBackendAvailable(true);
      } else {
        // Backend returned empty or invalid data
        setBackendAvailable(false);
      }
    } catch (error) {
      // Backend is OFF or API failed
      setBackendAvailable(false);
      // Don't show error alert for fallback system - just use static courses
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    // Only filter/sort when backend is available
    if (!backendAvailable) return;
    
    let filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price - b.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="courses-page">
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
          <h1 className="page-title">Our Courses</h1>
          <p className="page-subtitle">
            Discover our comprehensive range of courses designed to help you master new skills
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container">
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search" className="filter-label">
                Search Courses
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by title or description..."
                className="form-input"
                disabled={!backendAvailable}
              />
              {!backendAvailable && (
                <small className="filter-disabled-text">
                  Search disabled - backend unavailable
                </small>
              )}
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort" className="filter-label">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSort}
                className="form-input"
                disabled={!backendAvailable}
              >
                <option value="title">Title (A-Z)</option>
                <option value="price">Price (Low to High)</option>
                <option value="newest">Newest First</option>
              </select>
              {!backendAvailable && (
                <small className="filter-disabled-text">
                  Sort disabled - backend unavailable
                </small>
              )}
            </div>
          </div>

          <div className="filters-footer">
            <p className="results-count">
              {backendAvailable 
                ? `${filteredCourses.length} ${filteredCourses.length === 1 ? 'course' : 'courses'} found`
                : `${staticCourses.length} courses available`
              }
            </p>
            {searchTerm && backendAvailable && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : backendAvailable && filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>
              {searchTerm ? 'No courses found' : 'No courses available'}
            </h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms or browse all courses.'
                : 'Check back later for new courses.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-primary"
              >
                Browse All Courses
              </button>
            )}
          </div>
        ) : (
          <div className="courses-grid">
            {backendAvailable ? (
              // Show backend courses when available
              filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              // Show static courses when backend is not available
              staticCourses.map((course) => (
                <StaticCourseCard key={course._id} course={course} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
