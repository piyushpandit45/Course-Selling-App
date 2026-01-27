import React from 'react';
import jsPDF from 'jspdf';

const CertificateModal = ({ 
  show, 
  course, 
  user, 
  purchases, 
  onClose, 
  onPasswordSubmit, 
  certificatePassword, 
  setCertificatePassword, 
  passwordError, 
  isUnlocked 
}) => {
  const generateCertificatePDF = (course, user) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Certificate design
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 277, 190, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text('AI DOT SKILLS', 148.5, 35, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Certificate of Completion', 148.5, 55, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('This is to certify that', 148.5, 75, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(102, 126, 234);
    doc.text(`${user.firstname} ${user.lastname || ''}`, 148.5, 90, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`has successfully completed ${course.title} from AI DOT SKILLS.`, 148.5, 105, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Duration: ${course.duration || 'Self-paced'}`, 148.5, 125, { align: 'center' });
    doc.text(`Start Date: ${new Date(purchases.find(p => p.courseId === course._id)?.createdAt || new Date()).toLocaleDateString()}`, 148.5, 135, { align: 'center' });
    doc.text(`End Date: ${new Date().toLocaleDateString()}`, 148.5, 145, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text(`Certificate ID: ${user._id.slice(-8).toUpperCase()}-${course._id.slice(-8).toUpperCase()}`, 148.5, 165, { align: 'center' });
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 148.5, 175, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Authorized Signature', 148.5, 190, { align: 'center' });
    
    // Download PDF
    doc.save(`${user.firstname}_${course.title}_Certificate.pdf`);
  };

  const generateCertificateId = (userId, courseId) => {
    return `${userId.slice(-8).toUpperCase()}-${courseId.slice(-8).toUpperCase()}`;
  };

  if (!show || !course) return null;

  return (
    <div className="certificate-modal-overlay" onClick={onClose}>
      <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
        <div className="certificate-header">
          <h3>Course Certificate</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className={`certificate-content ${isUnlocked ? '' : 'blurred'}`}>
          <div className="certificate-design">
            <div className="certificate-header-section">
              <h1>AI DOT SKILLS</h1>
              <p>Professional Education Platform</p>
            </div>
            
            <div className="certificate-title-section">
              <h2>Certificate of Completion</h2>
              <div className="divider"></div>
            </div>
            
            <div className="certificate-recipient">
              <p>This is to certify that</p>
              <h3>{user.firstname} {user.lastname || ''}</h3>
              <p>has successfully completed {course.title} from AI DOT SKILLS.</p>
            </div>
            
            <div className="certificate-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <span>Duration:</span>
                  <span>{course.duration || 'Self-paced'}</span>
                </div>
                <div className="detail-item">
                  <span>Start Date:</span>
                  <span>{new Date(purchases.find(p => p.courseId === course._id)?.createdAt || new Date()).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span>End Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="certificate-footer">
              <div className="certificate-id">
                Certificate ID: {generateCertificateId(user._id, course._id)}
              </div>
              <div className="issue-date">
                Issue Date: {new Date().toLocaleDateString()}
              </div>
              <div className="signature">
                Authorized Signature
              </div>
            </div>
          </div>
          
          {!isUnlocked && (
            <div className="certificate-watermark">
              <p>Complete this course to unlock certificate</p>
            </div>
          )}
        </div>
        
        <div className="certificate-actions">
          {!isUnlocked ? (
            <div className="password-section">
              <div className="password-input-group">
                <input
                  type="password"
                  value={certificatePassword}
                  onChange={(e) => setCertificatePassword(e.target.value)}
                  placeholder="Enter certificate password"
                  className="password-input"
                />
                {passwordError && (
                  <div className="password-error">{passwordError}</div>
                )}
              </div>
              <button
                className="btn btn-primary"
                onClick={onPasswordSubmit}
              >
                Download Certificate
              </button>
            </div>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => generateCertificatePDF(course, user)}
            >
              Download Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
