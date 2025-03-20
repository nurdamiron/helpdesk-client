// src/api/messagesApi.js
import api from './index';

/**
 * API-сервис для работы с сообщениями и вложениями
 */
export const messagesApi = {
  /**
   * Получить сообщения тикета
   * @param {number|string} ticketId - ID тикета
   * @returns {Promise<Object>} Ответ с сообщениями
   */
  getTicketMessages: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/messages`);
      return response;
    } catch (error) {
      console.error(`Error fetching messages for ticket #${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * Добавить сообщение к тикету
   * @param {number|string} ticketId - ID тикета
   * @param {Object} messageData - Данные сообщения (content, attachments)
   * @returns {Promise<Object>} Созданное сообщение
   */
  addMessage: async (ticketId, messageData) => {
    try {
      // Ensure the structure is correct
      const data = {
        content: messageData.content || messageData.body || '',
        attachments: messageData.attachments || []
      };
      
      const response = await api.post(`/tickets/${ticketId}/messages`, data);
      return response;
    } catch (error) {
      console.error(`Error adding message to ticket #${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * Отметить сообщения тикета как прочитанные
   * @param {number|string} ticketId - ID тикета
   * @returns {Promise<Object>} Ответ сервера
   */
  markMessagesAsRead: async (ticketId) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/messages/read`);
      return response;
    } catch (error) {
      console.error(`Error marking messages as read for ticket #${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * Изменить статус сообщения
   * @param {number|string} ticketId - ID тикета
   * @param {number|string} messageId - ID сообщения
   * @param {string} status - Новый статус ('delivered' или 'read')
   * @returns {Promise<Object>} Обновленное сообщение
   */
  updateMessageStatus: async (ticketId, messageId, status) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/messages/${messageId}/status`, { status });
      return response;
    } catch (error) {
      console.error(`Error updating message #${messageId} status:`, error);
      throw error;
    }
  },

  /**
   * Загрузить вложение
   * @param {number|string} ticketId - ID тикета
   * @param {File} file - Файл для загрузки
   * @param {Object} options - Дополнительные опции
   * @returns {Promise<Object>} Загруженное вложение
   */
  uploadAttachment: async (ticketId, file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add any additional fields
      Object.keys(options).forEach(key => {
        if (key !== 'onUploadProgress') {
          formData.append(key, options[key]);
        }
      });
      
      const response = await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: options.onUploadProgress
      });
      
      return response;
    } catch (error) {
      console.error(`Error uploading attachment to ticket #${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * Получить непрочитанные сообщения
   * @param {Object} params - Параметры запроса (userId, userType)
   * @returns {Promise<Object>} Непрочитанные сообщения
   */
  getUnreadMessages: async (params = {}) => {
    try {
      const response = await api.get('/messages/unread', { params });
      return response;
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      throw error;
    }
  }
};

export default messagesApi;