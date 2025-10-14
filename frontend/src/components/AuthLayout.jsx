// src/components/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="bg-gradient-radial from-brand-purple via-brand-dark to-brand-dark min-h-screen flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;