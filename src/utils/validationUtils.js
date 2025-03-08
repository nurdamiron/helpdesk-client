// src/utils/validationUtils.js

/**
 * Проверяет корректность email адреса
 * @param {string} email - Email для проверки
 * @returns {boolean} Результат проверки
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Базовая регулярка для проверки email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Проверяет корректность номера телефона
   * @param {string} phone - Номер телефона для проверки
   * @returns {boolean} Результат проверки
   */
  export const isValidPhone = (phone) => {
    if (!phone) return false;
    
    // Допустим формат +7XXXXXXXXXX или 8XXXXXXXXXX
    const phoneRegex = /^(\+7|8)[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s+/g, '').replace(/-/g, ''));
  };
  
  /**
   * Валидирует форму создания тикета
   * @param {object} formData - Данные формы
   * @returns {object} Объект с ошибками (пустой, если ошибок нет)
   */
  export const validateTicketForm = (formData) => {
    const errors = {};
    
    // Проверка обязательных полей
    if (!formData.subject?.trim()) {
      errors.subject = 'Укажите тему обращения';
    }
    
    if (!formData.description?.trim()) {
      errors.description = 'Опишите вашу проблему или запрос';
    }
    
    if (!formData.full_name?.trim()) {
      errors.full_name = 'Укажите ваше имя';
    }
    
    // Проверка email
    if (!formData.email?.trim()) {
      errors.email = 'Укажите email для связи';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Укажите корректный email';
    }
    
    // Проверка телефона (если указан)
    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = 'Укажите корректный номер телефона';
    }
    
    return errors;
  };
  
  /**
   * Форматирует номер телефона в красивый вид
   * @param {string} phone - Номер телефона
   * @returns {string} Отформатированный номер телефона
   */
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Убираем все нецифровые символы
    const cleaned = phone.replace(/\D/g, '');
    
    // Проверяем длину для российского номера
    if (cleaned.length === 11) {
      // Форматируем как +7 (XXX) XXX-XX-XX
      return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
    }
    
    // Возвращаем как есть, если формат не подходит
    return phone;
  };
  
  /**
   * Форматирует BIN/IIN или код компании
   * @param {string} code - Код для форматирования
   * @returns {string} Отформатированный код
   */
  export const formatCompanyCode = (code) => {
    if (!code) return '';
    
    // Убираем все нецифровые символы
    const cleaned = code.replace(/\D/g, '');
    
    // Формат для БИН/ИИН (12 цифр)
    if (cleaned.length === 12) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8, 12)}`;
    }
    
    // Возвращаем как есть для других форматов
    return code;
  };
  
  /**
   * Проверка статуса тикета на доступность действий
   * @param {string} status - Статус тикета
   * @returns {boolean} Доступность действий
   */
  export const isTicketActionable = (status) => {
    // Нельзя выполнять действия с закрытыми тикетами
    return status !== 'closed' && status !== 'resolved';
  };