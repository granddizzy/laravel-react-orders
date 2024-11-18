// src/Products.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

function Products() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Страница Номенклатуры
      </Typography>
      <Typography variant="body1">
        Здесь будет отображаться список товаров и их характеристики.
      </Typography>
    </Box>
  );
}

export default Products;
