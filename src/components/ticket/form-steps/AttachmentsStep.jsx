// src/components/ticket/form-steps/AttachmentsStep.jsx
import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Grid,
  Divider
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import FilePreview from '../../chat/FilePreview';

/**
 * Компонент шага формы с загрузкой вложений
 * Тіркемелерді жүктейтін форма қадамының компоненті
 * 
 * @param {Array} files - Массив загруженных файлов
 * @param {Function} onFilesChange - Обработчик изменения списка файлов
 */
const AttachmentsStep = ({ files = [], onFilesChange }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Максимальный размер файла (5 МБ)
   * Файлдың максималды өлшемі (5 МБ)
   */
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * Разрешенные типы файлов
   * Рұқсат етілген файл түрлері
   */
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  /**
   * Обработчик клика по кнопке "Выбрать файлы"
   * "Файлдарды таңдау" түймесін басу өңдеушісі
   */
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Обработчик выбора файлов через input
   * Input арқылы файлдарды таңдау өңдеушісі
   */
  const handleFileChange = (e) => {
    processFiles(Array.from(e.target.files || []));
    e.target.value = null; // Сброс input для повторного выбора
  };

  /**
   * Обработчик удаления файла
   * Файлды жою өңдеушісі
   */
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  /**
   * Обработчик начала перетаскивания файлов
   * Файлдарды сүйреу басталған кезде өңдеуші
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * Обработчик сброса перетаскиваемых файлов
   * Сүйрелген файлдарды тастау өңдеушісі
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  /**
   * Обработка и проверка файлов перед добавлением
   * Файлдарды қосу алдында өңдеу және тексеру
   */
  const processFiles = (newFiles) => {
    setError(null);
    
    if (!newFiles || newFiles.length === 0) return;
    
    // Проверка размера и типа файлов
    const validFiles = newFiles.filter(file => {
      // Проверка размера
      if (file.size > MAX_FILE_SIZE) {
        setError(`Файл "${file.name}" превышает максимальный размер в 5 МБ`);
        return false;
      }
      
      // Проверка типа
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(`Файл "${file.name}" имеет неподдерживаемый формат`);
        return false;
      }
      
      return true;
    });
    
    // Добавляем прошедшие проверку файлы
    onFilesChange([...files, ...validFiles]);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AttachFileIcon sx={{ mr: 1 }} />
        Загрузка вложений (опционально)
      </Typography>
      
      {/* Сообщение об ошибке */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Зона для перетаскивания и загрузки файлов */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
          borderRadius: 2,
          backgroundColor: dragActive ? 'rgba(25, 118, 210, 0.04)' : '#fafafa',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          mb: 3
        }}
        onClick={handleButtonClick}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />
        
        <CloudUploadIcon sx={{ fontSize: 48, color: dragActive ? 'primary.main' : 'text.secondary', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Перетащите файлы сюда или нажмите для выбора
          {/* Комментарий на казахском */}
          {/* Файлдарды осы жерге сүйреңіз немесе таңдау үшін басыңыз */}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Поддерживаемые форматы: изображения (JPG, PNG, GIF), документы (PDF, DOC, DOCX, XLS, XLSX, TXT)
          {/* Комментарий на казахском */}
          {/* Қолдау көрсетілетін форматтар: суреттер (JPG, PNG, GIF), құжаттар (PDF, DOC, DOCX, XLS, XLSX, TXT) */}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AttachFileIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
        >
          Выбрать файлы
        </Button>
      </Paper>
      
      {/* Предварительный просмотр загруженных файлов */}
      {files.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Загруженные файлы ({files.length})
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={1}>
            {files.map((file, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FilePreview 
                  file={file} 
                  onRemove={() => handleRemoveFile(index)} 
                />
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Максимальный размер каждого файла: 5 МБ
            {/* Комментарий на казахском */}
            {/* Әрбір файлдың максималды өлшемі: 5 МБ */}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default AttachmentsStep;