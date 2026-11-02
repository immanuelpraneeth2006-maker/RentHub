import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({
    isConnected: false,
    statusText: 'Checking MongoDB Atlas...',
    host: null,
  });
  const { addToast } = useToast();

  // Check backend and DB status
  const checkDatabaseHealth = useCallback(async () => {
    try {
      const res = await api.get('/auth/health');
      if (res.data?.database) {
        setDbStatus(res.data.database);
      }
    } catch (err) {
      setDbStatus({
        isConnected: false,
        statusText: 'Backend API Offline or unreachable',
        host: null,
      });
    }
  }, []);

  // Initialize user from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const stored = localStorage.getItem('renthub_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          // Verify token freshness
          try {
            const meRes = await api.get('/auth/me');
            if (meRes.data?.data) {
              const refreshed = { ...parsed, ...meRes.data.data };
              setUser(refreshed);
              localStorage.setItem('renthub_user', JSON.stringify(refreshed));
            }
          } catch (e) {
            // Token might be invalid or expired
            if (e.response?.status === 401) {
              localStorage.removeItem('renthub_user');
              setUser(null);
            }
          }
        } catch (e) {
          localStorage.removeItem('renthub_user');
        }
      }
      setLoading(false);
      checkDatabaseHealth();
    };

    initializeAuth();
  }, [checkDatabaseHealth]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('renthub_user', JSON.stringify(userData));
      addToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('renthub_user', JSON.stringify(userData));
      addToast('Account created successfully! Welcome to RentHub.', 'success');
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('renthub_user');
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await api.put('/auth/profile', updatedData);
      const updatedUser = { ...user, ...res.data.data };
      setUser(updatedUser);
      localStorage.setItem('renthub_user', JSON.stringify(updatedUser));
      addToast('Profile updated successfully!', 'success');
      return { success: true, user: updatedUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not update profile.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    loading,
    dbStatus,
    checkDatabaseHealth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

