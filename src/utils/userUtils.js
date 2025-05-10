/**
 * Генерирует простой уникальный идентификатор
 * @returns {string} Уникальный идентификатор
 */
const generateSimpleId = () => {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
};

/**
 * Инициализирует пользовательские данные, если они еще не существуют
 * @returns {Object} Данные пользователя
 */
export const initUserData = () => {
  // Проверяем, существует ли уже userId
  let userId = localStorage.getItem('userId');
  let userEmail = localStorage.getItem('userEmail');
  
  // Если userId не существует, создаем новый
  if (!userId) {
    userId = generateSimpleId();
    localStorage.setItem('userId', userId);
  }
  
  // Используем временный email, если не существует
  if (!userEmail) {
    userEmail = `user_${userId.substring(0, 8)}@example.com`;
    localStorage.setItem('userEmail', userEmail);
  }
  
  return { userId, userEmail };
};

/**
 * Устанавливает email пользователя
 * @param {string} email - Email пользователя
 */
export const setUserEmail = (email) => {
  if (email && typeof email === 'string') {
    localStorage.setItem('userEmail', email);
  }
};

/**
 * Получает данные текущего пользователя
 * @returns {Object} Данные пользователя
 */
export const getCurrentUser = () => {
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  
  return { userId, userEmail };
};

export default {
  initUserData,
  setUserEmail,
  getCurrentUser
}; 