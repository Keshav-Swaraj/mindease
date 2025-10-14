// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <-- ADD THIS LINE
import MindEaseLogo from '../assets/mindease-logo.jpg'; // <-- Import your logo

const Footer = () => {
  return (
    <footer className="bg-brand-light text-gray-600">
      <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-start">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <img src={MindEaseLogo} alt="MindEase Logo" className="h-8" />
          </Link>
          <p className="mt-2 text-sm">Your AI companion for mental wellness. Experience personalized emotional support anytime, anywhere.</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-brand-dark">f</a>
            <a href="#" className="hover:text-brand-dark">t</a>
            <a href="#" className="hover:text-brand-dark">i</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-brand-dark">Product</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Features</a></li>
            <li><a href="#" className="hover:underline">Chat with Mindy</a></li>
            <li><a href="#" className="hover:underline">Dashboard</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-brand-dark">Support</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-brand-dark">Company</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4">
        <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} MindEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;