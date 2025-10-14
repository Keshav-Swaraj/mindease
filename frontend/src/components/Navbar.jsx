// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'; // 1. Import hooks
import { Link } from 'react-router-dom';
import MindEaseLogo from '../assets/mindease-logo.jpg';

const Navbar = () => {
  // 2. Set up state to track scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  // 3. Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if scrolled more than 10px, false otherwise
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once

  return (
    // 4. Conditionally apply background classes
    <nav className={`fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 transition-colors duration-300 ${isScrolled ? 'bg-brand-dark/80 backdrop-blur-lg' : 'bg-transparent'}`}>
      <Link to="/" className="flex items-center space-x-2">
        <img src={MindEaseLogo} alt="MindEase Logo" className="h-10" />
      </Link>
      <div className="hidden md:flex items-center space-x-8 text-white/80">
        <Link to="/home" className="hover:text-white">Home</Link>
        <Link to="/chat" className="hover:text-white">Chat with Mindy</Link>
        <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
        <Link to="/resources" className="hover:text-white">Resources</Link>
        <Link to="/profile" className="hover:text-white">Profile</Link>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => window.location.href = '/login'} 
          className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer"
        >
          Sign In
        </button>
        <button
          onClick={() => window.location.href = '/signup'}
          className="bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold px-5 py-2 rounded-full border-none cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;