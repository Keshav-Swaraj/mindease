// src/components/Layout.jsx
import React from 'react';
import AppNavbar from './AppNavbar'; // Import the new AppNavbar

const Layout = ({ children }) => {
  return (
    // The main background for all authenticated app pages
    <div className="bg-gradient-radial from-brand-purple via-brand-dark to-brand-dark min-h-screen text-white">
      <AppNavbar />
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;