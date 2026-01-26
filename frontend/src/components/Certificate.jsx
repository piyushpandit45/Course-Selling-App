import React, { useState } from 'react';
import '../styles/util.css';
import './Certificate.css';

const Certificate = ({ user, course, purchaseDate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const calculateDuration = () => {
    // Default duration for courses (can be made dynamic)
    return '3 Months';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateEndDate = (startDate) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 3); // Add 3 months
    return formatDate(date);
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Use html2canvas and jsPDF for client-side PDF generation
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;
      
      const certificateElement = document.getElementById('certificate-content');
      
      // Generate canvas from certificate
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Download PDF
      const fileName = `AI_DOT_SKILLS_${user.firstName}_${user.lastName}_${course.title.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: open print dialog
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const startDate = formatDate(purchaseDate);
  const endDate = calculateEndDate(purchaseDate);
  const duration = calculateDuration();

  return (
    <div className="certificate-container">
      <div className="certificate-actions">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="btn btn-primary certificate-download-btn"
        >
          {isGenerating ? 'Generating PDF...' : 'Download Certificate (PDF)'}
        </button>
      </div>
      
      <div id="certificate-content" className="certificate-content">
        <div className="certificate-border">
          <div className="certificate-inner">
            {/* Header */}
            <div className="certificate-header">
              <div className="certificate-logo">
                <h1 className="platform-name">AI DOT SKILLS</h1>
                <p className="platform-subtitle">Professional Education Platform</p>
              </div>
            </div>

            {/* Title */}
            <div className="certificate-title">
              <h2>Certificate of Completion</h2>
              <div className="certificate-divider"></div>
            </div>

            {/* Recipient */}
            <div className="certificate-recipient">
              <p className="recipient-label">This is to certify that</p>
              <h3 className="recipient-name">
                {user.firstName} {user.lastName}
              </h3>
              <p className="recipient-description">
                has successfully completed the course
              </p>
            </div>

            {/* Course Details */}
            <div className="certificate-course">
              <h4 className="course-title">{course.title}</h4>
              <p className="course-description">{course.description}</p>
            </div>

            {/* Course Information */}
            <div className="certificate-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Start Date:</span>
                  <span className="info-value">{startDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">End Date:</span>
                  <span className="info-value">{endDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{duration}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="certificate-footer">
              <div className="certificate-signatures">
                <div className="signature-item">
                  <div className="signature-line"></div>
                  <p className="signature-title">Director</p>
                  <p className="signature-org">AI DOT SKILLS</p>
                </div>
                <div className="signature-item">
                  <div className="signature-line"></div>
                  <p className="signature-title">Instructor</p>
                  <p className="signature-org">AI DOT SKILLS</p>
                </div>
              </div>
              
              <div className="certificate-date">
                <p>Issued on {formatDate(new Date())}</p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="certificate-id">
              <p>Certificate ID: {user._id.slice(-8).toUpperCase()}-{course._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
