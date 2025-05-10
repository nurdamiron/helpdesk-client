import { 
  TextField, 
  Grid, 
  Typography,
  Box,
  InputAdornment
} from '@mui/material';
import { 
  Comment as CommentIcon
} from '@mui/icons-material';

/**
 * Форманың үшінші қадамы компоненті - қосымша ақпарат
 * 
 * @param {Object} formData - Форма деректері
 * @param {Function} onChange - Өзгерісті өңдеу функциясы
 * @param {Object} errors - Валидация қателіктері
 */
const AdditionalInfoStep = ({ formData, onChange, errors }) => {
  // Функция для предотвращения автоматической отправки формы при нажатии Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Предотвращаем отправку формы
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Қосымша ақпарат
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Қажет болса, қосымша мәліметтерді көрсетіңіз
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Қосымша түсініктемелер"
          name="comments"
          value={formData.comments}
          onChange={onChange}
          onKeyDown={handleKeyDown} // Добавляем обработчик нажатия клавиш
          multiline
          rows={3}
          placeholder="Мұнда сіз өтінішіңізді шешуге көмектесетін кез келген қосымша ақпаратты көрсете аласыз"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CommentIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
          <Typography variant="body2">
            Бұл өрісте сіз мәселеге қатысты кез келген қосымша мәліметтерді немесе өтінішіңізді орындауға көмектесетін нақтылауларды көрсете аласыз.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdditionalInfoStep; 