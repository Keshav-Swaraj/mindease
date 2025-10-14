// src/components/ArticleCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ tag, image, title, description, readTime }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden group">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-4 left-4 bg-brand-green/80 text-white text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-white/70 text-sm leading-relaxed">{description}</p>
        <div className="mt-4 flex justify-between items-center text-sm text-white/70">
          <span>{readTime} read</span>
          <Link to="#" className="font-semibold hover:text-white">Read More →</Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;