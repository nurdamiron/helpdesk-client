// src/components/chat/FilePreview.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Code as CodeIcon,
  Close as CloseIcon
} from '@mui/icons-material';

/**
 * Компонент для предварительного просмотра файла перед отправкой
 * Файлды жіберу алдында алдын-ала қарау компоненті
 * 
 * @param {File} file - Файл для предпросмотра
 * @param {Function} onRemove - Функция для удаления файла из списка
 */
const FilePreview = ({ file, onRemove }) => {
  // Состояние для отображения превью изображения
  const [preview, setPreview] = useState('');
  // Состояние для отображения ошибки загрузки
  const [error, setError] = useState(false);
  // Состояние для индикатора загрузки
  const [loading, setLoading] = useState(false);

  /**
   * Форматирование размера файла в читаемый вид
   * Файл өлшемін оқылатын түрге форматтау
   */
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    } else {
      return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
    }
  };

  /**
   * Получение подходящей иконки для типа файла
   * Файл түріне сәйкес белгішені алу
   */
  const getFileIcon = () => {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      return <ImageIcon fontSize="small" />;
    } else if (fileType.includes('pdf')) {
      return <PdfIcon fontSize="small" />;
    } else if (
      fileType.includes('word') || 
      fileType.includes('document') || 
      fileType.includes('msword') ||
      fileType.includes('officedocument')
    ) {
      return <DocIcon fontSize="small" />;
    } else if (
      fileType.includes('code') || 
      fileType.includes('json') || 
      fileType.includes('javascript') ||
      fileType.includes('text')
    ) {
      return <CodeIcon fontSize="small" />;
    } else {
      return <FileIcon fontSize="small" />;
    }
  };

  /**
   * Загрузка превью для изображений при необходимости
   * Қажет болған жағдайда кескіндер үшін алдын-ала қарауды жүктеу
   */
  const loadImagePreview = () => {
    if (file.type.startsWith('image/') && !preview && !error) {
      setLoading(true);
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setPreview(e.target.result);
        setLoading(false);
      };
      
      reader.onerror = () => {
        setError(true);
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  /**
   * Показываем превью изображения при наведении на файл
   * Файлдың үстіне тінтуір келгенде кескіннің алдын-ала қарауын көрсету
   */
  const handleMouseEnter = () => {
    loadImagePreview();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'white',
        borderRadius: 1,
        p: 0.5,
        pl: 1,
        position: 'relative',
        border: '1px solid #e0e0e0',
        minWidth: 150,
        maxWidth: 220,
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      }}
      onMouseEnter={handleMouseEnter}
    >
      {/* Иконка файла */}
      <Box sx={{ color: 'primary.main', mr: 1, display: 'flex', alignItems: 'center' }}>
        {getFileIcon()}
      </Box>
      
      {/* Информация о файле */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography variant="caption" noWrap title={file.name}>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {formatFileSize(file.size)}
        </Typography>
      </Box>
      
      {/* Кнопка удаления */}
      <Tooltip title="Удалить файл">
        <IconButton size="small" onClick={onRemove} sx={{ ml: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      {/* Превью изображения при наведении */}
      {file.type.startsWith('image/') && (preview || loading) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            mt: -1,
            mb: 1,
            maxWidth: 200,
            maxHeight: 150,
            borderRadius: 1,
            overflow: 'hidden',
            boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
            zIndex: 10,
            bgcolor: 'white',
            p: 1
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <img 
              src={preview} 
              alt={file.name} 
              style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} 
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default FilePreview;