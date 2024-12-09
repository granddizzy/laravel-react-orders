import React, {useEffect, useState} from 'react';
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
  TableRow, TableBody, TableContainer, Table, Paper, MenuItem, TextField
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts} from "../redux/productSlice";
import {useApi} from "../contexts/apiContext";
import {Link, useNavigate} from "react-router-dom";

function ProductCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = useApi();
  const [isLoading, setIsLoading] = useState(false);
  // Локальное состояние для формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    unit: '',
    sku: '',
  });

  const [error, setError] = useState(null);

  // Обновление полей формы
  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Отправка формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Включаем индикатор загрузки
    try {
      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // После успешного создания обновляем список продуктов
      navigate('/catalog');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };

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
        Создать новый продукт
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

      {/* Кнопка отправки */}
      <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать продукт'}
      </Button>
    </Box>
  );
}

export default ProductCreate;
