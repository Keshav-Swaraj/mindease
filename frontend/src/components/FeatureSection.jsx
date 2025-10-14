
import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
    <div className="mx-auto w-16 h-16 mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-green to-brand-teal">
      <span className="text-3xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="mt-2 text-white/70">{description}</p>
  </div>
);

const FeatureSection = () => {
  return (
    <section className="py-20 px-4 text-white text-center">
      <h2 className="text-4xl font-extrabold">Powerful Features for Your Mental Wellness</h2>
      <p className="mt-4 max-w-3xl mx-auto text-white/70">
        Discover comprehensive tools designed to support your mental health journey with personalized insights and AI-powered guidance.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <FeatureCard icon="😊" title="Mood Tracking" description="Track your emotions and discover patterns in your mental wellness journey." />
        <FeatureCard icon="🤖" title="AI Companion" description="Chat with Mindy, your personal AI wellness companion available 24/7." />
        <FeatureCard icon="📊" title="Wellness Insights" description="Get personalized insights and recommendations based on your data." />
        <FeatureCard icon="🌙" title="Sleep & Activity" description="Monitor your sleep patterns and daily activities for better wellness." />
      </div>
    </section>
  );
};

export default FeatureSection;