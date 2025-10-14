// src/components/HelpCard.jsx
import React from 'react';

const HelpCard = ({ title, description, tag, number }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-white/70 mt-1">{description}</p>
        <span className="inline-block mt-4 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
        <p className="text-3xl font-bold text-white mt-4">{number}</p>
      </div>
      <a href={`tel:${number}`} className="bg-gradient-to-r from-brand-green to-brand-teal text-white font-semibold px-6 py-3 rounded-full self-end">
        Call Now
      </a>
    </div>
  );
};

export default HelpCard;