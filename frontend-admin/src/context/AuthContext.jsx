import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from '../api/axios.js';

const AuthContext = createContext(null);

// Roles permitted to access the admin panel
const ALLOWED_ROLES = ['admin', 'manager', 'accountant', 'distributor', 'agent'];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_user') || 'null'); }
    catch { return null; }
  });

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password, device_name: 'Admin Browser' });
    const role = data.user?.role || '';

    if (!ALLOWED_ROLES.includes(role)) {
      throw new Error('Access denied. You do not have permission to access this panel.');
    }

    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
    axios.post('/auth/logout').catch(() => {});
  }, []);

  /**
   * Update admin user in context + localStorage (used by profile edits).
   */
  const updateUser = useCallback((updatedFields) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('admin_user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

