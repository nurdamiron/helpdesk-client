// src/utils/constants.js

// Тикет статустары
export const TICKET_STATUSES = [
    { value: 'new', label: 'Жаңа өтініш', color: 'info' },
    { value: 'in_progress', label: 'Өңделуде', color: 'warning' },
    { value: 'pending', label: 'Материалдар/шешім күтілуде', color: 'secondary' },
    { value: 'inspection', label: 'Тексеруде', color: 'primary' },
    { value: 'resolved', label: 'Орындалды', color: 'success' },
    { value: 'closed', label: 'Жабылды', color: 'default' },
  ];
  
  // Өтініш басымдықтары
  export const TICKET_PRIORITIES = [
    { value: 'low', label: 'Төмен', color: 'success' },
    { value: 'medium', label: 'Орташа', color: 'info' },
    { value: 'high', label: 'Жоғары', color: 'warning' },
    { value: 'urgent', label: 'Шұғыл', color: 'error' },
  ];
  
  // Құрылыс компаниясының өтініш санаттары
  export const TICKET_CATEGORIES = [
    { value: 'repair', label: 'Жөндеу жұмыстары' },
    { value: 'plumbing', label: 'Сантехника' },
    { value: 'electrical', label: 'Электрика' },
    { value: 'construction', label: 'Құрылыс' },
    { value: 'design', label: 'Жобалау' },
    { value: 'consultation', label: 'Кеңес беру' },
    { value: 'estimate', label: 'Смета және есептеулер' },
    { value: 'materials', label: 'Материалдар' },
    { value: 'warranty', label: 'Кепілдік жағдайы' },
    { value: 'other', label: 'Басқа' },
  ];
  
  // Нысан түрлері
  export const PROPERTY_TYPES = [
    { value: 'apartment', label: 'Пәтер' },
    { value: 'house', label: 'Жеке үй' },
    { value: 'office', label: 'Кеңсе' },
    { value: 'commercial', label: 'Коммерциялық үй-жай' },
    { value: 'land', label: 'Жер телімі' },
    { value: 'other', label: 'Басқа' },
  ];
  
  // Құрылыс компаниясының қызметтері
  export const SERVICES = [
    { value: 'construction', label: 'Құрылыс' },
    { value: 'renovation', label: 'Жөндеу' },
    { value: 'design', label: 'Жобалау' },
    { value: 'maintenance', label: 'Қызмет көрсету' },
    { value: 'consultation', label: 'Кеңес беру' },
  ];
  
  // src/utils/formatters.js
  import { format, formatDistanceToNow } from 'date-fns';
  import { ru } from 'date-fns/locale';
  
  /**
   * Күн мен уақытты пішімдеу
   * @param {string|Date} date - Пішімделетін күн
   * @param {string} formatString - Пішім жолы (әдепкі бойынша DD.MM.YYYY HH:mm)
   * @returns {string} - Пішімделген күн
   */
  export const formatDate = (date, formatString = 'dd.MM.yyyy HH:mm') => {
    if (!date) return 'Көрсетілмеген';
    return format(new Date(date), formatString, { locale: ru });
  };
  
  /**
   * Көрсетілген күннен бері өткен уақытты пішімдейді, мысалы "5 минут бұрын"
   * @param {string|Date} date - Күн
   * @returns {string} - Пішімделген уақыт аралығы
   */
  export const formatRelativeTime = (date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
  };
  
  /**
   * Өтініш статусын көрсету үшін пішімдейді
   * @param {string} status - Статус коды
   * @returns {Object} - Локализацияланған мәтіні мен түсі бар нысан
   */
  export const formatTicketStatus = (status) => {
    const statusObj = TICKET_STATUSES.find(s => s.value === status);
    return statusObj || { text: status || 'Белгісіз', color: 'default' };
  };
  
  /**
   * Өтініш басымдығын көрсету үшін пішімдейді
   * @param {string} priority - Басымдық коды
   * @returns {Object} - Локализацияланған мәтіні мен түсі бар нысан
   */
  export const formatTicketPriority = (priority) => {
    const priorityObj = TICKET_PRIORITIES.find(p => p.value === priority);
    return priorityObj || { text: priority || 'Стандартты', color: 'info' };
  };
  
  /**
   * Өтініш санатын көрсету үшін пішімдейді
   * @param {string} category - Санат коды
   * @returns {string} - Локализацияланған санат мәтіні
   */
  export const formatTicketCategory = (category) => {
    const categoryObj = TICKET_CATEGORIES.find(c => c.value === category);
    return categoryObj?.label || category || 'Басқа';
  };
  
  /**
   * Нысан түрін көрсету үшін пішімдейді
   * @param {string} propertyType - Нысан түрінің коды
   * @returns {string} - Локализацияланған нысан түрінің мәтіні
   */
  export const formatPropertyType = (propertyType) => {
    const typeObj = PROPERTY_TYPES.find(t => t.value === propertyType);
    return typeObj?.label || propertyType || 'Басқа';
  };
  
  /**
   * Бағаны рубльмен пішімдейді
   * @param {number} value - Сома
   * @returns {string} - Валюта таңбасы бар пішімделген сома
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
   * Жолды URL форматына (slug) пішімдейді
   * @param {string} text - Бастапқы мәтін
   * @returns {string} - URL үшін пішімделген жол
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