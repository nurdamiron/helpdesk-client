// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Инициализируем API клиент (опционально)
import apiService from './api/index.js';
apiService.init().then(status => {
  if (!status.isHealthy) {
    console.warn('API Health Check: Server unavailable!');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);