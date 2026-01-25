import api from '../api/api';

// User Authentication
export const userSignup = async (userData) => {
  try {
    const response = await api.post('/User/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const userLogin = async (credentials) => {
  try {
    const response = await api.post('/User/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const userLogout = async () => {
  try {
    const response = await api.get('/User/logout');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserPurchases = async () => {
  try {
    const response = await api.get('/User/purchases');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Admin Authentication
export const adminSignup = async (adminData) => {
  try {
    const response = await api.post('/admin/signup', adminData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const adminLogout = async () => {
  try {
    const response = await api.get('/admin/logout');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
