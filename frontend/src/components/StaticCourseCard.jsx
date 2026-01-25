import React from 'react';
import '../styles/util.css';
import './StaticCourseCard.css';

const StaticCourseCard = ({ course }) => {
  return (
    <div className="static-course-card">
      <div className="static-course-icon">{course.icon}</div>
      <div className="static-course-content">
        <h3 className="static-course-title">{course.title}</h3>
        <p className="static-course-description">{course.description}</p>
        <div className="static-course-actions">
          <a
            href={course.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp static-course-btn"
          >
            <span className="btn-icon">💬</span>
            WhatsApp
          </a>
          <a
            href={course.emailLink}
            className="btn btn-outline static-course-btn"
          >
            <span className="btn-icon">📧</span>
            Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default StaticCourseCard;
