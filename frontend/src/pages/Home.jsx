import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses, submitContact } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import '../styles/util.css';
import './Home.css';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      // Show only first 6 courses as preview
      setCourses(response.courses.slice(0, 6));
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load courses. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitContact(contactForm);
      
      // Show local success message
      setContactSuccess('Message sent successfully! We will get back to you soon.');
      setContactForm({ name: '', email: '', message: '' });
      
      // Auto-hide success message after 2 seconds
      setTimeout(() => {
        setContactSuccess(null);
      }, 2000);
      
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.error || 'Failed to send message. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="home">
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

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Learn Skills, Build Your Future
            </h1>
            <p className="hero-subtitle">
              Master cutting-edge technologies with our comprehensive courses
            </p>
            <div className="hero-buttons">
              <Link to="/courses" className="btn btn-secondary hero-btn">
                View Courses
              </Link>
              <a href="#contact" className="btn btn-outline hero-btn hero-btn-outline">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="courses-preview">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Courses</h2>
            <p className="section-subtitle">
              Explore our most popular courses and start your learning journey today
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/courses" className="btn btn-primary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section className="internships">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Internship Opportunities</h2>
            <p className="section-subtitle">
              Gain hands-on experience with our internship programs
            </p>
          </div>

          <div className="internships-grid">
            <div className="internship-card">
              <div className="internship-icon">💻</div>
              <h3 className="internship-title">Web Development</h3>
              <p className="internship-description">
                Build modern web applications using React, Node.js, and latest technologies
              </p>
              <div className="internship-actions">
                <a
                  href="https://wa.me/9079603363?text=Hi! I'm interested in the Web Development internship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp internship-btn"
                >
                  <span className="btn-icon">💬</span>
                  WhatsApp
                </a>
                <a
                  href="mailto:ametapardip@gmail.com?subject=Web Development Internship Inquiry"
                  className="btn btn-outline internship-btn"
                >
                  <span className="btn-icon">📧</span>
                  Email
                </a>
              </div>
            </div>

            <div className="internship-card">
              <div className="internship-icon">📊</div>
              <h3 className="internship-title">Data Science</h3>
              <p className="internship-description">
                Work with real datasets, machine learning models and data visualization
              </p>
              <div className="internship-actions">
                <a
                  href="https://wa.me/9079603363?text=Hi! I'm interested in the Data Science internship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp internship-btn"
                >
                  <span className="btn-icon">💬</span>
                  WhatsApp
                </a>
                <a
                  href="mailto:ametapardip@gmail.com?subject=Data Science Internship Inquiry"
                  className="btn btn-outline internship-btn"
                >
                  <span className="btn-icon">📧</span>
                  Email
                </a>
              </div>
            </div>

            <div className="internship-card">
              <div className="internship-icon">📈</div>
              <h3 className="internship-title">Data Analytics</h3>
              <p className="internship-description">
                Analyze business data, create reports and drive data-driven decisions
              </p>
              <div className="internship-actions">
                <a
                  href="https://wa.me/9079603363?text=Hi! I'm interested in the Data Analytics internship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp internship-btn"
                >
                  <span className="btn-icon">💬</span>
                  WhatsApp
                </a>
                <a
                  href="mailto:ametapardip@gmail.com?subject=Data Analytics Internship Inquiry"
                  className="btn btn-outline internship-btn"
                >
                  <span className="btn-icon">📧</span>
                  Email
                </a>
              </div>
            </div>

            <div className="internship-card">
              <div className="internship-icon">📱</div>
              <h3 className="internship-title">Digital Marketing</h3>
              <p className="internship-description">
                Learn SEO, social media marketing, content strategy and campaign management
              </p>
              <div className="internship-actions">
                <a
                  href="https://wa.me/9079603363?text=Hi! I'm interested in the Digital Marketing internship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp internship-btn"
                >
                  <span className="btn-icon">💬</span>
                  WhatsApp
                </a>
                <a
                  href="mailto:ametapardip@gmail.com?subject=Digital Marketing Internship Inquiry"
                  className="btn btn-outline internship-btn"
                >
                  <span className="btn-icon">📧</span>
                  Email
                </a>
              </div>
            </div>

            <div className="internship-card">
              <div className="internship-icon">🎬</div>
              <h3 className="internship-title">Video Editing</h3>
              <p className="internship-description">
                Create engaging video content, learn editing software and storytelling techniques
              </p>
              <div className="internship-actions">
                <a
                  href="https://wa.me/9079603363?text=Hi! I'm interested in the Video Editing internship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp internship-btn"
                >
                  <span className="btn-icon">💬</span>
                  WhatsApp
                </a>
                <a
                  href="mailto:ametapardip@gmail.com?subject=Video Editing Internship Inquiry"
                  className="btn btn-outline internship-btn"
                >
                  <span className="btn-icon">📧</span>
                  Email
                </a>
              </div>
            </div>

            <div className="internship-card">
              <div className="internship-icon">🎯</div>
              <h3 className="internship-title">Coming Soon</h3>
              <p className="internship-description">
                More exciting internship opportunities coming soon. Stay tuned!
              </p>
              <div className="internship-actions">
                <a
                  href="https://wa.me/9079603363?text=Hi! I'd like to know about upcoming internships"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp internship-btn"
                >
                  <span className="btn-icon">💬</span>
                  WhatsApp
                </a>
                <a
                  href="mailto:ametapardip@gmail.com?subject=Upcoming Internships Inquiry"
                  className="btn btn-outline internship-btn"
                >
                  <span className="btn-icon">📧</span>
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About AI DOT SKILLS</h2>
            <p className="section-subtitle">
              Empowering learners with cutting-edge technology education
            </p>
          </div>

          <div className="about-content-centered">
            <p className="about-description-main">
              We are dedicated to providing high-quality, practical education in the field of artificial intelligence and modern technologies. Our courses are designed by industry experts to help you gain real-world skills.
            </p>
            <p className="about-description-main">
              Whether you're a beginner looking to start your journey or a professional wanting to upgrade your skills, we have the right course for you.
            </p>
            
            <div className="founders-section">
              <h3 className="founders-title">Meet Our Team</h3>
              <div className="founders-grid">
                {/* Founder */}
                <div className="founder-card team-card">
                  <div className="team-card-image">
                    <img
                      src="/img1.png"
                      alt="Piyush Kumar Ameta - Founder"
                      className="team-member-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=Founder';
                      }}
                    />
                  </div>
                  <div className="team-card-content">
                    <div className="role-badge founder-badge">Founder</div>
                    <h4 className="team-member-name">Piyush Kumar Ameta</h4>
                    <p className="team-member-title">AI & ML Expert</p>
                    <p className="team-member-description">
                      B.Tech (CSE), Specialist in Artificial Intelligence & Machine Learning
                    </p>
                    <div className="team-social-links">
                      <a
                        href="https://www.linkedin.com/in/piyush-kumar-ameta-1619442a3/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn linkedin-btn"
                        aria-label="LinkedIn Profile"
                      >
                        <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a
                        href="https://github.com/piyushpandit45"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn github-btn"
                        aria-label="GitHub Profile"
                      >
                        <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Co-Founder */}
                <div className="founder-card team-card">
                  <div className="team-card-image">
                    <img
                      src="/img2.jpeg"
                      alt="Deepak Jangir - Co-Founder"
                      className="team-member-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=Co-Founder';
                      }}
                    />
                  </div>
                  <div className="team-card-content">
                    <div className="role-badge cofounder-badge">Co-Founder</div>
                    <h4 className="team-member-name">Deepak Jangir</h4>
                    <p className="team-member-title">Cybersecurity Expert</p>
                    <p className="team-member-description">
                      Cybersecurity expert and professional website development specialist
                    </p>
                    <div className="team-social-links">
                      <button
                        className="social-btn linkedin-btn"
                        aria-label="LinkedIn Profile"
                        disabled
                      >
                        <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </button>
                      <button
                        className="social-btn github-btn"
                        aria-label="GitHub Profile"
                        disabled
                      >
                        <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Team Member */}
                <div className="founder-card team-card">
                  <div className="team-card-image">
                    <img
                      src="/img3.jpeg"
                      alt="Piyush Suthar - Team Member"
                      className="team-member-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=Team';
                      }}
                    />
                  </div>
                  <div className="team-card-content">
                    <div className="role-badge team-badge">Team Member</div>
                    <h4 className="team-member-name">Piyush Suthar</h4>
                    <p className="team-member-title">Digital Marketing Expert</p>
                    <p className="team-member-description">
                      Expert in digital marketing, branding, and online growth strategies
                    </p>
                    <div className="team-social-links">
                      <button
                        className="social-btn linkedin-btn"
                        aria-label="LinkedIn Profile"
                        disabled
                      >
                        <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </button>
                      <button
                        className="social-btn github-btn"
                        aria-label="GitHub Profile"
                        disabled
                      >
                        <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-form-container">
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    className="form-textarea"
                    placeholder="Tell us how we can help you..."
                    rows="5"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary contact-btn"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              
              {/* Contact Success Message */}
              {contactSuccess && (
                <div className="contact-success-message">
                  <div className="success-content">
                    <span className="success-icon">✓</span>
                    <span className="success-text">{contactSuccess}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="contact-info">
              <div className="contact-card">
                <h3 className="contact-card-title">Get in Touch</h3>
                <div className="contact-details">
                  <div className="contact-item">
                    <div className="contact-icon">📧</div>
                    <div>
                      <p className="contact-label">Email</p>
                      <a href="mailto:ametapardip@gmail.com" className="contact-link">
                        ametapardip@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">📱</div>
                    <div>
                      <p className="contact-label">WhatsApp</p>
                      <a href="https://wa.me/9079603363" target="_blank" rel="noopener noreferrer" className="contact-link">
                        9079603363
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cta-card">
                <h4 className="cta-title">Ready to start learning?</h4>
                <p className="cta-subtitle">Join thousands of students who are already building their future with AI DOT SKILLS.</p>
                <Link to="/courses" className="btn btn-secondary cta-btn">
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
