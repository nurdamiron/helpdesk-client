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
      return await api.get(`/tickets/${ticketId}/messages`);
    } catch (error) {
      console.error(`Error fetching messages for ticket #${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * Добавить сообщение к тикету
   * @param {number|string} ticketId - ID тикета
   * @param {Object} messageData - Данные сообщения
   * @returns {Promise<Object>} Созданное сообщение
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
   * Отметить сообщения тикета как прочитанные
   * @param {number|string} ticketId - ID тикета
   * @returns {Promise<Object>} Ответ сервера
   */
  markMessagesAsRead: async (ticketId) => {
    try {
      return await api.put(`/tickets/${ticketId}/messages/read`);
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
      return await api.put(`/tickets/${ticketId}/messages/${messageId}/status`, { status });
    } catch (error) {
      console.error(`Error updating message #${messageId} status:`, error);
      throw error;
    }
  },

  /**
   * Загрузить вложение
   * @param {number|string} ticketId - ID тикета
   * @param {File} file - Файл для загрузки
   * @param {Object} options - Дополнительные опции (onUploadProgress и т.д.)
   * @returns {Promise<Object>} Загруженное вложение
   */
  uploadAttachment: async (ticketId, file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Добавляем любые дополнительные поля
      Object.keys(options).forEach(key => {
        if (key !== 'onUploadProgress') {
          formData.append(key, options[key]);
        }
      });
      
      return await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: options.onUploadProgress
      });
    } catch (error) {
      console.error(`Error uploading attachment to ticket #${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * Получить непрочитанные сообщения
   * @param {Object} params - Параметры запроса
   * @returns {Promise<Object>} Непрочитанные сообщения
   */
  getUnreadMessages: async (params = {}) => {
    try {
      return await api.get('/messages/unread', { params });
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      throw error;
    }
  }
};

export default messagesApi;