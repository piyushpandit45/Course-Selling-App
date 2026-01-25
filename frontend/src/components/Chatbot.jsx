import React, { useState, useRef, useEffect } from 'react';
import '../styles/util.css';
import './Chatbot.css';

const Chatbot = ({ setIsChatbotOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInternship, setSelectedInternship] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChatbot = () => {
    if (!isOpen) {
      // Initialize with welcome message
      setMessages([{
        type: 'bot',
        text: 'Welcome 👋\nThanks for visiting Ai Dot Skills.\nHow can I help you today?'
      }]);
      setCurrentStep('main-options');
    }
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setIsMinimized(false);
    setIsChatbotOpen(newIsOpen);
  };

  const minimizeChatbot = () => {
    setIsMinimized(!isMinimized);
  };

  const addMessage = (text, type = 'user') => {
    setMessages(prev => [...prev, { type, text }]);
  };

  const handleMainOption = (option) => {
    addMessage(option);
    
    if (option === 'Course Information') {
      setTimeout(() => {
        const botMessage = 'Thanks for your response 😊\nThese are our available courses.\nWhich course are you interested in?';
        setMessages(prev => [...prev, { type: 'bot', text: botMessage }]);
        setCurrentStep('course-selection');
      }, 500);
    } else if (option === 'Internship Information') {
      setTimeout(() => {
        const botMessage = 'Thanks for your interest 😊\nWe are offering internships in the following domains.\nPlease select one.';
        setMessages(prev => [...prev, { type: 'bot', text: botMessage }]);
        setCurrentStep('internship-selection');
      }, 500);
    } else if (option === 'Contact Support') {
      setTimeout(() => {
        const botMessage = 'Please choose your preferred contact method:';
        setMessages(prev => [...prev, { type: 'bot', text: botMessage }]);
        setCurrentStep('contact-options');
      }, 500);
    }
  };

  const handleCourseSelection = (course) => {
    addMessage(course);
    setSelectedCourse(course);
    
    setTimeout(() => {
      const botMessage = 'Great choice!\n\nThis is a 6-month course designed to build practical skills.\nBenefits include:\n• Industry-relevant curriculum\n• Hands-on projects\n• Career-focused learning';
      setMessages(prev => [...prev, { type: 'bot', text: botMessage }]);
      setCurrentStep('course-contact-options');
    }, 500);
  };

  const handleInternshipSelection = (internship) => {
    addMessage(internship);
    setSelectedInternship(internship);
    
    setTimeout(() => {
      const botMessage = 'This internship focuses on real-world experience.\nDuration is 6 months with practical exposure.\nIt helps improve skills, confidence, and career readiness.';
      setMessages(prev => [...prev, { type: 'bot', text: botMessage }]);
      setCurrentStep('internship-contact-options');
    }, 500);
  };

  const handleWhatsApp = () => {
    const message = selectedCourse 
      ? `Hi! I'm interested in the ${selectedCourse} course`
      : selectedInternship
      ? `Hi! I'm interested in the ${selectedInternship} internship`
      : 'Hi! I need support from Ai Dot Skills';
    
    window.open(`https://wa.me/9079603363?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = selectedCourse 
      ? `${selectedCourse} Course Inquiry`
      : selectedInternship
      ? `${selectedInternship} Internship Inquiry`
      : 'Support Request';
    
    window.location.href = `mailto:ametapardip@gmail.com?subject=${encodeURIComponent(subject)}`;
  };

  const resetChat = () => {
    setMessages([{
      type: 'bot',
      text: 'Welcome 👋\nThanks for visiting Ai Dot Skills.\nHow can I help you today?'
    }]);
    setCurrentStep('main-options');
    setSelectedCourse('');
    setSelectedInternship('');
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-avatar">🤖</div>
              <div className="chatbot-info">
                <h3 className="chatbot-title">Ai Dot Skills Assistant</h3>
                <p className="chatbot-status">Online</p>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                className="chatbot-minimize"
                onClick={minimizeChatbot}
                aria-label="Minimize chatbot"
              >
                {isMinimized ? '▲' : '▼'}
              </button>
              <button
                className="chatbot-close"
                onClick={toggleChatbot}
                aria-label="Close chatbot"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.type === 'bot' ? 'bot-message' : 'user-message'}`}
                  >
                    <div className="message-content">
                      {message.text.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Options/Buttons */}
              <div className="chatbot-options">
                {currentStep === 'main-options' && (
                  <div className="options-grid">
                    {['Course Information', 'Internship Information', 'Contact Support'].map((option) => (
                      <button
                        key={option}
                        className="option-button primary"
                        onClick={() => handleMainOption(option)}
                      >
                        {option === 'Course Information' && '📚 '}
                        {option === 'Internship Information' && '🎯 '}
                        {option === 'Contact Support' && '💬 '}
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {currentStep === 'course-selection' && (
                  <div className="options-grid">
                    {['Web Development', 'Data Science', 'Data Analytics', 'Digital Marketing', 'Video Editing'].map((course) => (
                      <button
                        key={course}
                        className="option-button secondary"
                        onClick={() => handleCourseSelection(course)}
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                )}

                {currentStep === 'internship-selection' && (
                  <div className="options-grid">
                    {['Web Development', 'Data Science', 'Data Analytics', 'Digital Marketing', 'Video Editing'].map((internship) => (
                      <button
                        key={internship}
                        className="option-button secondary"
                        onClick={() => handleInternshipSelection(internship)}
                      >
                        {internship}
                      </button>
                    ))}
                  </div>
                )}

                {(currentStep === 'course-contact-options' || 
                  currentStep === 'internship-contact-options' || 
                  currentStep === 'contact-options') && (
                  <div className="contact-options">
                    <button
                      className="contact-button whatsapp"
                      onClick={handleWhatsApp}
                    >
                      <span className="contact-icon">💬</span>
                      WhatsApp
                    </button>
                    <button
                      className="contact-button email"
                      onClick={handleEmail}
                    >
                      <span className="contact-icon">📧</span>
                      Email
                    </button>
                  </div>
                )}

                {(currentStep === 'course-contact-options' || 
                  currentStep === 'internship-contact-options') && (
                  <button
                    className="reset-button"
                    onClick={resetChat}
                  >
                    Start New Conversation
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
