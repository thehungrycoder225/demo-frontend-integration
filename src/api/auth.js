import api from './apiService';

export const login = async (username, password) => {
  try {
    const response = await api.post('v1/auth/login', { username, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (username, password) => {
  try {
    const response = await api.post('v1/auth/register', { username, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('v1/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
