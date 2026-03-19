// src/services/chatService.js
const API_URL = 'http://localhost:8000/api';

/**
 * Get authentication headers with JWT token
 * @returns {Object} - Headers object with Authorization
 */
const getAuthHeaders = () => {
  // Try to get token from localStorage with fallback to mock token
  const token = localStorage.getItem('token') || "mock-token-for-development";
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Send a message to the AI chatbot
 * @param {string} message - User's message content
 * @returns {Promise} - Promise with AI response
 */
export const sendMessage = async (message) => {
  try {
    const response = await fetch(`${API_URL}/chat/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content: message, message_type: 'text' }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to send message');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Return mock data when API fails
    return {
      message: "I'm here to help you with your mental wellness. How are you feeling today?",
      suggestions: [
        "I'm feeling anxious", 
        "I need motivation", 
        "Help me relax", 
        "I'm stressed about work"
      ]
    };
  }
};

/**
 * Get conversation history
 * @param {number} limit - Number of messages to retrieve
 * @returns {Promise} - Promise with conversation history
 */
export const getConversationHistory = async (limit = 50) => {
  try {
    const response = await fetch(`${API_URL}/chat/history?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to retrieve conversation history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting conversation history:', error);
    
    // Return mock conversation history when API fails
    return {
      messages: [
        {
          id: 'mock-welcome',
          content: "Hello! I'm Mindy, your wellness companion. How are you feeling today?",
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
};

/**
 * Get suggested replies based on conversation context
 * @returns {Promise} - Promise with suggested replies
 */
export const getSuggestedReplies = async () => {
  try {
    const response = await fetch(`${API_URL}/chat/suggestions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get suggested replies');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting suggested replies:', error);
    // Return default suggestions if API fails
    return {
      suggestions: [
        "I'm feeling anxious", 
        "I need motivation", 
        "Help me relax", 
        "I'm stressed about work"
      ]
    };
  }
};