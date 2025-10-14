// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MessageBubble from '../components/MessageBubble';
import SuggestedReply from '../components/SuggestedReply';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Mindy, your AI wellness companion. How are you feeling today?", sender: 'Mindy', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text) => {
    const newText = text.trim();
    if (!newText) return;

    const userMessage = {
      id: messages.length + 1,
      text: newText,
      sender: 'User',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate Mindy's reply
    setTimeout(() => {
      const mindyReply = {
        id: messages.length + 2,
        text: "Thank you for sharing. It's brave to talk about your feelings. How can I help you with that?",
        sender: 'Mindy',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mindyReply]);
    }, 1500);
  };

  const suggestions = ["I'm feeling anxious", "I need motivation", "Help me relax", "I'm stressed about work"];

  return (
    <div className="flex flex-col h-screen bg-gradient-radial from-brand-purple via-brand-dark to-brand-dark text-white font-sans">
      {/* Chat Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
        <Link to="/dashboard" className="text-white/80 hover:text-white">← Back to Home</Link>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center font-bold">M</div>
          <div>
            <h2 className="font-bold">Mindy</h2>
            <p className="text-xs text-white/70">Your AI Wellness Companion</p>
          </div>
        </div>
        <div className="flex space-x-4 text-white/80">
          <span>📞</span>
          <span>🎬</span>
          <span>...</span>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 flex-shrink-0">
        <div className="flex space-x-2 mb-4">
          {suggestions.map(text => (
            <SuggestedReply key={text} text={text} onClick={handleSendMessage} />
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message to Mindy..."
              className="w-full bg-black/30 text-white placeholder-white/50 p-4 pr-24 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
              <button type="button" className="text-white/70 hover:text-white">🎤</button>
              <button type="submit" className="bg-brand-green w-10 h-10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;