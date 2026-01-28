import React, { useEffect } from 'react';
import './PaymentFeedback.css';

const PaymentFeedback = ({ 
  type, 
  message, 
  subMessage, 
  isVisible, 
  onAnimationEnd 
}) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div className={`payment-feedback-overlay ${type}`}>
      <div className={`payment-feedback-card ${type}`}>
        <div className="payment-feedback-icon">
          {type === 'success' ? (
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2"/>
                <path d="M8 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          ) : (
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                <path d="M8 8l8 8M16 8l-8 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
        
        <div className="payment-feedback-content">
          <h2 className="payment-feedback-title">
            {type === 'success' ? 'Payment Successful' : 'Payment Failed'}
          </h2>
          <p className="payment-feedback-message">
            {message}
          </p>
          {subMessage && (
            <p className="payment-feedback-submessage">
              {subMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentFeedback;
