// src/components/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message, sender, timestamp }) => {
  // Support both direct props and message object format
  const isMindy = (sender || message.sender) === 'Mindy';
  const messageText = typeof message === 'string' ? message : message.text;
  const messageTime = timestamp || message.timestamp;

  return (
    <div className={`flex mb-4 ${isMindy ? 'justify-start' : 'justify-end'}`}>
      <div className={`p-4 rounded-2xl max-w-lg ${isMindy ? 'bg-white/10 rounded-bl-none' : 'bg-brand-green/50 rounded-br-none'}`}>
        <p className="text-white">{messageText}</p>
        <p className="text-xs text-white/50 mt-2 text-right">{messageTime}</p>
      </div>
    </div>
  );
};

export default MessageBubble;