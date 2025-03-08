// src/utils/sendTicketNotification.js
import nodemailer from 'nodemailer';

/**
 * Отправляет email-уведомление клиенту о создании тикета
 * @param {string} email - Email клиента
 * @param {object} ticketData - Данные тикета (id, subject, description, category, priority и т.д.)
 * @param {object} userData - Данные пользователя (имя, телефон и т.д.)
 * @returns {Promise<boolean>} - Результат отправки
 */
const sendTicketNotification = async (email, ticketData, userData) => {
  // Создаем транспорт для отправки email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: import.meta.env.VITE_EMAIL_USER,
      pass: import.meta.env.VITE_EMAIL_PASSWORD
    }
  });

  // Преобразуем категорию и приоритет в читаемый вид
  const categoryMap = {
    'repair': 'Ремонтные работы',
    'plumbing': 'Сантехника',
    'electrical': 'Электрика',
    'construction': 'Строительство',
    'design': 'Проектирование',
    'consultation': 'Консультация',
    'estimate': 'Смета и расчеты',
    'materials': 'Материалы',
    'warranty': 'Гарантийный случай',
    'other': 'Другое'
  };

  const priorityMap = {
    'low': 'Низкий',
    'medium': 'Средний',
    'high': 'Высокий',
    'urgent': 'Срочный'
  };

  // Форматируем дату
  const formatDate = (date) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Генерируем URL для отслеживания заявки
  const ticketUrl = `${import.meta.env.VITE_FRONTEND_URL}/tickets/${ticketData.id}`;
  
  // Подготавливаем опции для email
  const mailOptions = {
    from: `"Строительная Помощь" <${import.meta.env.VITE_EMAIL_USER}>`,
    to: email,
    subject: `Заявка #${ticketData.id} успешно создана`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #ff6600, #cc5200);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .ticket-info {
            background-color: #f5f5f5;
            border-left: 4px solid #ff6600;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #ff6600;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            width: 30%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Строительная Помощь</div>
            <h1>Ваша заявка принята!</h1>
          </div>
          <div class="content">
            <h2>Спасибо за обращение!</h2>
            <p>Уважаемый(ая) <strong>${userData.full_name || 'Клиент'}</strong>,</p>
            <p>Мы рады сообщить, что ваша заявка успешно создана и зарегистрирована в нашей системе. Наши специалисты уже приступили к её обработке и свяжутся с вами в ближайшее время.</p>
            
            <div class="ticket-info">
              <h3>Информация о заявке #${ticketData.id}</h3>
              <table>
                <tr>
                  <th>Номер заявки:</th>
                  <td><strong>#${ticketData.id}</strong></td>
                </tr>
                <tr>
                  <th>Тема:</th>
                  <td>${ticketData.subject}</td>
                </tr>
                <tr>
                  <th>Категория:</th>
                  <td>${categoryMap[ticketData.category] || ticketData.category}</td>
                </tr>
                <tr>
                  <th>Приоритет:</th>
                  <td>${priorityMap[ticketData.priority] || ticketData.priority}</td>
                </tr>
                <tr>
                  <th>Дата создания:</th>
                  <td>${formatDate(ticketData.created_at || new Date())}</td>
                </tr>
              </table>
              
              <h3>Описание заявки:</h3>
              <p>${ticketData.description}</p>
              
              <h3>Ваши контактные данные:</h3>
              <table>
                <tr>
                  <th>ФИО:</th>
                  <td>${userData.full_name || '-'}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>${email}</td>
                </tr>
                ${userData.phone ? `
                <tr>
                  <th>Телефон:</th>
                  <td>${userData.phone}</td>
                </tr>` : ''}
                ${userData.preferred_contact ? `
                <tr>
                  <th>Предпочтительный контакт:</th>
                  <td>${userData.preferred_contact === 'email' ? 'Email' : userData.preferred_contact === 'phone' ? 'Телефон' : userData.preferred_contact}</td>
                </tr>` : ''}
              </table>
              
              ${userData.property_address ? `
              <h3>Информация об объекте:</h3>
              <table>
                <tr>
                  <th>Тип объекта:</th>
                  <td>${userData.property_type === 'apartment' ? 'Квартира' : 
                       userData.property_type === 'house' ? 'Частный дом' : 
                       userData.property_type === 'office' ? 'Офис' : 
                       userData.property_type === 'commercial' ? 'Коммерческое помещение' : 
                       userData.property_type || '-'}</td>
                </tr>
                <tr>
                  <th>Адрес:</th>
                  <td>${userData.property_address}</td>
                </tr>
                ${userData.property_area ? `
                <tr>
                  <th>Площадь:</th>
                  <td>${userData.property_area} м²</td>
                </tr>` : ''}
              </table>` : ''}
            </div>
            
            <p>Вы можете отслеживать статус вашей заявки, перейдя по ссылке ниже:</p>
            <div style="text-align: center;">
              <a href="${ticketUrl}" class="button">Отслеживать заявку</a>
            </div>
            
            <p>Если у вас возникнут вопросы или вам потребуется дополнительная информация, пожалуйста, не стесняйтесь связаться с нами по указанным на сайте контактам.</p>
            
            <p>С уважением,<br>Команда Строительной Помощи</p>
          </div>
          <div class="footer">
            <p>© 2025 Строительная Помощь. Все права защищены.</p>
            <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    // Отправляем email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email notification sent for ticket #${ticketData.id} to ${email}`);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending ticket notification email:', error);
    return false;
  }
};

export default sendTicketNotification;