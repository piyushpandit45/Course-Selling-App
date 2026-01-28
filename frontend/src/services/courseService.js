import api from '../api/api';

// Course Services
export const getAllCourses = async () => {
  try {
    const response = await api.get('/course/courses');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCourseDetails = async (courseId) => {
  try {
    const response = await api.get(`/course/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/course/create', courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await api.put(`/course/update/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await api.delete(`/course/delete/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const buyCourse = async (courseId) => {
  try {
    const response = await api.post(`/course/buy/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyBuyCoursePassword = async (courseId, password) => {
  try {
    const response = await api.post(`/course/verify-buy-password/${courseId}`, { password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Contact Services
export const submitContact = async (contactData) => {
  try {
    const response = await api.post('/contact/create', contactData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getContacts = async () => {
  try {
    const response = await api.get('/contact/contacts');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Purchase Services
export const getPurchases = async () => {
  try {
    const response = await api.get('/user/purchases');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
