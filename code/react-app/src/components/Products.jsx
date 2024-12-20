// src/Products.jsx
import React from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery,
} from '@mui/material';
import {Link} from "react-router-dom";
import ProductsList from "./ProductsList";
import ProductsSearch from "./ProductsSearch"; // Импортируем debounce

function Products() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  return (
    <Box sx={{flexGrow: 1}}>
      <Typography variant="h4" gutterBottom>
        Номенклатура
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь отображается список товаров с их характеристиками.
      </Typography>

      {/* Кнопка и выпадающий список */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/products/create"
        >
          Добавить продукт
        </Button>
      </Box>

      <ProductsSearch/>
      <ProductsList/>
    </Box>
  );

}

export default Products;
