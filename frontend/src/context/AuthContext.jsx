import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Listen for auth errors from interceptor
    const handleAuthError = () => {
      setUser(null);
    };
    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const login = async (email, password) => {
    try {
      // Adjusted based on typical FastAPI/JWT implementations or Node.js backends
      // We will assume standard JSON body login as mentioned in instructions (POST /auth/login)
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user: userData } = response.data;
      
      // Some backends return access_token, adjust if needed
      const authToken = token || response.data.access_token;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, role = 'member') => {
    try {
      const response = await api.post('/auth/signup', { name, email, password, role });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
