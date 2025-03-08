// src/utils/dateUtils.js
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматирует дату в читаемый вид
 * @param {string|Date} date - Дата для форматирования
 * @param {boolean} includeTime - Включать ли время в форматированную строку
 * @returns {string} Отформатированная дата
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return 'Н/Д';

  let dateObj;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) {
    return 'Некорректная дата';
  }

  try {
    if (includeTime) {
      return format(dateObj, 'dd.MM.yyyy HH:mm', { locale: ru });
    }
    return format(dateObj, 'dd.MM.yyyy', { locale: ru });
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return 'Ошибка';
  }
};

/**
 * Возвращает относительное время с момента переданной даты (например, "5 минут назад")
 * @param {string|Date} date - Дата для расчета
 * @returns {string} Относительное время
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  let dateObj;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) {
    return '';
  }

  try {
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: ru });
  } catch (error) {
    console.error('Ошибка форматирования относительного времени:', error);
    return '';
  }
};

/**
 * Преобразует строку даты ISO в локальную дату и время
 * @param {string} isoString - ISO строка даты
 * @returns {string} Локальная дата и время
 */
export const isoToLocalDateTime = (isoString) => {
  if (!isoString) return '';
  
  try {
    const date = parseISO(isoString);
    if (!isValid(date)) return '';
    
    return format(date, 'dd.MM.yyyy HH:mm:ss', { locale: ru });
  } catch (error) {
    console.error('Ошибка преобразования ISO даты:', error);
    return '';
  }
};