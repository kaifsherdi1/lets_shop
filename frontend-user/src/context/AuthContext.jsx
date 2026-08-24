import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const data = await authAPI.me();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // If 401 Unauthorized (token expired), auto-logout
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      // Silently ignore logout API errors (token may be expired)
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  /**
   * Update the user in context + localStorage after profile edits.
   * Call this from the Profile page after a successful PUT /profile response.
   */
  const updateUser = (updatedFields) => {
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
  };

  /**
   * Force a fresh user fetch from the server (e.g., after email verification).
   */
  const refreshUser = () => fetchUser();

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

