// src/Products.jsx
import React, {useEffect, useState} from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery, MenuItem, FormControl, InputLabel, Select, TextField,
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts, setPageSize, setPage} from "../redux/productsSlice";
import {useApi} from "../contexts/apiContext";
import {Link} from "react-router-dom";
import debounce from 'lodash.debounce'; // Импортируем debounce

function Products() {
  const dispatch = useDispatch();
  const {products, loading, error, currentPage, pageSize, totalPages} = useSelector((state) => state.products);
  const token = useSelector((state) => state.auth.token);

  const [rawSearch, setRawSearch] = useState(""); // Ввод пользователя
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Дебаунс-значение для фильтрации

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  const generateQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage);
    params.append("per_page", pageSize);
    if (debouncedSearch) params.append("search", debouncedSearch); // Добавляем параметр поиска, если он есть
    return params.toString();
  };

  const apiUrl = useApi();

  useEffect(() => {
    const queryParams = generateQueryParams();
    dispatch(fetchProducts({
      url: `${apiUrl}/products?${queryParams}`,
      token: token
    }));
  }, [dispatch, currentPage, pageSize, debouncedSearch]);


  const handlePageChange = (page) => {
    dispatch(setPage(page)); // Изменяем текущую страницу
  };

  const handlePageSizeChange = (event) => {
    dispatch(setPageSize(event.target.value)); // Изменяем размер страницы
  };

  // Дебаунс-функция для обновления debouncedSearch
  const debouncedUpdateSearch = debounce((value) => {
    setDebouncedSearch(value); // Обновляем debouncedSearch с задержкой
  }, 1000);

  // Обработчик ввода в поле поиска
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setRawSearch(value); // Сразу обновляем сырое значение
    debouncedUpdateSearch(value); // Запускаем дебаунс
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {/* Кнопка слева */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/create-product"
        >
          Добавить продукт
        </Button>

        {/* Поле поиска */}
        <TextField
          label="Поиск"
          variant="outlined"
          value={rawSearch} // Привязка к сырым данным
          onChange={handleSearchChange} // Обработчик с дебаунсом
          sx={{ width: '250px' }} // Устанавливаем ширину поля
        />

        {/* Выпадающий список справа */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="page-size-label">На странице</InputLabel>
          <Select
            labelId="page-size-label"
            value={pageSize}
            onChange={handlePageSizeChange}
            label="На странице"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={60}>60</MenuItem>
            <MenuItem value={80}>80</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Список товаров */}
      <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden'}}>

        {/* Заголовок таблицы */}
        {isSmallScreen ? (
          <></>) : (<Box
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
                : '150px 1fr 2fr 100px 100px 100px', // Стандартное оформление на большом экране
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

      {/* Пагинация */
      }
      <Box sx={{mt: 3, display: 'flex', justifyContent: 'space-between'}}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Предыдущая
        </Button>
        <Typography variant="body1">
          {currentPage} из {totalPages}
        </Typography>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Следующая
        </Button>
      </Box>
    </Box>
  )
    ;
}

export default Products;
