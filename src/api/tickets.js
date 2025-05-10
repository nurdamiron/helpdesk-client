// src/api/tickets.js - Өтініштермен жұмыс істеуге арналған API
import api from './index';
import axios from 'axios';

export const ticketsApi = {
  /**
   * Барлық өтініштерді фильтрациямен алу
   * @param {Object} params - Фильтрация үшін сұраныс параметрлері
   * @returns {Promise<Object>} Өтініштер жауабы
   */
  getTickets: async (params = {}) => {
    try {
      return await api.get('/tickets', params);
    } catch (error) {
      console.error('Өтініштерді алу кезінде қате шықты:', error);
      throw error;
    }
  },

  /**
   * Өтінішті ID бойынша алу
   * @param {string|number} id - Өтініш ID
   * @returns {Promise<Object>} Өтініш жауабы
   */
  getTicketById: async (id) => {
    try {
      return await api.get(`/tickets/${id}`);
    } catch (error) {
      console.error(`#${id} өтінішті алу кезінде қате шықты:`, error);
      throw error;
    }
  },

  /**
   * Жаңа өтініш құру
   * @param {Object} ticketData - Өтініш деректері
   * @returns {Promise<Object>} Құрылған өтініш жауабы
   */
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return {
        status: response.status || 'success',
        message: response.message || 'Өтініш сәтті құрылды',
        email_sent: response.email_sent, // Email жіберу статусы
        ticket: response.ticket
      };
    } catch (error) {
      console.error('Өтінішті құру кезінде қате шықты:', error);
      throw error;
    }
  },

  /**
   * Өтінішті жаңарту
   * @param {string|number} id - Өтініш ID
   * @param {Object} ticketData - Жаңартылған өтініш деректері
   * @returns {Promise<Object>} Жаңартылған өтініш жауабы
   */
  updateTicket: async (id, ticketData) => {
    try {
      return await api.put(`/tickets/${id}`, ticketData);
    } catch (error) {
      console.error(`#${id} өтінішті жаңарту кезінде қате шықты:`, error);
      throw error;
    }
  },

  /**
   * Өтініш статусын жаңарту
   * @param {string|number} id - Өтініш ID
   * @param {string} status - Жаңа статус
   * @returns {Promise<Object>} Жаңартылған өтініш жауабы
   */
  updateTicketStatus: async (id, status) => {
    try {
      // Прямой вызов axios для отправки запроса без аутентификации
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
      const response = await axios.patch(`${API_URL}/tickets/${id}/status`, { status }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error(`#${id} өтініш статусын жаңарту кезінде қате шықты:`, error);
      throw error;
    }
  },

  /**
   * Өтінішті жою
   * @param {string|number} id - Өтініш ID
   * @returns {Promise<Object>} Жою жауабы
   */
  deleteTicket: async (id) => {
    try {
      return await api.delete(`/tickets/${id}`);
    } catch (error) {
      console.error(`#${id} өтінішті жою кезінде қате шықты:`, error);
      throw error;
    }
  },

  /**
   * Өтінішке хабарлама қосу
   * @param {string|number} ticketId - Өтініш ID
   * @param {Object} messageData - Хабарлама деректері
   * @returns {Promise<Object>} Қосылған хабарлама жауабы
   */
  addMessage: async (ticketId, messageData) => {
    try {
      return await api.post(`/tickets/${ticketId}/messages`, messageData);
    } catch (error) {
      console.error(`#${ticketId} өтінішке хабарлама қосу кезінде қате шықты:`, error);
      throw error;
    }
  },

  /**
   * Өтініштің хабарламаларын алу
   * @param {string|number} ticketId - Өтініш ID
   * @returns {Promise<Object>} Хабарламалар жауабы
   */
  getTicketMessages: async (ticketId) => {
    try {
      return await api.get(`/tickets/${ticketId}/messages`);
    } catch (error) {
      console.error(`#${ticketId} өтініштің хабарламаларын алу кезінде қате шықты:`, error);
      throw error;
    }
  },

  /**
   * Хабарламаларды оқылған ретінде белгілеу
   * @param {string|number} ticketId - Өтініш ID
   * @returns {Promise<Object>} Операция жауабы
   */
  markMessagesAsRead: async (ticketId) => {
    try {
      return await api.put(`/tickets/${ticketId}/messages/read`);
    } catch (error) {
      console.error(`#${ticketId} өтініш хабарламаларын оқылған деп белгілеу кезінде қате шықты:`, error);
      throw error;
    }
  },

  /**
   * Өтінішке файл тіркеу
   * @param {string|number} ticketId - Өтініш ID
   * @param {File} file - Жүктелетін файл
   * @param {Object} options - Қосымша опциялар
   * @returns {Promise<Object>} Жүктеу жауабы
   */
  uploadAttachment: async (ticketId, file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Қосымша өрістерді қосу
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });
      
      return await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error(`#${ticketId} өтінішке файл тіркеу кезінде қате шықты:`, error);
      throw error;
    }
  }
};

export default ticketsApi;