import React from 'react';

const LogoutConfirm = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <h3>Confirm Logout</h3>
          <p>Do you want to logout?</p>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onConfirm}>
              Yes
            </button>
            <button className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirm;
