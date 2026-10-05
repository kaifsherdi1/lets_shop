import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Fired when the API rejects the stored token. AuthContext listens for it and
// signs the user out in-app; ProtectedRoute then sends them to /login only if
// they are on a page that needs an account. (A hard `window.location` redirect
// here used to reload the whole app and bounce visitors off public pages.)
export const AUTH_EXPIRED_EVENT = 'auth:expired';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    // A 401 from login/register just means wrong credentials — let the form show it.
    const isCredentialCheck = /\/auth\/(login|register|verify-otp|resend-otp)/.test(url);
    if (status === 401 && !isCredentialCheck && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
