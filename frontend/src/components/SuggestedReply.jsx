// src/components/SuggestedReply.jsx
import React from 'react';

const SuggestedReply = ({ text, onClick }) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="bg-white/10 border border-white/20 text-white/80 px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-colors"
    >
      {text}
    </button>
  );
};

export default SuggestedReply;