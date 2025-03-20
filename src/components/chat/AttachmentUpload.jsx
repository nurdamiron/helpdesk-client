// src/components/chat/AttachmentUpload.jsx
import React, { useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';

/**
 * Компонент для загрузки файлов в чате
 * Чатта файлдарды жүктеуге арналған компонент
 * 
 * @param {Object} props - Свойства компонента
 * @param {Array} props.files - Массив выбранных файлов
 * @param {Function} props.setFiles - Функция для обновления списка файлов
 * @param {boolean} props.disabled - Флаг блокировки компонента
 * @returns {JSX.Element} Компонент загрузки файлов
 */
const AttachmentUpload = ({ files, setFiles, disabled = false }) => {
  // Ссылка на input для выбора файлов
  // Файлдарды таңдауға арналған input сілтемесі
  const fileInputRef = useRef(null);

  /**
   * Обработчик клика по кнопке прикрепления файла
   * Файлды тіркеу түймесіне басу өңдеушісі
   */
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Обработчик выбора файлов
   * Файлдарды таңдау өңдеушісі
   * 
   * @param {Event} e - Событие выбора файлов
   */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Проверка размера файлов (максимум 5 МБ на файл)
    // Файл өлшемін тексеру (файл басына максимум 5 МБ)
    const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Некоторые файлы не были добавлены, так как их размер превышает 5 МБ');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    
    // Сбрасываем значение input, чтобы можно было выбрать тот же файл повторно
    // Сол файлды қайта таңдау мүмкін болу үшін input мәнін тазалаймыз
    e.target.value = null;
  };

  /**
   * Удаление файла из списка
   * Файлды тізімнен жою
   * 
   * @param {number} index - Индекс файла в массиве
   */
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {/* Скрытый input для выбора файлов */}
      {/* Файлдарды таңдауға арналған жасырын input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
        disabled={disabled}
      />
      
      {/* Кнопка для выбора файлов */}
      {/* Файлдарды таңдау түймесі */}
      <IconButton
        color="primary"
        onClick={handleAttachmentClick}
        disabled={disabled}
        aria-label="Прикрепить файл"
      >
        <AttachFileIcon />
      </IconButton>
      
      {/* Предпросмотр выбранных файлов */}
      {/* Таңдалған файлдардың алдын-ала көрінісі */}
      {files.length > 0 && (
        <Box sx={{ p: 2, bgcolor: '#f0f0f0', mt: 1, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Прикрепленные файлы ({files.length}):
          </Typography>
          <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  mb: 1,
                  bgcolor: 'white',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '80%' }}>
                  {file.type.startsWith('image/') ? (
                    <ImageIcon fontSize="small" sx={{ mr: 1 }} />
                  ) : (
                    <FileIcon fontSize="small" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2" noWrap>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => removeFile(index)}
                  color="error"
                  disabled={disabled}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AttachmentUpload;