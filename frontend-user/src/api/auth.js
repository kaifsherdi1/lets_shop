import axios from './axios';

export const authAPI = {
  // Register new user
  register: async (data) => {
    const response = await axios.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (email, password, deviceName = 'web') => {
    const response = await axios.post('/auth/login', {
      email,
      password,
      device_name: deviceName,
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },

  // Get current user
  me: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (data) => {
    const response = await axios.post('/auth/verify-otp', data);
    return response.data;
  },

  // Resend OTP
  resendOtp: async (data) => {
    const response = await axios.post('/auth/resend-otp', data);
    return response.data;
  },
};
