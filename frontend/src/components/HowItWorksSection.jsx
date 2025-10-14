// src/components/HowItWorksSection.jsx
import React from 'react';

const StepCard = ({ number, icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center relative">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-white/20">
      {number}
    </div>
    <div className="mx-auto w-16 h-16 mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-green to-brand-teal">
      <span className="text-3xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-white mt-4">{title}</h3>
    <p className="mt-2 text-white/70">{description}</p>
  </div>
);

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 text-white text-center">
      <h2 className="text-4xl font-extrabold">How MindEase Works</h2>
      <p className="mt-4 max-w-3xl mx-auto text-white/70">
        Simple steps to start your mental wellness journey with AI-powered support
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
        <StepCard number="01" icon="👋" title="Sign Up & Meet Mindy" description="Create your account and get introduced to Mindy, your personal AI wellness companion." />
        <div className="hidden md:flex absolute top-1/2 left-1/3 w-1/6 h-0.5 bg-white/20 transform -translate-y-1/2 justify-center items-center">
            <span className="text-white text-2xl rotate-90 md:rotate-0">→</span>
        </div>
        <StepCard number="02" icon="🧡" title="Track Your Mood" description="Log your daily emotions and activities to help Mindy understand your patterns." />
        <div className="hidden md:flex absolute top-1/2 left-2/3 w-1/6 h-0.5 bg-white/20 transform -translate-y-1/2 justify-center items-center">
            <span className="text-white text-2xl rotate-90 md:rotate-0">→</span>
        </div>
        <StepCard number="03" icon="💡" title="Get Personalized Insights" description="Receive AI-powered recommendations and support tailored to your unique needs." />
      </div>
    </section>
  );
};

export default HowItWorksSection;