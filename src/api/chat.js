// src/api/chat.js
import api from './index';

export const chatApi = {
  // Получить данные чата с опциональными параметрами
  getChatData: (params) => {
    return api.get('/chat', params);
  },

  // Отправить сообщение в чат
  sendMessage: (data) => {
    return api.put('/chat', data);
  },

  // Обновить статус тикета в чате
  updateTicketStatus: (id, status) => {
    return api.patch(`/chat/ticket/${id}`, { status });
  },

  // Создать новую беседу/тикет
  createConversation: (data) => {
    return api.post('/chat', { conversationData: data });
  },

  // Удалить беседу
  deleteConversation: (id) => {
    return api.delete(`/chat/conversation/${id}`);
  },

  // Удалить сообщение
  deleteMessage: (id) => {
    return api.delete(`/chat/message/${id}`);
  },
  
  // Получить список контактов
  getContacts: () => {
    return api.get('/chat', { endpoint: 'contacts' });
  },
  
  // Получить список всех бесед
  getConversations: () => {
    return api.get('/chat', { endpoint: 'conversations' });
  },
  
  // Получить конкретную беседу
  getConversation: (conversationId) => {
    return api.get('/chat', { 
      endpoint: 'conversation',
      conversationId
    });
  }
};