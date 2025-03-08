// src/api/tickets.js
import api from './index';

export const ticketsApi = {
  // Получить все тикеты с опциональной фильтрацией
  getAllTickets: (params = {}) => {
    return api.get('/tickets', params);
  },

  // Получить конкретный тикет по ID
  getTicketById: (id) => {
    return api.get(`/tickets/${id}`);
  },

  // Создать новый тикет
  createTicket: (ticketData) => {
    return api.post('/tickets', ticketData);
  },

  // Обновить существующий тикет
  updateTicket: (id, ticketData) => {
    return api.put(`/tickets/${id}`, ticketData);
  },

  // Обновить статус тикета
  updateTicketStatus: (id, status) => {
    return api.patch(`/tickets/${id}`, { status });
  },

  // Удалить тикет
  deleteTicket: (id) => {
    return api.delete(`/tickets/${id}`);
  },
  
  // Добавить комментарий к тикету
  addComment: (ticketId, comment) => {
    return api.post(`/tickets/${ticketId}/comments`, { comment });
  },
  
  // Загрузить приложение к тикету
  uploadAttachment: (ticketId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(`/tickets/${ticketId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

