// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MessageBubble from '../components/MessageBubble';
import SuggestedReply from '../components/SuggestedReply';
import { sendMessage, getConversationHistory, getSuggestedReplies } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history and suggested replies when component mounts
  useEffect(() => {
    const loadChatData = async () => {
      try {
        setLoading(true);
        
        // Load history and suggestions immediately
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        try {
          const token = localStorage.getItem('token');
          console.log('Loading history with token:', token ? 'Token exists' : 'No token');
          
          const historyResponse = await fetch(`http://localhost:8000/api/chat/history?limit=20`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            signal: controller.signal
          }).catch((err) => {
            console.error('Fetch error:', err);
            return null;
          });
          
          const suggestionsData = await getSuggestedReplies().catch(() => ({ suggestions: [] }));
          
          clearTimeout(timeoutId);
          
          let history = [];
          if (historyResponse) {
            console.log('History response status:', historyResponse.status, historyResponse.ok);
            if (historyResponse.ok) {
              history = await historyResponse.json();
              console.log('Loaded history:', history, 'Array length:', history?.length);
            } else {
              const errorText = await historyResponse.text();
              console.log('History response error:', errorText);
            }
          } else {
            console.log('No history response received');
          }
          
          if (history && Array.isArray(history) && history.length > 0) {
            console.log('Processing history with', history.length, 'messages');
            // Sort by created_at ascending to show chronological order
            const sortedHistory = [...history].sort((a, b) => 
              new Date(a.created_at) - new Date(b.created_at)
            );
            
            // Format messages from API response
            const formattedMessages = sortedHistory.map(msg => ({
              id: msg.id,
              text: msg.content,
              sender: msg.is_user_message ? 'User' : 'Mindy',
              timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            console.log('Setting formatted messages:', formattedMessages);
            setMessages(formattedMessages);
            console.log('Messages should be set, loading set to false');
            setLoading(false);
          } else {
            console.log('No history or empty array');
            // Set default welcome message if no history
            setMessages([{
              id: 1,
              text: "Hello! I'm Mindy, your AI wellness companion. How are you feeling today?",
              sender: 'Mindy',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setLoading(false);
          }
          
          if (suggestionsData && suggestionsData.suggestions) {
            setSuggestions(suggestionsData.suggestions);
          }
        } catch (fetchErr) {
          if (fetchErr.name !== 'AbortError') {
            console.error('Error loading chat data:', fetchErr);
          }
          // Set default welcome message on error
          setMessages([{
            id: 1,
            text: "Hello! I'm Mindy, your AI wellness companion. How are you feeling today?",
            sender: 'Mindy',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setSuggestions(["I'm feeling anxious", "I need motivation", "Help me relax", "I'm stressed about work"]);
          setLoading(false);
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error('Error loading chat data:', err);
        setMessages([{
          id: 1,
          text: "Hello! I'm Mindy, your AI wellness companion. How are you feeling today?",
          sender: 'Mindy',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setSuggestions(["I'm feeling anxious", "I need motivation", "Help me relax", "I'm stressed about work"]);
        setLoading(false);
      }
    };

    if (user) {
      loadChatData();
    }
  }, [user]);

  const handleSendMessage = async (text) => {
    const newText = text.trim();
    if (!newText || sending) return;

    const userMessage = {
      id: Date.now(),
      text: newText,
      sender: 'User',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Ensure the user's message shows immediately even if history is still loading
    setLoading(false);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSending(true);
    setTyping(true);

    try {
      // Send message to API
      const response = await sendMessage(newText);
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mindyReply = {
        id: Date.now() + 1,
        text: response.message || "Thank you for sharing. How can I help you with that?",
        sender: 'Mindy',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, mindyReply]);
      setTyping(false);
      
      // Update suggestions if available in response
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setTyping(false);
      
      // Add fallback response if API fails
      const errorReply = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'Mindy',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setSending(false);
    }
  };

  // Default suggestions if API fails
  const defaultSuggestions = ["I'm feeling anxious", "I need motivation", "Help me relax", "I'm stressed about work"];

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-4">Please Sign In</h2>
          <p className="mb-6">You need to be signed in to access the chat feature.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-brand-purple via-brand-dark to-brand-dark text-white overflow-hidden">
      {/* Chat Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm flex-shrink-0">
        <Link to="/dashboard" className="flex items-center text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-brand-teal rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Mindy</h2>
            <p className="text-xs text-white/70">AI Wellness Companion</p>
          </div>
          <div className="ml-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="flex space-x-3 text-white/70">
          <button className="hover:text-white transition-colors" title="Call">📞</button>
          <button className="hover:text-white transition-colors" title="Record">🎬</button>
          <button className="hover:text-white transition-colors" title="More">⚙️</button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)' }}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-green mx-auto mb-4"></div>
              <p className="text-white/70">Loading conversation...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-4">{error}</div>
        ) : (
          <>
            {messages.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-green to-brand-teal rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <span className="text-5xl">💬</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Start a conversation with Mindy</h3>
                <p className="text-white/70 max-w-md">
                  Your AI wellness companion is here to help you with your mental health journey.
                </p>
              </div>
            ) : (
              messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
            )}
            {typing && (
              <div className="flex items-center space-x-2 px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-white/50">Mindy is typing...</span>
              </div>
            )}
          </>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 flex-shrink-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="flex flex-wrap gap-2 mb-4">
          {(suggestions.length > 0 ? suggestions : defaultSuggestions).slice(0, 4).map(text => (
            <SuggestedReply key={text} text={text} onClick={handleSuggestionClick} />
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message to Mindy..."
              className="w-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 p-4 pr-28 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
              disabled={sending}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button 
                type="button" 
                className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                title="Voice input"
              >
                🎤
              </button>
              <button 
                type="submit" 
                className={`bg-gradient-to-r from-brand-green to-brand-teal w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${sending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`} 
                disabled={sending}
              >
                {sending ? (
                  <div className="h-6 w-6 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
