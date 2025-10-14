// src/components/TestimonialsSection.jsx
import React from 'react';

// Placeholder user images (make sure these exist in src/assets if you use them)
import sarahImage from '../assets/sarah-johnson.jpg';
import michaelImage from '../assets/michael-chen.jpg';
import emilyImage from '../assets/emily-rodriguez.jpg';

const UserReviewCard = ({ image, name, role, review, rating }) => (
  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
    <div className="flex items-center mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4 object-cover" />
      <div>
        <h4 className="font-bold text-white">{name}</h4>
        <p className="text-sm text-white/70">{role}</p>
      </div>
    </div>
    <p className="text-white/80 italic">"{review}"</p>
    <div className="mt-4 text-brand-green">
      {Array(rating).fill(null).map((_, i) => (
        <span key={i}>⭐</span>
      ))}
    </div>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 text-white text-center">
      <h2 className="text-4xl font-extrabold">What Our Users Say</h2>
      <p className="mt-4 max-w-3xl mx-auto text-white/70">
        Real stories from people who found peace and support with MindEase
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <UserReviewCard
          image={sarahImage}
          name="Sarah Johnson"
          role="Marketing Manager"
          review="MindEase has been a game-changer for my mental health. Mindy feels like a real friend who truly understands me."
          rating={5}
        />
        <UserReviewCard
          image={michaelImage}
          name="Michael Chen"
          role="Software Developer"
          review="The mood tracking feature helped me identify stress patterns I never noticed. The insights are incredibly valuable."
          rating={5}
        />
        <UserReviewCard
          image={emilyImage}
          name="Emily Rodriguez"
          role="Teacher"
          review="Having 24/7 access to emotional support through Mindy has made such a difference in managing my daily stress."
          rating={5}
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;