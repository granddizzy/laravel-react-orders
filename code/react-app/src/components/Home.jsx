// src/Home.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать на главную страницу!
      </Typography>
      <Typography variant="body1">
        Здесь будет отображаться основная информация для пользователей.
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        На этой странице вы можете увидеть различные статистики и информацию о вашей учетной записи.
      </Typography>
    </Box>
  );
}

export default Home;
