import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/util.css';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">AI DOT SKILLS</h3>
            <p className="footer-description">
              Empowering learners with cutting-edge technology education.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/courses" className="footer-link">Courses</Link></li>
              <li><a href="#contact" className="footer-link">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <div className="contact-info">
              <p className="contact-item">
                📧 ametapardip@gmail.com
              </p>
              <p className="contact-item">
                📱 WhatsApp: 9079603363
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2024 AI DOT SKILLS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
