import React, {useState} from 'react';
import {
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {setPageSize, clearProducts} from "../redux/cartSlice"; // Импортируем clearProducts
import OrderCartList from "./OrderCartList";

function OrderCart() {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const {pageSize, products} = useSelector((state) => state.cart);

  const handlePageSizeChange = (event) => {
    dispatch(setPageSize(event.target.value)); // Изменяем размер страницы
  };

  const handleClearCart = () => {
    dispatch(clearProducts()); // Очищаем корзину
  };

  if (error) {
    return <Typography color="error">{`${error}`}</Typography>;
  }

  return (
    <Box sx={{flexGrow: 1}}>
      <Typography variant="h4" gutterBottom>
        Корзина
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь отображается список товаров в корзине.
      </Typography>

      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
        <FormControl sx={{minWidth: 120}}>
          <InputLabel id="page-size-label">На странице</InputLabel>
          <Select
            labelId="page-size-label"
            value={pageSize}
            onChange={handlePageSizeChange}
            label="На странице">
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

      <OrderCartList/>

      {/* Кнопка очистить корзину */}
      <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3}}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearCart}
          disabled={products.length === 0} // Деактивация кнопки если товаров нет
        >
          Очистить корзину
        </Button>
      </Box>
    </Box>
  );
}

export default OrderCart;
