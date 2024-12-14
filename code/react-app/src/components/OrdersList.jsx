// src/Products.jsx
import React from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery
} from '@mui/material';
import {useSelector} from "react-redux";

import {Link} from "react-router-dom";
import OrdersPagination from "./OrdersPagination";

// Маппинг статусов на русский
const statusMap = {
  pending: 'Ожидает',
  confirmed: 'Подтвержден',
  shipped: 'Отправлен',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

function OrdersList({loading}) {
  const {orders} = useSelector((state) => state.orders);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  // Функция для получения статуса на русском
  const getStatusInRussian = (status) => {
    return statusMap[status] || status; // Если статус не найден, выводим исходный
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <>
      {/* Список контрагентов */}
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
          {/*<Typography fontWeight="bold">Менеджер</Typography>*/}
          <Typography fontWeight="bold">Статус</Typography>
          <Typography fontWeight="bold">Сумма</Typography>
        </Box>

        {/* Список товаров */}
        {orders.map((order, index) => (
          <Box
            key={order.id}
            component={Link}
            to={`/orders/${order.id}`}
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
            <Typography>{order.contractor.name}</Typography>
            {/*<Typography>order.manager.name</Typography>*/}
            <Typography>{getStatusInRussian(order.status)}</Typography>
            <Typography>{order.total_amount}</Typography>
            {/*<Typography>{order.shipping_address}</Typography>*/}
          </Box>
        ))}
      </Box>

      <OrdersPagination/>
    </>
  );
}

export default OrdersList;
