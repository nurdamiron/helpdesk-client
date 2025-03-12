// src/api/tickets.js
import api from './index';

export const ticketsApi = {
  /**
   * Get all tickets with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Object>} Tickets response
   */
  getTickets: async (params = {}) => {
    try {
      return await api.get('/tickets', params);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  /**
   * Get a ticket by ID
   * @param {string|number} id - Ticket ID
   * @returns {Promise<Object>} Ticket response
   */
  getTicketById: async (id) => {
    try {
      return await api.get(`/tickets/${id}`);
    } catch (error) {
      console.error(`Error fetching ticket #${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new ticket
   * @param {Object} ticketData - Ticket data
   * @returns {Promise<Object>} Created ticket response
   */
  createTicket: async (ticketData) => {
    try {
      return await api.post('/tickets', ticketData);
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  /**
   * Update a ticket
   * @param {string|number} id - Ticket ID
   * @param {Object} ticketData - Updated ticket data
   * @returns {Promise<Object>} Updated ticket response
   */
  updateTicket: async (id, ticketData) => {
    try {
      return await api.put(`/tickets/${id}`, ticketData);
    } catch (error) {
      console.error(`Error updating ticket #${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a ticket
   * @param {string|number} id - Ticket ID
   * @returns {Promise<Object>} Delete response
   */
  deleteTicket: async (id) => {
    try {
      return await api.delete(`/tickets/${id}`);
    } catch (error) {
      console.error(`Error deleting ticket #${id}:`, error);
      throw error;
    }
  },

  /**
   * Add a message to a ticket
   * @param {string|number} ticketId - Ticket ID
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Added message response
   */
  addMessage: async (ticketId, messageData) => {
    try {
      return await api.post(`/tickets/${ticketId}/messages`, messageData);
    } catch (error) {
      console.error(`Error adding message to ticket #${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * Upload an attachment to a ticket
   * @param {string|number} ticketId - Ticket ID
   * @param {File} file - File to upload
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Upload response
   */
  uploadAttachment: async (ticketId, file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add any additional fields
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });
      
      return await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error(`Error uploading attachment to ticket #${ticketId}:`, error);
      throw error;
    }
  }
};

export default ticketsApi;