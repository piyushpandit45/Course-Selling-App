import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyCourses from './pages/MyCourses';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddCourse from './pages/admin/AddCourse';
import EditCourse from './pages/admin/EditCourse';
import ManageCourses from './pages/admin/ManageCourses';
import './styles/util.css';

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Routes */}
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-course" element={<AddCourse />} />
          <Route path="/admin/edit-course/:courseId" element={<EditCourse />} />
          <Route path="/admin/manage-courses" element={<ManageCourses />} />
          
          {/* Admin Auth Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/signup" element={<Signup />} />
        </Routes>
        <WhatsAppButton isHidden={isChatbotOpen} />
        <Chatbot setIsChatbotOpen={setIsChatbotOpen} />
      </div>
    </Router>
  );
}

export default App;
