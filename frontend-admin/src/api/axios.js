import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// No default Content-Type: axios picks JSON for plain objects and the correct
// multipart boundary for FormData. Forcing 'application/json' made axios
// JSON-encode FormData, turning every uploaded product image into `{}`.
const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { Accept: 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginAttempt = /\/auth\/login/.test(err.config?.url || '');
    // An expired/revoked session: back to the sign-in screen. A 401 from the
    // login request itself is just "wrong password" — let the form show it.
    if (err.response?.status === 401 && !isLoginAttempt) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export default instance;
