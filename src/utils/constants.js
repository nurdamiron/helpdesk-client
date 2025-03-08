// src/utils/constants.js

// Статусы тикетов
export const TICKET_STATUSES = [
    { value: 'new', label: 'Новая заявка', color: 'info' },
    { value: 'in_progress', label: 'В работе', color: 'warning' },
    { value: 'pending', label: 'Ожидание материалов/решения', color: 'secondary' },
    { value: 'inspection', label: 'На проверке', color: 'primary' },
    { value: 'resolved', label: 'Выполнено', color: 'success' },
    { value: 'closed', label: 'Закрыто', color: 'default' },
  ];
  
  // Приоритеты заявок
  export const TICKET_PRIORITIES = [
    { value: 'low', label: 'Низкий', color: 'success' },
    { value: 'medium', label: 'Средний', color: 'info' },
    { value: 'high', label: 'Высокий', color: 'warning' },
    { value: 'urgent', label: 'Срочный', color: 'error' },
  ];
  
  // Категории заявок для строительной компании
  export const TICKET_CATEGORIES = [
    { value: 'repair', label: 'Ремонтные работы' },
    { value: 'plumbing', label: 'Сантехника' },
    { value: 'electrical', label: 'Электрика' },
    { value: 'construction', label: 'Строительство' },
    { value: 'design', label: 'Проектирование' },
    { value: 'consultation', label: 'Консультация' },
    { value: 'estimate', label: 'Смета и расчеты' },
    { value: 'materials', label: 'Материалы' },
    { value: 'warranty', label: 'Гарантийный случай' },
    { value: 'other', label: 'Другое' },
  ];
  
  // Типы объектов
  export const PROPERTY_TYPES = [
    { value: 'apartment', label: 'Квартира' },
    { value: 'house', label: 'Частный дом' },
    { value: 'office', label: 'Офис' },
    { value: 'commercial', label: 'Коммерческое помещение' },
    { value: 'land', label: 'Земельный участок' },
    { value: 'other', label: 'Другое' },
  ];
  
  // Услуги строительной компании
  export const SERVICES = [
    { value: 'construction', label: 'Строительство' },
    { value: 'renovation', label: 'Ремонт' },
    { value: 'design', label: 'Проектирование' },
    { value: 'maintenance', label: 'Обслуживание' },
    { value: 'consultation', label: 'Консультация' },
  ];
  
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
   * Форматирует статус заявки для отображения
   * @param {string} status - Код статуса
   * @returns {Object} - Объект с локализованным текстом и цветом
   */
  export const formatTicketStatus = (status) => {
    const statusObj = TICKET_STATUSES.find(s => s.value === status);
    return statusObj || { text: status || 'Неизвестно', color: 'default' };
  };
  
  /**
   * Форматирует приоритет заявки для отображения
   * @param {string} priority - Код приоритета
   * @returns {Object} - Объект с локализованным текстом и цветом
   */
  export const formatTicketPriority = (priority) => {
    const priorityObj = TICKET_PRIORITIES.find(p => p.value === priority);
    return priorityObj || { text: priority || 'Стандартный', color: 'info' };
  };
  
  /**
   * Форматирует категорию заявки для отображения
   * @param {string} category - Код категории
   * @returns {string} - Локализованный текст категории
   */
  export const formatTicketCategory = (category) => {
    const categoryObj = TICKET_CATEGORIES.find(c => c.value === category);
    return categoryObj?.label || category || 'Другое';
  };
  
  /**
   * Форматирует тип объекта для отображения
   * @param {string} propertyType - Код типа объекта
   * @returns {string} - Локализованный текст типа объекта
   */
  export const formatPropertyType = (propertyType) => {
    const typeObj = PROPERTY_TYPES.find(t => t.value === propertyType);
    return typeObj?.label || propertyType || 'Другое';
  };
  
  /**
   * Форматирует цену в рублях
   * @param {number} value - Сумма
   * @returns {string} - Отформатированная сумма с символом валюты
   */
  export const formatCurrency = (value) => {
    if (value === undefined || value === null) return '—';
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  /**
   * Форматирует строку в формат для URL (slug)
   * @param {string} text - Исходный текст
   * @returns {string} - Форматированная строка для URL
   */
  export const slugify = (text) => {
    const translitMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
      'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
  
    return text.toLowerCase()
      .replace(/[^а-яёa-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .split('')
      .map(char => translitMap[char] || char)
      .join('')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };