// src/api/chat.js
import api from './index';

export const chatApi = {
  /**
   * Get chat data with optional parameters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Chat data response
   */
  getChatData: async (params = {}) => {
    try {
      return await api.get('/chat', { params });
    } catch (error) {
      console.error('Error fetching chat data:', error);
      throw error;
    }
  },

  /**
   * Send a message in a conversation
   * @param {Object} data - Message data including conversationId and messageData
   * @returns {Promise<Object>} Send message response
   */
  sendMessage: async (data) => {
    try {
      return await api.put('/chat', data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Update ticket status in chat
   * @param {string|number} id - Ticket ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Update status response
   */
  updateTicketStatus: async (id, status) => {
    try {
      return await api.patch(`/chat/ticket/${id}`, { status });
    } catch (error) {
      console.error(`Error updating ticket #${id} status:`, error);
      throw error;
    }
  },

  /**
   * Create a new conversation/ticket
   * @param {Object} conversationData - Conversation data
   * @returns {Promise<Object>} Created conversation response
   */
  createConversation: async (conversationData) => {
    try {
      return await api.post('/chat', { conversationData });
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  /**
   * Delete a conversation
   * @param {string|number} id - Conversation ID
   * @returns {Promise<Object>} Delete response
   */
  deleteConversation: async (id) => {
    try {
      return await api.delete(`/chat/conversation/${id}`);
    } catch (error) {
      console.error(`Error deleting conversation #${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a message
   * @param {string|number} id - Message ID
   * @returns {Promise<Object>} Delete response
   */
  deleteMessage: async (id) => {
    try {
      return await api.delete(`/chat/message/${id}`);
    } catch (error) {
      console.error(`Error deleting message #${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get contacts list
   * @returns {Promise<Object>} Contacts response
   */
  getContacts: async () => {
    try {
      return await api.get('/chat', { params: { endpoint: 'contacts' } });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  
  /**
   * Get all conversations
   * @returns {Promise<Object>} Conversations response
   */
  getConversations: async () => {
    try {
      return await api.get('/chat', { params: { endpoint: 'conversations' } });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific conversation
   * @param {string|number} conversationId - Conversation ID
   * @returns {Promise<Object>} Conversation response
   */
  getConversation: async (conversationId) => {
    try {
      return await api.get('/chat', { 
        params: { 
          endpoint: 'conversation',
          conversationId
        }
      });
    } catch (error) {
      console.error(`Error fetching conversation #${conversationId}:`, error);
      throw error;
    }
  },

  /**
   * Upload a file attachment to chat
   * @param {string|number} conversationId - Conversation ID
   * @param {File} file - File to upload
   * @returns {Promise<Object>} Upload response
   */
  uploadAttachment: async (conversationId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);
      
      return await api.post('/chat/attachments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error(`Error uploading file to conversation #${conversationId}:`, error);
      throw error;
    }
  }
};

export default chatApi;