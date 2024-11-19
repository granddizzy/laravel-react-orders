// src/Products.jsx
import React, {useEffect} from 'react';
import {
  Typography,
  Box,
  Button,
  CardContent,
  CardMedia,
  Grid2,
  Card,
  TableCell,
  TableHead,
  TableRow, TableBody, TableContainer, Table, Paper
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts} from "../redux/productSlice";
import {useApi} from "../contexts/apiContext";
import {Link} from "react-router-dom";

function Products() {

  const dispatch = useDispatch();
  const {products, loading, error, currentPage, totalPages, setPage} = useSelector((state) => state.products);

  const generateQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage);

    return params.toString();
  };

  const apiUrl = useApi();

  useEffect(() => {
    const queryParams = generateQueryParams();
    dispatch(fetchProducts(`${apiUrl}/products?${queryParams}`));
  }, [dispatch, currentPage]);


  const handlePageChange = (page) => {
    dispatch(setPage(page)); // Изменяем текущую страницу
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{flexGrow: 1}}>
      <Typography variant="h4" gutterBottom>
        Номенклатура
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь отображается список товаров с их характеристиками.
      </Typography>
      {/* Кнопка-ссылка */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/create-product"
        sx={{ mb: 2 }}
      >
        Создать новый продукт
      </Button>


      {/* Список товаров */}
      <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden'}}>
        {/* Заголовок таблицы */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr 2fr 100px 100px 100px',
            bgcolor: 'primary.main',
            color: 'white',
            p: 1,
          }}
        >
          <Typography fontWeight="bold">Артикул</Typography>
          <Typography fontWeight="bold">Наименование</Typography>
          <Typography fontWeight="bold">Описание</Typography>
          <Typography fontWeight="bold">Цена</Typography>
          <Typography fontWeight="bold">Количество</Typography>
          <Typography fontWeight="bold">Ед. изм.</Typography>
        </Box>

        {/* Список товаров */}
        {products.map((product, index) => (
          <Box
            key={product.id}
            component={Link}
            to={`/product/${product.id}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 2fr 100px 100px 100px',
              textDecoration: 'none',
              color: 'inherit',
              p: 1,
              bgcolor: index % 2 === 0 ? 'grey.50' : 'grey.100', // Чередование строк
              '&:hover': {
                bgcolor: 'primary.light', // Яркий фон при наведении
                color: 'white',
              },
              borderBottom: '1px solid #eee',
              transition: 'background-color 0.3s ease', // Плавный переход
            }}
          >
            <Typography>{product.article}</Typography>
            <Typography>{product.name}</Typography>
            <Typography>{product.description}</Typography>
            <Typography>{product.price}₽</Typography>
            <Typography>{product.quantity}</Typography>
            <Typography>{product.unit}</Typography>
          </Box>
        ))}
      </Box>

      {/* Пагинация */}
      <Box sx={{mt: 3, display: 'flex', justifyContent: 'space-between'}}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Предыдущая
        </Button>
        <Typography variant="body1">
          Страница {currentPage} из {totalPages}
        </Typography>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Следующая
        </Button>
      </Box>
    </Box>
  );
}

export default Products;
