// src/components/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message }) => {
  const isMindy = message.sender === 'Mindy';

  return (
    <div className={`flex mb-4 ${isMindy ? 'justify-start' : 'justify-end'}`}>
      <div className={`p-4 rounded-2xl max-w-lg ${isMindy ? 'bg-white/10 rounded-bl-none' : 'bg-brand-green/50 rounded-br-none'}`}>
        <p className="text-white">{message.text}</p>
        <p className="text-xs text-white/50 mt-2 text-right">{message.timestamp}</p>
      </div>
    </div>
  );
};

export default MessageBubble;