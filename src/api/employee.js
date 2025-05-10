import api from './index';

/**
 * API-сервис для работы с сотрудниками
 */
export const employeeApi = {
  /**
   * Получить список сотрудников с возможностью фильтрации
   * @param {Object} params - Параметры запроса (email, department и т.д.)
   * @returns {Promise<Object>} Список сотрудников
   */
  getEmployees: async (params = {}) => {
    try {
      const response = await api.get('/employees', { params });
      return response.employees || response.data || [];
    } catch (error) {
      console.error('Ошибка при получении списка сотрудников:', error);
      throw error;
    }
  },

  /**
   * Получить данные сотрудника по ID
   * @param {string|number} id - ID сотрудника
   * @returns {Promise<Object>} Данные сотрудника
   */
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.employee || response.data || null;
    } catch (error) {
      console.error(`Ошибка при получении данных сотрудника #${id}:`, error);
      throw error;
    }
  },

  /**
   * Создать или обновить сотрудника
   * @param {Object} employeeData - Данные сотрудника
   * @returns {Promise<Object>} Созданный/обновленный сотрудник
   */
  createOrUpdateEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.employee || response.data || null;
    } catch (error) {
      console.error('Ошибка при создании/обновлении сотрудника:', error);
      throw error;
    }
  },

  /**
   * Поиск сотрудников по email или другим параметрам
   * @param {Object} params - Параметры поиска (email, department и т.д.)
   * @returns {Promise<Array>} Список найденных сотрудников
   */
  searchEmployees: async (params = {}) => {
    try {
      const response = await api.get('/employees', { params });
      return response.employees || response.data || [];
    } catch (error) {
      console.error('Ошибка при поиске сотрудников:', error);
      throw error;
    }
  }
};

export default employeeApi; 