// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import HowItWorksSection from '../components/HowItWorksSection'; // <-- New
import TestimonialsSection from '../components/TestimonialsSection'; // <-- New
import CtaSection from '../components/CtaSection'; // <-- New
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    // The main background gradient is applied here
    <div className="bg-gradient-radial from-brand-purple via-brand-dark to-brand-dark min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <HowItWorksSection /> {/* <-- Added */}
        <TestimonialsSection /> {/* <-- Added */}
        <CtaSection /> {/* <-- Added */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;