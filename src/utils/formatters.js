// src/utils/formatters.js - Пішімдеушілер
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES } from './constants';

/**
 * Күн мен уақытты пішімдеу
 * @param {string|Date} date - Пішімделетін күн
 * @param {string} formatString - Пішім жолы (әдепкі DD.MM.YYYY HH:mm)
 * @returns {string} - Пішімделген күн
 */
export const formatDate = (date, formatString = 'dd.MM.yyyy HH:mm') => {
  if (!date) return 'Көрсетілмеген';
  return format(new Date(date), formatString, { locale: ru });
};

/**
 * Өтініш күйін көрсету үшін пішімдеу
 * @param {string} status - Күй коды
 * @returns {Object} - Аудармасы мен түсі бар нысан
 */
export const formatTicketStatus = (status) => {
  switch (status) {
    case 'new':
      return { text: 'Жаңа', color: 'info' };
    case 'in_progress':
      return { text: 'Өңделуде', color: 'warning' };
    case 'resolved':
      return { text: 'Шешілді', color: 'success' };
    case 'closed':
      return { text: 'Жабылды', color: 'default' };
    default:
      return { text: status || 'Белгісіз', color: 'default' };
  }
};

/**
 * Өтініш басымдығын көрсету үшін пішімдеу
 * @param {string} priority - Басымдық коды
 * @returns {Object} - Аудармасы мен түсі бар нысан
 */
export const formatTicketPriority = (priority) => {
  switch (priority) {
    case 'low':
      return { text: 'Төмен', color: 'success' };
    case 'medium':
      return { text: 'Орташа', color: 'info' };
    case 'high':
      return { text: 'Жоғары', color: 'warning' };
    case 'urgent':
      return { text: 'Шұғыл', color: 'error' };
    default:
      return { text: priority || 'Стандартты', color: 'info' };
  }
};

/**
 * Қосымша бағанды жергілікті өңдеу мүмкіндігімен өтініш пішімдеу
 * @param {Object} ticket - Өтініш нысаны
 * @param {Object} options - Пішімдеу параметрлері
 * @returns {Object} - Метадеректермен пішімделген өтініш
 */
export const formatTicket = (ticket, options = {}) => {
  // Егер өтініш болмаса, бос нысан қайтарамыз
  if (!ticket) return {};
  
  // Күйі мен басымдықты пішімдеу
  const status = formatTicketStatus(ticket.status);
  const priority = formatTicketPriority(ticket.priority);
  
  // Метадеректерді талдау (егер JSON жолы болса)
  let metadata = ticket.metadata;
  if (typeof metadata === 'string' && metadata) {
    try {
      metadata = JSON.parse(metadata);
    } catch (e) {
      console.error('Метадеректерді талдау қатесі:', e);
      metadata = {};
    }
  }

  // Өтініш берушінің метадеректерін талдау (егер JSON жолы болса)
  let requesterMetadata = ticket.requester_metadata;
  if (typeof requesterMetadata === 'string' && requesterMetadata) {
    try {
      requesterMetadata = JSON.parse(requesterMetadata);
    } catch (e) {
      console.error('Өтініш беруші метадеректерін талдау қатесі:', e);
      requesterMetadata = {};
    }
  }
  
  // Пішімделген өтінішті қайтару
  return {
    ...ticket,
    statusText: status.text,
    statusColor: status.color,
    priorityText: priority.text,
    priorityColor: priority.color,
    metadata: metadata || {},
    requesterMetadata: requesterMetadata || {},
    ...options
  };
};

/**
 * Форматирует время, прошедшее с указанной даты, например "5 минут назад"
 * @param {string|Date} date - Дата
 * @returns {string} - Отформатированная строка временного промежутка
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
};

/**
 * Форматирует категорию тикета для отображения
 * @param {string} category - Код категории
 * @returns {string} - Локализованный текст категории
 */
export const formatTicketCategory = (category) => {
  switch (category) {
    case 'general':
      return 'Общий вопрос';
    case 'technical':
      return 'Техническая проблема';
    case 'billing':
      return 'Вопрос по оплате';
    case 'feature':
      return 'Запрос функционала';
    case 'bug':
      return 'Отчёт об ошибке';
    default:
      return category || 'Другое';
  }
};

// src/utils/constants.js
export const TICKET_STATUSES = [
  { value: 'new', label: 'Жаңа', color: 'info' },
  { value: 'in_progress', label: 'Өңделуде', color: 'warning' },
  { value: 'resolved', label: 'Шешілді', color: 'success' },
  { value: 'closed', label: 'Жабылды', color: 'default' },
];

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Төмен', color: 'success' },
  { value: 'medium', label: 'Орташа', color: 'info' },
  { value: 'high', label: 'Жоғары', color: 'warning' },
  { value: 'urgent', label: 'Шұғыл', color: 'error' },
];

export const TICKET_CATEGORIES = [
  { value: 'general', label: 'Жалпы сұрақ' },
  { value: 'technical', label: 'Техникалық мәселе' },
  { value: 'billing', label: 'Төлем сұрағы' },
  { value: 'feature', label: 'Функционал сұрауы' },
  { value: 'bug', label: 'Қате туралы хабарлама' },
  { value: 'other', label: 'Басқа' },
];