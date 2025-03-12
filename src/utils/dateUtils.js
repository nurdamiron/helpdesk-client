// src/utils/dateUtils.js

/**
 * Formats a date for display
 * @param {string|Date} dateString - Date to format
 * @param {boolean} includeTime - Whether to include time in the formatted string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return 'Н/Д';

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }
    
    // Format date in Russian locale format
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    if (!includeTime) {
      return `${day}.${month}.${year}`;
    }
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Ошибка даты';
  }
};

/**
 * Formats a relative time (e.g., "2 hours ago")
 * @param {string|Date} dateString - Date to format
 * @returns {string} Relative time
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'только что';
    }
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${declOfNum(minutes, ['минуту', 'минуты', 'минут'])} назад`;
    }
    
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])} назад`;
    }
    
    // Check if it was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()) {
      return 'вчера';
    }
    
    if (diffInSeconds < 604800) { // Less than a week
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${declOfNum(days, ['день', 'дня', 'дней'])} назад`;
    }
    
    // If more than a week, return formatted date
    return formatDate(date);
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return '';
  }
};

/**
 * Format date for datetime-local input
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date for input
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Format as YYYY-MM-DDThh:mm for input[type="datetime-local"]
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Russian numeral declension helper
 * @param {number} number - Number
 * @param {Array<string>} words - Array of words for different forms [1, 2-4, 5-0]
 * @returns {string} Correct word form
 */
export const declOfNum = (number, words) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[
    (number % 100 > 4 && number % 100 < 20) 
      ? 2 
      : cases[(number % 10 < 5) ? number % 10 : 5]
  ];
};

/**
 * Check if a date is in the past
 * @param {string|Date} dateString - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false;
    }
    
    return date < now;
  } catch (error) {
    console.error('Error checking past date:', error);
    return false;
  }
};

/**
 * Calculate days difference between two dates
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date (defaults to now)
 * @returns {number} Days difference
 */
export const getDaysDifference = (date1, date2 = new Date()) => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Check if dates are valid
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return 0;
    }
    
    // Set time to midnight for correct day calculation
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const differenceMs = Math.abs(d2 - d1);
    return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating days difference:', error);
    return 0;
  }
};