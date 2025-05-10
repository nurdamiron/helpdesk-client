// src/components/ticket/form-steps/TicketDetailsStep.jsx - Өтініш мәліметтері қадамы
import {
  TextField, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import { 
  Title as TitleIcon, 
  Description as DescriptionIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  AssignmentReturn as TypeIcon
} from '@mui/icons-material';

/**
 * Форманың екінші қадамы компоненті - өтініш мәліметтері
 * 
 * @param {Object} formData - Форма деректері
 * @param {Function} onChange - Өзгерісті өңдеу функциясы
 * @param {Object} errors - Валидация қателіктері
 */
const TicketDetailsStep = ({ formData, onChange, errors }) => {
  // Қолжетімді өтініш түрлері
  const ticketTypes = [
    { value: 'request', label: 'Сұраныс' },
    { value: 'complaint', label: 'Шағым' },
    { value: 'suggestion', label: 'Ұсыныс' },
    { value: 'other', label: 'Басқа' }
  ];

  // Өтініш санаттары
  const categories = [
    { value: 'it', label: 'IT қолдау' },
    { value: 'hr', label: 'Кадрлық мәселелер' },
    { value: 'facilities', label: 'Инфрақұрылым' },
    { value: 'finance', label: 'Қаржы' },
    { value: 'legal', label: 'Заңдық мәселелер' },
    { value: 'security', label: 'Қауіпсіздік' },
    { value: 'management', label: 'Басқару' },
    { value: 'other', label: 'Басқа' }
  ];
  
  // Өтініш басымдықтары
  const priorities = [
    { value: 'low', label: 'Төмен' },
    { value: 'medium', label: 'Орташа' },
    { value: 'high', label: 'Жоғары' },
    { value: 'urgent', label: 'Шұғыл' }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Өтініш мәліметтері
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Өтінішіңіздің мәнін мүмкіндігінше толық сипаттаңыз
      </Typography>
      </Grid>
      
        <Grid item xs={12}>
          <TextField
            fullWidth
          label="Өтініш тақырыбы"
            name="subject"
            value={formData.subject}
            onChange={onChange}
          required
            error={!!errors.subject}
            helperText={errors.subject}
          placeholder="Өтініштің мәнін қысқаша сипаттаңыз"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TitleIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Сипаттама"
          name="description"
          value={formData.description}
          onChange={onChange}
          multiline
          rows={4}
          required
          error={!!errors.description}
          helperText={errors.description || "Мәселеңізді немесе сұрауыңызды толық сипаттаңыз"}
          placeholder="Сіз кездескен мәселені немесе енгізгіңіз келетін ұсынысты сипаттаңыз..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon />
              </InputAdornment>
            ),
          }}
          />
        </Grid>
        
      <Grid item xs={12} md={4}>
        <FormControl fullWidth required error={!!errors.type}>
          <InputLabel id="type-label">Өтініш түрі</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            name="type"
            value={formData.type}
            onChange={onChange}
            label="Өтініш түрі"
            startAdornment={
              <InputAdornment position="start">
                <TypeIcon />
              </InputAdornment>
            }
          >
            {ticketTypes.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={4}>
          <FormControl fullWidth>
          <InputLabel id="category-label">Санат</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={onChange}
            label="Санат"
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            }
            >
            {categories.map(category => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
      <Grid item xs={12} md={4}>
          <FormControl fullWidth>
          <InputLabel id="priority-label">Басымдық</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={onChange}
            label="Басымдық"
            startAdornment={
              <InputAdornment position="start">
                <PriorityIcon />
              </InputAdornment>
            }
            >
            {priorities.map(priority => (
              <MenuItem key={priority.value} value={priority.value}>
                {priority.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          *"Шұғыл" басымдығын тек шұғыл қарау қажет болған жағдайда ғана таңдаңыз.
            </Typography>
      </Grid>
    </Grid>
  );
};

export default TicketDetailsStep;