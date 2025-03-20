// src/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Настройка транспорта для отправки email-уведомлений
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Отправляет email о верификации email-адреса
 * @param {string} email - Email получателя
 * @param {string} verificationToken - Токен верификации
 */
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/auth/jwt/verify-email/${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Подтвердите ваш email для Helpdesk',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f8f9fa;
              }
              .header {
                  background: linear-gradient(135deg, #0066cc, #004d99);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
              }
              .content {
                  background: white;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              }
              .button {
                  display: inline-block;
                  padding: 12px 30px;
                  background: linear-gradient(135deg, #0066cc, #004d99);
                  color: white;
                  text-decoration: none;
                  border-radius: 25px;
                  margin: 20px 0;
                  font-weight: bold;
                  text-align: center;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #666;
                  font-size: 12px;
              }
              .logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: white;
                  margin-bottom: 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">Helpdesk</div>
                  <h1>Добро пожаловать!</h1>
              </div>
              <div class="content">
                  <h2>Подтвердите ваш email</h2>
                  <p>Спасибо за регистрацию в Helpdesk - вашей интеллектуальной платформе для службы поддержки.</p>
                  <p>Для завершения регистрации и активации вашего аккаунта, пожалуйста, нажмите на кнопку ниже:</p>
                  
                  <a href="${verificationUrl}" class="button">Подтвердить email</a>
                  
                  <p>Если кнопка не работает, вы можете скопировать и вставить следующую ссылку в ваш браузер:</p>
                  <p style="color:rgb(117, 182, 248);">${verificationUrl}</p>
                  
                  <p>Если вы не регистрировались на Helpdesk, просто проигнорируйте это письмо.</p>
                  <p>Обратите внимание, что ссылка действительна в течение 24 часов.</p>

              </div>
              <div class="footer">
                  <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
                  <p>© ${new Date().getFullYear()} Helpdesk. Все права защищены.</p>
              </div>
          </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Отправляет уведомление о новом сообщении в заявке
 * @param {Object} ticket - Данные заявки
 * @param {Object} message - Данные сообщения
 * @param {Object} recipient - Данные получателя
 */
const sendTicketMessageNotification = async (ticket, message, recipient) => {
  if (!recipient.email) {
    console.log('No recipient email provided, skipping notification');
    return;
  }
  
  // Create URL for direct chat access (new)
  const chatUrl = `${process.env.FRONTEND_URL}/redirect/ticket/${ticket.id}`;
  
  const mailOptions = {
    from: `"Helpdesk" <${process.env.EMAIL_USER}>`,
    to: recipient.email,
    subject: `Новое сообщение в заявке #${ticket.id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
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
            background: linear-gradient(135deg, #0066cc, #004d99);
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
          .message {
            background-color: #f5f5f5;
            border-left: 4px solid #0066cc;
            padding: 15px;
            margin: 15px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 25px;
            background: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Helpdesk</h1>
            <p>Новое сообщение в вашей заявке</p>
          </div>
          <div class="content">
            <h2>Здравствуйте, ${recipient.name || recipient.email}!</h2>
            <p>Вы получили новое сообщение в заявке <strong>#${ticket.id}: ${ticket.subject}</strong>.</p>
            
            <div class="message">
              <p><strong>Сообщение от ${message.sender?.name || 'сотрудника поддержки'}:</strong></p>
              <p>${message.content || message.body || 'Нет содержимого'}</p>
            </div>
            
            <p>Для просмотра полной истории обращения и ответа на сообщение, пожалуйста, перейдите по ссылке:</p>
            <p style="text-align: center;">
              <a href="${chatUrl}" class="button">Перейти к чату</a>
            </p>
            
            <p>Если у вас возникли вопросы, вы можете ответить на это письмо или связаться с нами по указанным на сайте контактам.</p>
            
            <p>С уважением,<br>Служба поддержки</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Helpdesk. Все права защищены.</p>
            <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на него напрямую.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email notification sent for ticket #${ticket.id} to ${recipient.email}`);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending ticket notification email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendTicketMessageNotification
};