// src/components/AppNavbar.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import MindEaseLogo from '../assets/mindease-logo.jpg';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors";
  const activeLinkClasses = "bg-white/10 text-white";

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src={MindEaseLogo} alt="MindEase Logo" className="h-12" />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2 bg-black/20 p-2 rounded-full">
          <NavLink to="/home" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
          <NavLink to="/chat" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Chat with Mindy</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Dashboard</NavLink>
          <NavLink to="/resources" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Resources</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Profile</NavLink>
        </nav>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <button 
              onClick={handleSignOut}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2 rounded-full text-sm transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="text-white/80 hover:text-white text-sm bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold px-5 py-2 rounded-full text-sm border-none cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;