// src/services/WebSocketService.js

/**
 * Класс для работы с WebSocket соединениями на клиентской стороне
 * Клиент жағында WebSocket байланыстарымен жұмыс істеуге арналған класс
 */
class WebSocketService {
    constructor() {
      this.socket = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 10;
      this.reconnectTimeout = null;
      
      // Determine base URL from current location or environment variable
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const defaultHost = window.location.hostname + (location.port ? ':' + location.port : '');
      this.baseUrl = import.meta.env.VITE_WS_URL || `${protocol}//${defaultHost}/ws`;
      
      this.messageHandlers = new Map();
      this.statusHandlers = new Map();
      this.typingHandlers = new Map();
      this.connectionHandlers = [];
      this.userId = null;
      this.userType = null;
      this.pingInterval = null;
      
      console.log('WebSocketService initialized with base URL:', this.baseUrl);
    }
  
    /**
     * Инициализация WebSocket соединения
     * WebSocket байланысын инициализациялау
     * 
     * @param {string|number} userId - ID пользователя
     * @param {string} userType - Тип пользователя (requester/staff)
     * @returns {WebSocketService} - Экземпляр сервиса
     */
    init(userId, userType = 'requester') {
      if (this.socket && this.isConnected) {
        console.log('WebSocket already connected');
        return this;
      }
  
      this.userId = userId || 'anonymous';
      this.userType = userType;
      
      console.log(`Initializing WebSocket for user: ${this.userId}, type: ${this.userType}`);
  
      this.connect();
      return this;
    }
  
    /**
     * Подключение к WebSocket серверу
     * WebSocket серверіне қосылу
     */
    connect() {
      try {
        // Clear any existing connection
        if (this.socket) {
          this.socket.onopen = null;
          this.socket.onmessage = null;
          this.socket.onerror = null;
          this.socket.onclose = null;
          this.socket.close();
          this.socket = null;
        }
        
        const url = `${this.baseUrl}?userId=${this.userId}&userType=${this.userType}`;
        console.log(`Connecting to WebSocket: ${url}`);
        
        this.socket = new WebSocket(url);
  
        // Установка обработчиков событий
        // Оқиға өңдеушілерін орнату
        this.socket.onopen = this.handleOpen.bind(this);
        this.socket.onmessage = this.handleMessage.bind(this);
        this.socket.onerror = this.handleError.bind(this);
        this.socket.onclose = this.handleClose.bind(this);
      } catch (error) {
        console.error('WebSocket connection error:', error);
        this.scheduleReconnect();
      }
    }
  
    /**
     * Обработчик открытия соединения
     * Байланысты ашу өңдеушісі
     */
    handleOpen(event) {
      console.log('WebSocket connected successfully', event);
      this.isConnected = true;
      this.reconnectAttempts = 0;
  
      // Начинаем отправлять ping для поддержания соединения
      // Байланысты сақтау үшін ping жіберуді бастаймыз
      this.startPingInterval();
  
      // Уведомляем всех подписчиков о подключении
      // Барлық жазылушыларға қосылым туралы хабарлаймыз
      this.notifyConnectionHandlers(true);
      
      // Send initial message to confirm connection
      this.sendMessage({
        type: 'connection_init',
        userId: this.userId,
        userType: this.userType,
        timestamp: new Date().toISOString()
      });
    }
  
    /**
     * Уведомление обработчиков о изменении статуса соединения
     * Байланыс күйінің өзгеруі туралы өңдеушілерге хабарлау
     * 
     * @param {boolean} isConnected - Статус соединения
     */
    notifyConnectionHandlers(isConnected) {
      this.connectionHandlers.forEach(handler => {
        try {
          handler(isConnected);
        } catch (error) {
          console.error('Error in connection handler:', error);
        }
      });
    }
  
    /**
     * Обработчик получения сообщения
     * Хабарлама алу өңдеушісі
     * 
     * @param {MessageEvent} event - Событие получения сообщения
     */
    handleMessage(event) {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data.type);
  
        // Обработка различных типов сообщений
        // Әртүрлі хабарлама түрлерін өңдеу
        switch (data.type) {
          case 'new_message':
            this.handleNewMessage(data);
            break;
          case 'status_update':
            this.handleStatusUpdate(data);
            break;
          case 'typing_indicator':
            this.handleTypingIndicator(data);
            break;
          case 'connection_established':
            console.log('Connection established with server');
            break;
          case 'pong':
            // Просто логируем пинг-понг для отладки
            // Пинг-понгты жай ғана жазамыз (отладка үшін)
            console.log('Pong received from server');
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  
    /**
     * Обработчик ошибки соединения
     * Байланыс қатесінің өңдеушісі
     * 
     * @param {Event} error - Событие ошибки
     */
    handleError(error) {
      console.error('WebSocket error:', error);
      // Ошибка соединения, но не закрываем - onclose сработает автоматически
      // Байланыс қатесі, бірақ жаппаймыз - onclose автоматты түрде іске қосылады
    }
  
    /**
     * Обработчик закрытия соединения
     * Байланысты жабу өңдеушісі
     * 
     * @param {CloseEvent} event - Событие закрытия
     */
    handleClose(event) {
      console.log(`WebSocket connection closed: ${event.code} - ${event.reason || 'No reason provided'}`);
      this.isConnected = false;
      this.clearPingInterval();
  
      // Уведомляем подписчиков о разрыве соединения
      // Жазылушыларға байланыстың үзілуі туралы хабарлаймыз
      this.notifyConnectionHandlers(false);
  
      // Пробуем переподключиться, если соединение закрыто не специально
      // Егер байланыс арнайы жабылмаса, қайта қосылуға тырысамыз
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    }
  
    /**
     * Планирование переподключения
     * Қайта қосылуды жоспарлау
     */
    scheduleReconnect() {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
  
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnect attempts reached');
        return;
      }
  
      // Экспоненциальное увеличение задержки между попытками
      // Талпыныстар арасындағы кідірісті экспоненциалды түрде арттыру
      const delay = Math.min(
        1000 * Math.pow(2, this.reconnectAttempts),
        30000 // Максимальная задержка 30 секунд
      );
  
      console.log(`Scheduling reconnect in ${delay}ms, attempt ${this.reconnectAttempts + 1}`);
  
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempts += 1;
        this.connect();
      }, delay);
    }
  
    /**
     * Начать отправку ping-сообщений
     * Ping хабарламаларын жіберуді бастау
     */
    startPingInterval() {
      this.clearPingInterval(); // Очищаем предыдущий интервал, если есть
      
      this.pingInterval = setInterval(() => {
        if (this.isConnected) {
          this.sendMessage({
            type: 'ping',
            timestamp: new Date().toISOString()
          });
        }
      }, 30000); // Пинг каждые 30 секунд
    }
  
    /**
     * Очистить интервал отправки ping
     * Ping жіберу аралығын тазалау
     */
    clearPingInterval() {
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
    }
  
    /**
     * Отправка сообщения через WebSocket
     * WebSocket арқылы хабарлама жіберу
     * 
     * @param {Object} data - Данные для отправки
     * @returns {boolean} - Успешность отправки
     */
    sendMessage(data) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        console.log('Cannot send message, WebSocket is not connected', {
          socketExists: !!this.socket,
          readyState: this.socket ? this.socket.readyState : 'N/A'
        });
        return false;
      }
  
      try {
        const message = JSON.stringify(data);
        this.socket.send(message);
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    }
  
    /**
     * Отправка сообщения в чат
     * Чатқа хабарлама жіберу
     * 
     * @param {number|string} ticketId - ID заявки
     * @param {string} content - Текст сообщения
     * @param {Array} attachmentIds - ID вложений
     * @returns {boolean} - Успешность отправки
     */
    sendChatMessage(ticketId, content, attachmentIds = []) {
        console.log(`Sending chat message as ${this.userType} (ID: ${this.userId})`);
        
        // Ensure we have proper user type and ID to distinguish message sender
        const senderType = this.userType || 'requester';
        const senderId = this.userId || 'anonymous';
        
        return this.sendMessage({
          type: 'chat_message',
          ticket_id: ticketId,
          content: content,
          sender_id: senderId,
          sender_type: senderType,
          sender_name: senderType === 'requester' ? 'Клиент' : 'Администратор',
          attachments: attachmentIds
        });
      }
  
    /**
     * Отправка статуса набора текста
     * Мәтін теру күйін жіберу
     * 
     * @param {number|string} ticketId - ID заявки
     * @param {boolean} isTyping - Статус набора
     * @returns {boolean} - Успешность отправки
     */
    sendTypingStatus(ticketId, isTyping) {
      return this.sendMessage({
        type: 'typing',
        ticket_id: ticketId,
        sender_id: this.userId,
        sender_type: this.userType,
        isTyping: isTyping
      });
    }
  
    /**
     * Отправка статуса сообщения (прочитано/доставлено)
     * Хабарлама күйін жіберу (оқылды/жеткізілді)
     * 
     * @param {number|string} messageId - ID сообщения
     * @param {string} status - Статус (delivered/read)
     * @returns {boolean} - Успешность отправки
     */
    sendMessageStatus(messageId, status) {
      return this.sendMessage({
        type: 'message_status',
        message_id: messageId,
        status: status
      });
    }
  
    /**
     * Закрытие WebSocket соединения
     * WebSocket байланысын жабу
     */
    disconnect() {
      this.clearPingInterval();
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
  
      if (this.socket) {
        try {
          // Отправляем сообщение о закрытии соединения, если возможно
          if (this.socket.readyState === WebSocket.OPEN) {
            this.sendMessage({
              type: 'disconnect',
              userId: this.userId,
              userType: this.userType,
              timestamp: new Date().toISOString()
            });
          }
          
          this.socket.close(1000, 'Client disconnected intentionally');
        } catch (error) {
          console.error('Error closing WebSocket:', error);
        }
        this.socket = null;
      }
  
      this.isConnected = false;
      console.log('WebSocket disconnected by client');
    }
  
    /**
     * Обработка нового сообщения
     * Жаңа хабарламаны өңдеу
     * 
     * @param {Object} data - Данные сообщения
     */
    handleNewMessage(data) {
      // Уведомляем всех подписчиков на данный ticketId
      // Берілген ticketId бойынша барлық жазылушыларға хабарлаймыз
      const message = data.message;
      const ticketId = message.ticket_id;
  
      // Автоматически отправляем подтверждение о доставке
      // Жеткізу туралы растауды автоматты түрде жіберу
      this.sendMessageStatus(message.id, 'delivered');
  
      // Уведомляем обработчики сообщений для этой заявки
      // Осы өтінім үшін хабарлама өңдеушілерге хабарлаймыз
      if (this.messageHandlers.has(ticketId)) {
        this.messageHandlers.get(ticketId).forEach(handler => {
          handler(message);
        });
      }
    }
  
    /**
     * Обработка обновления статуса сообщения
     * Хабарлама күйінің жаңартылуын өңдеу
     * 
     * @param {Object} data - Данные статуса
     */
    handleStatusUpdate(data) {
      const { message_id, ticket_id, status } = data;
  
      // Уведомляем обработчики статусов для этой заявки
      // Осы өтінім үшін күй өңдеушілерге хабарлаймыз
      if (this.statusHandlers.has(ticket_id)) {
        this.statusHandlers.get(ticket_id).forEach(handler => {
          handler(message_id, status);
        });
      }
    }
  
    /**
     * Обработка индикатора набора текста
     * Мәтін теру индикаторын өңдеу
     * 
     * @param {Object} data - Данные индикатора
     */
    handleTypingIndicator(data) {
      const { ticket_id, user_id, isTyping } = data;
  
      // Уведомляем обработчики индикаторов для этой заявки
      // Осы өтінім үшін индикатор өңдеушілерге хабарлаймыз
      if (this.typingHandlers.has(ticket_id)) {
        this.typingHandlers.get(ticket_id).forEach(handler => {
          handler(user_id, isTyping);
        });
      }
    }
  
    /**
     * Подписка на новые сообщения для заявки
     * Өтінім үшін жаңа хабарламаларға жазылу
     * 
     * @param {number|string} ticketId - ID заявки
     * @param {Function} handler - Обработчик сообщений
     * @returns {Function} - Функция для отписки
     */
    subscribeToMessages(ticketId, handler) {
      if (!this.messageHandlers.has(ticketId)) {
        this.messageHandlers.set(ticketId, new Set());
      }
      this.messageHandlers.get(ticketId).add(handler);
  
      // Возвращаем функцию для отписки
      // Жазылымнан бас тарту үшін функцияны қайтарамыз
      return () => {
        if (this.messageHandlers.has(ticketId)) {
          this.messageHandlers.get(ticketId).delete(handler);
        }
      };
    }
  
    /**
     * Подписка на обновления статусов сообщений для заявки
     * Өтінім үшін хабарлама күйінің жаңартуларына жазылу
     * 
     * @param {number|string} ticketId - ID заявки
     * @param {Function} handler - Обработчик статусов
     * @returns {Function} - Функция для отписки
     */
    subscribeToStatusUpdates(ticketId, handler) {
      if (!this.statusHandlers.has(ticketId)) {
        this.statusHandlers.set(ticketId, new Set());
      }
      this.statusHandlers.get(ticketId).add(handler);
  
      return () => {
        if (this.statusHandlers.has(ticketId)) {
          this.statusHandlers.get(ticketId).delete(handler);
        }
      };
    }
  
    /**
     * Подписка на индикаторы набора текста для заявки
     * Өтінім үшін мәтін теру индикаторларына жазылу
     * 
     * @param {number|string} ticketId - ID заявки
     * @param {Function} handler - Обработчик индикаторов
     * @returns {Function} - Функция для отписки
     */
    subscribeToTypingIndicators(ticketId, handler) {
      if (!this.typingHandlers.has(ticketId)) {
        this.typingHandlers.set(ticketId, new Set());
      }
      this.typingHandlers.get(ticketId).add(handler);
  
      return () => {
        if (this.typingHandlers.has(ticketId)) {
          this.typingHandlers.get(ticketId).delete(handler);
        }
      };
    }
  
    /**
     * Подписка на изменения статуса соединения
     * Байланыс күйінің өзгеруіне жазылу
     * 
     * @param {Function} handler - Обработчик статуса соединения
     * @returns {Function} - Функция для отписки
     */
    subscribeToConnectionStatus(handler) {
      this.connectionHandlers.push(handler);
  
      // Сразу вызываем обработчик с текущим статусом
      // Ағымдағы күймен бірден өңдеушіні шақырамыз
      handler(this.isConnected);
  
      return () => {
        this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
      };
    }
  }
  
  // Создаем экземпляр сервиса для использования в приложении
  // Қолданбада пайдалану үшін сервис данасын жасаймыз
  const wsService = new WebSocketService();
  
  export default wsService;