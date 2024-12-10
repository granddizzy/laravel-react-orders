// src/Orders.jsx
import React, {useEffect} from 'react';
import {Typography, Box, Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "../contexts/apiContext";
import {Link} from "react-router-dom";
import {fetchOrders} from "../redux/ordersSlice";

function Orders() {

  const dispatch = useDispatch();
  const {orders, loading, error, currentPage, totalPages, setPage} = useSelector((state) => state.orders);
  const token = useSelector((state) => state.auth.token);
  const generateQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage);

    return params.toString();
  };

  const apiUrl = useApi();

  useEffect(() => {
    const queryParams = generateQueryParams();
    dispatch(fetchOrders({
      url: `${apiUrl}/orders?${queryParams}`,
      token: token,
    }));
  }, [dispatch, currentPage]);


  const handlePageChange = (page) => {
    dispatch(setPage(page)); // Изменяем текущую страницу
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{flexGrow: 1}}>
      <Typography variant="h4" gutterBottom>
        Заказы
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь отображается список заказов с их характеристиками.
      </Typography>
      {/* Кнопка-ссылка */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/create-order"
        sx={{mb: 2}}
      >
        Создать новый заказ
      </Button>

      {/* Список товаров */}
      <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden'}}>
        {/* Заголовок таблицы */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '100px 2fr 2fr 2fr 3fr ',
            bgcolor: 'primary.main',
            color: 'white',
            p: 1,
          }}
        >
          <Typography fontWeight="bold">Номер</Typography>
          <Typography fontWeight="bold">Контрагент</Typography>
          <Typography fontWeight="bold">Менеджер</Typography>
          <Typography fontWeight="bold">Статус</Typography>
          <Typography fontWeight="bold">Адрес доставки</Typography>
        </Box>

        {/* Список товаров */}
        {orders.map((order, index) => (
          <Box
            key={order.id}
            component={Link}
            to={`/order/${order.id}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: '100px 2fr 2fr 2fr 3fr',
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
            <Typography>{order.id}</Typography>
            <Typography>{order.contractor_id}</Typography>
            <Typography>{order.manager_id}</Typography>
            <Typography>{order.status}</Typography>
            <Typography>{order.shipping_address}</Typography>
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

export default Orders;
