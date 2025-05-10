// src/utils/validationUtils.js - Валидация утилиталары

/**
 * Email адресінің дұрыстығын тексереді
 * @param {string} email - Тексерілетін email
 * @returns {boolean} Тексеру нәтижесі
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Email тексеруге арналған негізгі regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Телефон нөірінің дұрыстығын тексереді
   * @param {string} phone - Тексерілетін телефон нөмірі
   * @returns {boolean} Тексеру нәтижесі
   */
  export const isValidPhone = (phone) => {
    if (!phone) return false;
    
    // +7XXXXXXXXXX немесе 8XXXXXXXXXX форматтарын қабылдаймыз
    const phoneRegex = /^(\+7|8)[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s+/g, '').replace(/-/g, ''));
  };
  
  /**
   * Өтініш құру формасын валидациялайды
   * @param {object} formData - Форма деректері
   * @returns {object} Қателер объектісі (қателер болмаса - бос)
   */
  export const validateTicketForm = (formData) => {
    const errors = {};
    
    // Міндетті өрістерді тексеру
    if (!formData.subject?.trim()) {
      errors.subject = 'Өтініш тақырыбын көрсетіңіз';
    }
    
    if (!formData.description?.trim()) {
      errors.description = 'Мәселеңізді немесе сұрауыңызды сипаттаңыз';
    }
    
    if (!formData.full_name?.trim()) {
      errors.full_name = 'Толық атыңызды көрсетіңіз';
    }
    
    // Email тексеру
    if (!formData.email?.trim()) {
      errors.email = 'Байланыс үшін email көрсетіңіз';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Дұрыс email көрсетіңіз';
    }
    
    // Телефон нөмірін тексеру (егер көрсетілген болса)
    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = 'Дұрыс телефон нөмірін көрсетіңіз';
    }
    
    return errors;
  };
  
  /**
   * Телефон нөмірін әдемі түрде форматтайды
   * @param {string} phone - Телефон нөмірі
   * @returns {string} Форматталған телефон нөмірі
   */
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Барлық сандық емес таңбаларды жоямыз
    const cleaned = phone.replace(/\D/g, '');
    
    // Қазақстандық нөмір ұзындығын тексереміз
    if (cleaned.length === 11) {
      // +7 (XXX) XXX-XX-XX форматында форматтаймыз
      return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
    }
    
    // Формат сәйкес келмесе, сол күйінде қайтарамыз
    return phone;
  };
  
  /**
   * БСН/ЖСН немесе компания кодын форматтайды
   * @param {string} code - Форматталатын код
   * @returns {string} Форматталған код
   */
  export const formatCompanyCode = (code) => {
    if (!code) return '';
    
    // Барлық сандық емес таңбаларды жоямыз
    const cleaned = code.replace(/\D/g, '');
    
    // БСН/ЖСН форматы (12 сан)
    if (cleaned.length === 12) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8, 12)}`;
    }
    
    // Басқа форматтар үшін сол күйінде қайтарамыз
    return code;
  };
  
  /**
   * Өтініш статусының әрекет жасауға рұқсатын тексеру
   * @param {string} status - Өтініш статусы
   * @returns {boolean} Әрекет жасау мүмкіндігі
   */
  export const isTicketActionable = (status) => {
    // Жабық және шешілген өтініштерге әрекет жасауға болмайды
    return status !== 'closed' && status !== 'resolved';
  };