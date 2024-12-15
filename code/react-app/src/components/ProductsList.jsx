// src/Products.jsx
import React from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery, CircularProgress
} from '@mui/material';
import {useSelector} from "react-redux";

import {Link} from "react-router-dom";
import ProductsPagination from "./ProductsPagination";

function ProductsList({loading}) {
  const {products} = useSelector((state) => state.products);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  if (loading) return <CircularProgress />;

  return (
    <>
      {/* Список товаров */}
      <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden'}}>

        {/* Заголовок таблицы */}
        {isSmallScreen ? (
          <></>) : (<Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr 100px 100px 100px',
            bgcolor: 'primary.main',
            color: 'white',
            p: 1,
          }}
        >
          <Typography fontWeight="bold">Артикул</Typography>
          <Typography fontWeight="bold">Наименование</Typography>
          <Typography fontWeight="bold">Цена</Typography>
          <Typography fontWeight="bold">Количество</Typography>
          <Typography fontWeight="bold">Ед.изм.</Typography>
        </Box>)}


        {/* Список товаров */}
        {products.map((product, index) => (
          <Box
            key={product.id}
            component={Link}
            to={`/products/${product.id}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: isSmallScreen
                ? '1fr' // Один столбец на маленьком экране
                : '150px 1fr 100px 100px 100px', // Стандартное оформление на большом экране
              textDecoration: 'none',
              color: 'inherit',
              p: 1,
              bgcolor: index % 2 === 0 ? 'grey.50' : 'grey.100',
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white',
              },
              borderBottom: '1px solid #eee',
              transition: 'background-color 0.3s ease',
            }}
          >
            {isSmallScreen ? (
              // Для маленьких экранов показываем значения в виде "ключ: значение"
              <>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">Артикул:</Typography>
                    <Typography>{product.sku}</Typography>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">Наименование:</Typography>
                    <Typography>{product.name}</Typography>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">Цена:</Typography>
                    <Typography>{product.price}₽</Typography>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">Количество:</Typography>
                    <Typography>{product.stock_quantity}</Typography>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">Ед. изм.:</Typography>
                    <Typography>{product.unit}</Typography>
                  </Box>
                </Box>
              </>
            ) : (
              // Для больших экранов показываем стандартную таблицу
              <>
                <Typography>{product.sku}</Typography>
                <Typography>{product.name}</Typography>
                <Typography>{product.price}₽</Typography>
                <Typography>{product.stock_quantity}</Typography>
                <Typography>{product.unit}</Typography>
              </>
            )}
          </Box>
        ))}
      </Box>

      <ProductsPagination/>
    </>
  );
}

export default ProductsList;
