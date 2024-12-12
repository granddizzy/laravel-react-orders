// src/Products.jsx
import React, {useEffect, useState} from 'react';
import {
  Box, useTheme, useMediaQuery, TextField,
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {setSearch} from "../redux/productsSlice";
import debounce from 'lodash.debounce';

function ProductsSearch() {
  const dispatch = useDispatch();
  const {search} = useSelector((state) => state.products);

  const [rawSearch, setRawSearch] = useState(search); // Ввод пользователя

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  // Дебаунс-функция для обновления debouncedSearch
  const debouncedUpdateSearch = React.useCallback(
    debounce((value) => {
      dispatch(setSearch(value)); // Обновляем значение в Redux
    }, 1500),
    [dispatch] // Зависимости — чтобы обновлять функцию только при изменении dispatch
  );

  // Очистка таймера debounce при размонтировании
  useEffect(() => {
    return () => {
      debouncedUpdateSearch.cancel(); // Отменяем таймер
    };
  }, [debouncedUpdateSearch]);

  // Обработчик ввода в поле поиска
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setRawSearch(value); // Сразу обновляем сырое значение
    debouncedUpdateSearch(value); // Запускаем дебаунс
  };

  return (
    <Box sx={{mb: 2}}>
      <TextField
        label="Поиск"
        variant="outlined"
        value={rawSearch}
        onChange={handleSearchChange}
        sx={{width: '100%'}} // Полная ширина блока
      />
    </Box>
  );
}

export default ProductsSearch;
