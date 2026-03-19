// src/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import heroBackground from '../assets/hero-bg.png'; // 1. Import the background image

const HeroSection = () => {
  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center text-center text-white pt-20 relative overflow-hidden"
    >
      {/* Background image overlay that mixes with the page background */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-60"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Talk. Reflect. <span className="text-brand-green">Heal.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          With Mindy — your AI companion for mental wellness. Experience personalized emotional support anytime, anywhere.
        </p>
        <div className="mt-8 flex space-x-4">
          <Link
            to="/chat" // Changed to actual chat route
            className="bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold px-8 py-3 rounded-full flex items-center space-x-2"
          >
            <span>💬</span>
            <span>Start Chat with Mindy</span>
          </Link>
          <Link
            to="/login"
            className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3 rounded-full flex items-center space-x-2"
          >
            <span>➡️</span>
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;