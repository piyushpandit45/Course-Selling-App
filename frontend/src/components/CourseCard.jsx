import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/util.css';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-card-image-container">
        <img
          src={course.image.url}
          alt={course.title}
          className="course-card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Course+Image';
          }}
        />
        <div className="course-card-price">
          ₹{course.price}
        </div>
      </div>
      
      <div className="course-card-content">
        <h3 className="course-card-title">
          {course.title}
        </h3>
        
        <p className="course-card-description">
          {course.description}
        </p>
        
        <Link
          to={`/courses/${course._id}`}
          className="course-card-btn"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
