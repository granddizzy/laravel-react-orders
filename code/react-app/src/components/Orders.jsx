// src/Orders.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

function Orders() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Страница Заказов
      </Typography>
      <Typography variant="body1">
        Здесь будет отображаться список заказов и информация о них.
      </Typography>
    </Box>
  );
}

export default Orders;
