// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated, logout, getToken } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on load
  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      if (token) {
        setUser({ token });
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;