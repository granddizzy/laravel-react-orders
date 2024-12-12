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
import debounce from 'lodash.debounce';
import ProductsList from "./ProductsList"; // Импортируем debounce

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

  return (
    <Box sx={{flexGrow: 1}}>
      <Typography variant="h4" gutterBottom>
        Номенклатура
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь отображается список товаров с их характеристиками.
      </Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
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
          sx={{width: '250px'}} // Устанавливаем ширину поля
        />

        {/* Выпадающий список справа */}
        <FormControl sx={{minWidth: 120}}>
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

      <ProductsList loading={loading}/>
    </Box>
  );
}

export default Products;
