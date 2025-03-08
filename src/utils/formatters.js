// src/utils/formatters.js
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматирует дату и время
 * @param {string|Date} date - Дата для форматирования
 * @param {string} formatString - Строка формата (по умолчанию DD.MM.YYYY HH:mm)
 * @returns {string} - Отформатированная дата
 */
export const formatDate = (date, formatString = 'dd.MM.yyyy HH:mm') => {
  if (!date) return 'Не указано';
  return format(new Date(date), formatString, { locale: ru });
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
 * Форматирует статус тикета для отображения
 * @param {string} status - Код статуса
 * @returns {Object} - Объект с локализованным текстом и цветом
 */
export const formatTicketStatus = (status) => {
  switch (status) {
    case 'new':
      return { text: 'Новый', color: 'info' };
    case 'in_progress':
      return { text: 'В обработке', color: 'warning' };
    case 'resolved':
      return { text: 'Решён', color: 'success' };
    case 'closed':
      return { text: 'Закрыт', color: 'default' };
    default:
      return { text: status || 'Неизвестно', color: 'default' };
  }
};

/**
 * Форматирует приоритет тикета для отображения
 * @param {string} priority - Код приоритета
 * @returns {Object} - Объект с локализованным текстом и цветом
 */
export const formatTicketPriority = (priority) => {
  switch (priority) {
    case 'low':
      return { text: 'Низкий', color: 'success' };
    case 'medium':
      return { text: 'Средний', color: 'info' };
    case 'high':
      return { text: 'Высокий', color: 'warning' };
    case 'urgent':
      return { text: 'Срочный', color: 'error' };
    default:
      return { text: priority || 'Стандартный', color: 'info' };
  }
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
  { value: 'new', label: 'Новый', color: 'info' },
  { value: 'in_progress', label: 'В обработке', color: 'warning' },
  { value: 'resolved', label: 'Решён', color: 'success' },
  { value: 'closed', label: 'Закрыт', color: 'default' },
];

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Низкий', color: 'success' },
  { value: 'medium', label: 'Средний', color: 'info' },
  { value: 'high', label: 'Высокий', color: 'warning' },
  { value: 'urgent', label: 'Срочный', color: 'error' },
];

export const TICKET_CATEGORIES = [
  { value: 'general', label: 'Общий вопрос' },
  { value: 'technical', label: 'Техническая проблема' },
  { value: 'billing', label: 'Вопрос по оплате' },
  { value: 'feature', label: 'Запрос функционала' },
  { value: 'bug', label: 'Отчёт об ошибке' },
  { value: 'other', label: 'Другое' },
];