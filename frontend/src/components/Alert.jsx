import React from 'react';
import '../styles/util.css';
import './Alert.css';

const Alert = ({ type, message, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="alert-close"
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
