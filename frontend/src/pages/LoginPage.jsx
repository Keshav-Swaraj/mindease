// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import MindEaseLogo from '../assets/mindease-logo.jpg';
import { login } from '../services/authService';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the login function from authService
      await login(formData);
      setIsLoading(false);
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <Link to="/">
          <img src={MindEaseLogo} alt="MindEase Logo" className="h-10 mx-auto" />
        </Link>
        <h1 className="text-3xl font-extrabold mt-4">Welcome Back</h1>
        <p className="text-white/70">Sign in to continue your wellness journey.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-white/70">Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green" 
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold py-3 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-white/70">
          Don't have an account? <Link to="/signup" className="font-semibold text-brand-green hover:underline">Sign Up</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;