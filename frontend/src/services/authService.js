// src/services/authService.js
const API_URL = 'http://localhost:8000/api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with registration response
 */
export const register = async (userData) => {
  try {
    console.log('Registering user with data:', userData);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
      mode: 'cors',
    });
    
    // Log the raw response for debugging
    console.log('Registration raw response:', response);
    
    const data = await response.json();
    console.log('Registration response data:', data);
    
    if (!response.ok) {
      throw new Error(data.detail || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Promise with login response including token
 */
export const login = async (credentials) => {
  try {
    console.log('Logging in with credentials:', credentials);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
      mode: 'cors',
    });
    
    console.log('Login raw response:', response);
    const data = await response.json();
    console.log('Login response data:', data);
    
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }
    
    // Store token in localStorage
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Get current user token
 * @returns {string|null} - User token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};