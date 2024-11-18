// src/Contractors.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

function Contractors() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Страница Контрагентов
      </Typography>
      <Typography variant="body1">
        Здесь будет отображаться информация о контрагентах и их данных.
      </Typography>
    </Box>
  );
}

export default Contractors;
