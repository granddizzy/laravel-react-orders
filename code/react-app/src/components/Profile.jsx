import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useApi } from '../contexts/apiContext';

const Profile = () => {
  const dispatch = useDispatch();

  // Получаем данные пользователя из Redux
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // Используем контекст для базового URL API
  const baseUrl = useApi();

  // Начальные значения формы - из данных Redux
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '', // Новое поле для пароля
    confirmPassword: '', // Новое поле для подтверждения пароля
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Сообщение об успешном обновлении
  const [isUpdating, setIsUpdating] = useState(false);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработчик отправки формы для обновления профиля
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true); // Начинаем обновление

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setIsUpdating(false);
      return;
    }

    const dataToSubmit = {
      name: formData.name,
      password: formData.password || undefined, // Отправляем пароль только если он изменен
    };

    try {
      const response = await axios.put(
        `${baseUrl}/profile`, // Ваш API-URL
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Отправляем токен для авторизации
          },
        }
      );
      // После успешного обновления профиля
      dispatch(setUser(response.data)); // Обновляем данные пользователя в Redux
      setSuccessMessage('Профиль успешно обновлен'); // Устанавливаем сообщение об успехе
      setError(null); // Очищаем ошибку
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsUpdating(false); // Завершаем процесс обновления
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Профиль
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Имя"
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
          disabled={isUpdating} // Отключаем поле при обновлении
        />
        <TextField
          label="Новый пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          variant="outlined"
          fullWidth
          disabled={isUpdating}
        />
        <TextField
          label="Подтвердите новый пароль"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          type="password"
          variant="outlined"
          fullWidth
          disabled={isUpdating}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isUpdating} // Отключаем кнопку при загрузке
          >
            {isUpdating ? <CircularProgress size={24} color="inherit" /> : 'Обновить'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
