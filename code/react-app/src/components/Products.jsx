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

      {/* Список товаров */}
      <TableContainer component={Paper}>
        <Table>
          {/* Заголовки таблицы */}
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="body1">Артикул</Typography></TableCell>
              <TableCell><Typography variant="body1">Наименование</Typography></TableCell>
              <TableCell><Typography variant="body1">Описание</Typography></TableCell>
              <TableCell><Typography variant="body1">Цена</Typography></TableCell>
              <TableCell><Typography variant="body1">Количество</Typography></TableCell>
              <TableCell><Typography variant="body1">Ед. измер.</Typography></TableCell>
            </TableRow>
          </TableHead>

          {/* Тело таблицы с данными товаров */}
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.article}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}₽</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
