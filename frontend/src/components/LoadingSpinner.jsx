import React from 'react';
import '../styles/util.css';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`spinner spinner-${size}`}></div>
  );
};

export default LoadingSpinner;
