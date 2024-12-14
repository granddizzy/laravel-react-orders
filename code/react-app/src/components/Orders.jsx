// src/Orders.jsx
import React, {useEffect} from 'react';
import {Typography, Box, Button, InputLabel, Select, MenuItem, FormControl} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "../contexts/apiContext";
import {Link} from "react-router-dom";
import {fetchOrders,setPageSize} from "../redux/ordersSlice";
import OrdersSearch from "./OrdersSearch";
import OrdersList from "./OrdersList";

function Orders() {
  const dispatch = useDispatch();
  const {loading, currentPage, pageSize, search} = useSelector((state) => state.orders);
  const token = useSelector((state) => state.auth.token);
  const generateQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage);
    params.append("per_page", pageSize);
    if (search) params.append("search", search); // Добавляем параметр поиска, если он есть
    return params.toString();
  };

  const apiUrl = useApi();

  useEffect(() => {
    const queryParams = generateQueryParams();
    dispatch(fetchOrders({
      url: `${apiUrl}/orders?${queryParams}`,
      token: token,
    }));
  }, [dispatch, currentPage, pageSize, search]);

  const handlePageSizeChange = (event) => {
    dispatch(setPageSize(event.target.value)); // Изменяем размер страницы
  };

  return (
    <Box sx={{flexGrow: 1}}>
      <Typography variant="h4" gutterBottom>
        Заказы
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь отображается список заказов с их характеристиками.
      </Typography>

      {/* Кнопка и выпадающий список */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/create-order"
          sx={{mb: 2}}
        >
          Создать заказ
        </Button>

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

      <OrdersSearch/>
      <OrdersList loading={loading}/>
    </Box>
  );
}

export default Orders;
