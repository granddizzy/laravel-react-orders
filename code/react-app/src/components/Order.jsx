import React, {useEffect, useState} from 'react';
import {Typography, Box, Button, Card, CardContent, CircularProgress} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {useApi} from '../contexts/apiContext';
import {useDispatch, useSelector} from 'react-redux';
import {deleteOrder} from "../redux/ordersSlice";

// Маппинг статусов на русский
const statusMap = {
  pending: 'Ожидает',
  confirmed: 'Подтвержден',
  shipped: 'Отправлен',
  completed: 'Завершен',
  cancelled: 'Отменен',
};

function OrderView() {
  const dispatch = useDispatch();
  const {orderId} = useParams(); // Получаем id заказа из URL
  const navigate = useNavigate();
  const apiUrl = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);

  const user = useSelector((state) => state.auth.user);

  // Функция для получения статуса на русском
  const getStatusInRussian = (status) => {
    return statusMap[status] || status; // Если статус не найден, выводим исходный
  };

  // Функция для загрузки данных о заказе
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const headers = token ? {Authorization: `Bearer ${token}`} : {};
        const response = await fetch(`${apiUrl}/orders/${orderId}`, {
          method: 'GET', // Указываем метод запроса, по умолчанию 'GET'
          headers, // Заголовки, включая токен, если он есть
        });
        if (!response.ok) {
          throw new Error('Заказ не найден');
        }
        const data = await response.json();
        setOrder(data); // Заполняем данные о заказе
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [apiUrl, orderId, token]);

  const hasRole = (role) => user?.roles?.some(r => r.name === role);

  const handleDelete = () => {
    dispatch(deleteOrder({
      apiUrl,
      token,
      orderId
    }))
      .unwrap() // Разворачиваем результат для обработки успеха или ошибки
      .then(() => {
        navigate(-1); // Возвращаемся на предыдущую страницу при успешном удалении
      })
      .catch((error) => {
        console.error('Ошибка при удалении заказа:', error);
      });
  }

  if (isLoading) {
    return <CircularProgress/>;
  }

  if (error) {
    return <Typography color="error">{`${error}`}</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Просмотр заказа
      </Typography>

      {order && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Заказ № {order.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Дата создания: {new Date(order.created_at).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Автор: {order.user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Статус: {getStatusInRussian(order.status)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Контрагент: {order.contractor.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Сумма: {order.total_amount} ₽
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Адрес доставки: {order.shipping_address}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Примечания: {order.notes || 'Нет примечаний'}
            </Typography>
            {/* Пример дополнительных данных о заказе */}
            {order.products && order.products.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Товары в заказе:
                </Typography>
                {order.products.map((item, index) => (
                  <Typography key={index} variant="body2" color="textSecondary">
                    {item.name} — {item.quantity} шт. ({item.price} ₽)
                  </Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Кнопки "Назад" и "Редактировать" */}
      <Box sx={{mt: 2, display: 'flex', gap: 2}}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/orders")} // Переход к списку заказов
        >
          Назад
        </Button>
        {hasRole('admin') ? (
          <Box sx={{display: 'flex', gap: 2, flexGrow: 1}}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate(`/orders/${orderId}/edit`)} // Переход к странице редактирования заказа
            >
              Редактировать
            </Button>
            {/* Кнопка удаления */}
            <Button
              variant="contained"
              color="error"
              sx={{width: 40, height: 40, minWidth: 40, padding: 0}}
              onClick={handleDelete}
            >
              X
            </Button>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default OrderView;
