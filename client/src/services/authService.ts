import axios from 'axios';
import { API_URL } from '../config/constants';

const API = axios.create({ baseURL: API_URL });

// Interceptor to include token in requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const login = async (email: string, password: string) => {
  const response = await API.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const register = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const checkAuth = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

const authService = {
  login,
  register,
  logout,
  checkAuth,
};

export default authService;
