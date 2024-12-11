import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '../contexts/apiContext';
import { useNavigate, useParams } from 'react-router-dom';

function ProductEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams(); // Получаем id продукта из URL
  const apiUrl = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    unit: '',
    sku: '',
  });
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);

  // Функция для загрузки данных о продукте
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const headers = token ? {Authorization: `Bearer ${token}`} : {};
        const response = await fetch(`${apiUrl}/products/${productId}`, {
          method: 'GET',  // Указываем метод запроса, по умолчанию 'GET'
          headers, // Заголовки, включая токен, если он есть
        });
        if (!response.ok) {
          throw new Error('Продукт не найден');
        }
        const data = await response.json();
        setFormData(data); // Заполняем форму данными продукта
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [apiUrl, productId]);

  // Обработчик изменения полей формы
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Отправка формы для обновления продукта
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Базовые заголовки
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Добавление токена, если он есть
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении продукта');
      }

      navigate(`/products/${productId}`); // Перенаправление на каталог после успешного обновления
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // if (error) {
  //   return <Typography color="error">{`${error}`}</Typography>;
  // }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Редактировать продукт
      </Typography>

      {/* Поля формы */}
      <TextField
        label="Наименование"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Описание"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        fullWidth
        multiline
        rows={3}
      />
      <TextField
        label="Цена"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
        type="number"
        fullWidth
      />
      <TextField
        label="Количество"
        name="stock_quantity"
        value={formData.stock_quantity}
        onChange={handleChange}
        required
        type="number"
        fullWidth
      />
      <TextField
        label="Единица измерения"
        name="unit"
        value={formData.unit}
        onChange={handleChange}
        required
        select
        fullWidth
      >
        <MenuItem value="шт">Шт</MenuItem>
        <MenuItem value="кг">Кг</MenuItem>
        <MenuItem value="л">Л</MenuItem>
        {/* Добавьте другие единицы измерения при необходимости */}
      </TextField>

      {/* Ошибка */}
      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}

      {/* Кнопки */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Обновление...' : 'Обновить продукт'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)} // Возвращаемся на предыдущую страницу
        >
          Отмена
        </Button>
      </Box>
    </Box>
  );
}

export default ProductEdit;
