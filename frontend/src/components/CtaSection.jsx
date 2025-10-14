// src/components/CtaSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-20 px-4 text-white text-center">
      <h2 className="text-4xl font-extrabold">Ready to Start Your Wellness Journey?</h2>
      <p className="mt-4 max-w-2xl mx-auto text-white/70">
        Join thousands of users who have found peace, support, and growth with MindEase. Your mental health matters.
      </p>
      <div className="mt-8 flex justify-center space-x-4">
        <Link
          to="/login"
          className="bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold px-8 py-3 rounded-full flex items-center space-x-2"
        >
          <span>✨</span>
          <span>Get Started</span>
        </Link>
        <Link
          to="#"
          className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3 rounded-full flex items-center space-x-2"
        >
          <span>💬</span>
          <span>Try Chat Demo</span>
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;