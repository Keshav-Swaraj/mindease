// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import MindEaseLogo from '../assets/mindease-logo.jpg';
import { register } from '../services/authService';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    date_of_birth: ''
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
    
    console.log('Form submitted with data:', formData);
    
    // Validate form data
    if (!formData.first_name || !formData.last_name || !formData.email || 
        !formData.username || !formData.password || !formData.date_of_birth) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    try {
      // Direct fetch implementation with proper CORS settings
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(formData)
      });
      
      console.log('Registration response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      setIsLoading(false);
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <Link to="/">
          <img src={MindEaseLogo} alt="MindEase Logo" className="h-10 mx-auto" />
        </Link>
        <h1 className="text-3xl font-extrabold mt-4">Create Your Account</h1>
        <p className="text-white/70">Start your journey with MindEase today.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/70">First Name</label>
              <input 
                type="text" 
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green" 
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70">Last Name</label>
              <input 
                type="text" 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green" 
                required
              />
            </div>
          </div>
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
            <label className="text-sm font-medium text-white/70">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green" 
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70">Date of Birth</label>
            <input 
              type="date" 
              name="date_of_birth"
              value={formData.date_of_birth}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-white/70">
          Already have an account? <Link to="/login" className="font-semibold text-brand-green hover:underline">Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;